import os
import time
import schedule
import subprocess
import threading

def stop_django_server():
    """Stops any running Django server or Gunicorn process."""
    try:
        subprocess.run(["pkill", "-f", "gunicorn"], check=True)
        print("Gunicorn server stopped.")
    except Exception:
        pass

    try:
        subprocess.run(["pkill", "-f", "python manage.py runserver"], check=True)
        print("Django dev server stopped.")
    except Exception:
        pass

def start_django_server():
    """Starts the Django server binding dynamically to $PORT provided by Railway / hosting platform."""
    stop_django_server()
    port = os.environ.get("PORT", "8004")
    print(f"Starting Django server on port {port}...")
    try:
        subprocess.Popen(["gunicorn", "lumora_project.wsgi:application", f"--bind=0.0.0.0:{port}", "--workers=3", "--timeout=120"])
        print(f"Gunicorn started successfully on 0.0.0.0:{port}")
    except Exception as e:
        print(f"Gunicorn start failed ({e}), falling back to runserver...")
        subprocess.Popen(["python", "manage.py", "runserver", f"0.0.0.0:{port}"])

def run_scheduler():
    """Runs the scheduled tasks."""
    while True:
        schedule.run_pending()
        time.sleep(1)

# Schedule the task to run every Monday and Tuesday at 12:10 UTC
schedule.every().monday.at("12:10").do(start_django_server)
schedule.every().tuesday.at("12:10").do(start_django_server)

# Initial start
start_django_server()

# Start the scheduler in a separate thread
scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()

# Main thread remains active
print("Scheduler is running in the background. Main thread is keeping application alive.")

# Keep the main thread alive
while True:
    time.sleep(1)
