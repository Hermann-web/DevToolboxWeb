# Use the official Python base image
FROM python:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the local directory contents into the container at /app
COPY . /app/

# Install required Python dependencies
RUN pip install -r /app/requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
