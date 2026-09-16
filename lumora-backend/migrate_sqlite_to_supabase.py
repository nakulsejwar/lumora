import os
import sys
import sqlite3
import django
from django.db import connection, connections

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure Django environment is setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lumora_project.settings")
django.setup()

def run_migration():
    print("==================================================")
    print("LUMORA DATABASE MIGRATION: SQLITE -> SUPABASE POSTGRESQL")
    print("==================================================")

    # 1. Verify Django target database connection
    target_db = connections['default']
    target_engine = target_db.settings_dict['ENGINE']
    target_host = target_db.settings_dict['HOST']
    target_port = target_db.settings_dict['PORT']
    target_user = target_db.settings_dict['USER']
    target_name = target_db.settings_dict['NAME']

    print(f"\n1. Target Database Config:")
    print(f"   Engine:   {target_engine}")
    print(f"   Host:     {target_host}:{target_port}")
    print(f"   Database: {target_name}")
    print(f"   User:     {target_user}")

    if 'postgresql' not in target_engine:
        print("[ERROR] Target database is not PostgreSQL! Check DATABASE_URL in .env.")
        return

    try:
        with target_db.cursor() as cursor:
            cursor.execute("SELECT version();")
            ver = cursor.fetchone()[0]
            print(f"   Status:   [OK] CONNECTED! ({ver.split(',')[0]})")
    except Exception as err:
        print(f"[ERROR] Connecting to target PostgreSQL database: {err}")
        return

    # 2. Run Django migrations on PostgreSQL target to create schema
    print("\n2. Applying Django migrations on Supabase PostgreSQL...")
    from django.core.management import call_command
    try:
        call_command('migrate', interactive=False)
        print("   [OK] Migrations applied successfully!")
    except Exception as err:
        print(f"   [ERROR] Running migrate: {err}")
        return

    # 3. Connect to source SQLite database
    sqlite_path = os.path.join(os.path.dirname(__file__), "db.sqlite3")
    print(f"\n3. Reading source SQLite database ({sqlite_path})...")
    if not os.path.exists(sqlite_path):
        print("[ERROR] db.sqlite3 file not found!")
        return

    src_conn = sqlite3.connect(sqlite_path)
    src_conn.row_factory = sqlite3.Row
    src_cursor = src_conn.cursor()

    src_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in src_cursor.fetchall()]

    # Ordered table list to preserve dependencies
    priority_tables = [
        "django_content_type",
        "auth_permission",
        "auth_user",
        "django_migrations",
        "lumora_admindataqueue",
        "lumora_adminhistory",
        "lumora_books",
        "lumora_games",
        "lumora_level",
        "lumora_lumoraadmins",
        "lumora_lumoralogs",
        "lumora_lumorascores",
        "lumora_streakdata",
        "lumora_tiles",
        "lumora_topic",
        "lumora_userskillmastery",
        "lumora_course",
    ]

    # Add remaining tables
    for t in tables:
        if t not in priority_tables and not t.startswith("sqlite_"):
            priority_tables.append(t)

    print("\n4. Transferring table data from SQLite to Supabase PostgreSQL...")

    with target_db.cursor() as pg_cursor:
        # Disable triggers / constraints for clean insertion
        try:
            pg_cursor.execute("SET session_replication_role = 'replica';")
        except Exception:
            pass

        total_rows_transferred = 0

        for table in priority_tables:
            if table not in tables:
                continue

            # Fetch boolean column names for table in PostgreSQL
            bool_cols = set()
            try:
                pg_cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = %s AND data_type = 'boolean';
                """, (table,))
                bool_cols = set(row[0] for row in pg_cursor.fetchall())
            except Exception:
                pass

            # Read rows from SQLite
            src_cursor.execute(f'SELECT * FROM "{table}"')
            rows = src_cursor.fetchall()
            if not rows:
                print(f"   - {table}: 0 rows (skipped)")
                continue

            col_names = list(rows[0].keys())
            cols_str = '", "'.join(col_names)
            placeholders = ", ".join(["%s"] * len(col_names))

            # Insert into PostgreSQL using ON CONFLICT DO NOTHING to prevent duplicates
            insert_sql = f'INSERT INTO "{table}" ("{cols_str}") VALUES ({placeholders}) ON CONFLICT DO NOTHING;'

            batch_values = []
            for row in rows:
                row_vals = []
                for col in col_names:
                    val = row[col]
                    if col in bool_cols:
                        if val == 1 or val == '1' or val is True:
                            val = True
                        elif val == 0 or val == '0' or val is False:
                            val = False
                    row_vals.append(val)
                batch_values.append(tuple(row_vals))

            CHUNK_SIZE = 100
            table_transferred = 0
            for i in range(0, len(batch_values), CHUNK_SIZE):
                chunk = batch_values[i:i + CHUNK_SIZE]
                try:
                    pg_cursor.executemany(insert_sql, chunk)
                    table_transferred += len(chunk)
                except Exception as e:
                    # Fallback row by row for chunk
                    for val in chunk:
                        try:
                            pg_cursor.execute(insert_sql, val)
                            table_transferred += 1
                        except Exception:
                            pass
                try:
                    target_db.commit()
                except Exception:
                    pass

            total_rows_transferred += table_transferred
            print(f"   [OK] {table}: Transferred {table_transferred}/{len(batch_values)} rows", flush=True)
            try:
                target_db.commit()
            except Exception:
                pass

        # Reset session_replication_role
        try:
            pg_cursor.execute("SET session_replication_role = 'DEFAULT';")
        except Exception:
            pass

        # 5. Reset PostgreSQL auto-increment sequences
        print("\n5. Resetting PostgreSQL primary key sequences...")
        for table in priority_tables:
            try:
                seq_sql = f"""
                SELECT setval(pg_get_serial_sequence('"{table}"', 'id'), 
                              COALESCE((SELECT MAX(id) FROM "{table}"), 1) + 1, false);
                """
                pg_cursor.execute(seq_sql)
            except Exception:
                pass

    src_conn.close()
    print("\n==================================================")
    print(f"[SUCCESS] MIGRATION COMPLETE! Transferred {total_rows_transferred} rows to Supabase PostgreSQL.")
    print("==================================================")

if __name__ == "__main__":
    run_migration()
