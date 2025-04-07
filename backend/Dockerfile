# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory
WORKDIR /backend

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the project into the container
COPY . .

# Expose the port
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]