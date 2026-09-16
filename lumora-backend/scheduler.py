import os
import time
import schedule
import subprocess
import threading

def stop_django_server():
    """Stops any running Django server."""
    try:
        # Find and kill the process running the Django server
        subprocess.run(["pkill", "-f", "python manage.py runserver"], check=True)
        print("Django server stopped.")
    except subprocess.CalledProcessError:
        print("No Django server running.")

def start_django_server():
    """Starts the Django server."""
    stop_django_server()
    print("Starting Django server...")
    subprocess.Popen(["python", "manage.py", "runserver", "0.0.0.0:8004"])

def run_scheduler():
    """Runs the scheduled tasks."""
    while True:
        schedule.run_pending()
        time.sleep(1)

# Schedule the task to run every Monday,Tuesday at 00:10:00 UTC
schedule.every().monday.at("12:10").do(start_django_server)
schedule.every().tuesday.at("12:10").do(start_django_server)

# Initial start
start_django_server()

# Start the scheduler in a separate thread
scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()

# Main thread can perform other tasks
print("Scheduler is running in the background. Main thread is free for other tasks.")

# Keep the main thread alive
while True:
    time.sleep(1)
