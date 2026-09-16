FROM python:3.11

# setup environment variable  
ENV DockerHOME=/app 

# set work directory  
RUN mkdir -p $DockerHOME  

# where your code lives  
WORKDIR $DockerHOME  

# set environment variables  
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1  

# Install dependencies
RUN pip install --upgrade pip  
RUN pip install -U pip setuptools

# Copy the whole project to your docker home directory
COPY . $DockerHOME  

# Install Python dependencies
RUN pip install -r requirements.txt  
RUN pip install schedule

# Expose port  
EXPOSE 8004

# Copy scheduler script
COPY scheduler.py /scheduler.py

# Start the scheduler
CMD ["python", "scheduler.py"]
