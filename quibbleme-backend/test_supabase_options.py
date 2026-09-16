import psycopg2
import sys

host = "aws-0-ap-southeast-1.pooler.supabase.com"
project_ref = "mvijwadhyvljyxzpyjdd"
password = "nakulsejwar02@"

user_options = [
    f"postgres.{project_ref}",
    f"postgres",
    f"postgres@{project_ref}",
]

ports = [6543, 5432]

print("Testing Supabase Pooler options...")

for u in user_options:
    for p in ports:
        for ssl in ["require", "prefer", "allow", "disable"]:
            try:
                print(f"Trying user={u}, host={host}:{p}, sslmode={ssl}...")
                conn = psycopg2.connect(
                    dbname="postgres",
                    user=u,
                    password=password,
                    host=host,
                    port=p,
                    sslmode=ssl,
                    connect_timeout=5
                )
                print(f"\n🎉🎉🎉 CONNECTED SUCCESSFULLY! 🎉🎉🎉")
                print(f"User: {u}, Port: {p}, SSL: {ssl}")
                cursor = conn.cursor()
                cursor.execute("SELECT version();")
                print("Version:", cursor.fetchone()[0])
                conn.close()
                sys.exit(0)
            except Exception as e:
                err = str(e).strip().replace("\n", " ")
                print(f"  Result: {err}")
