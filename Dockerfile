# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app/backend

# Set the working directory in the container
WORKDIR /app

# Install system dependencies for OpenCV and other libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements first to leverage Docker cache
COPY backend/requirements.txt .

# Install dependencies
# Note: This will install CPU versions of torch to keep the image size manageable
# since most standard cloud servers don't have GPUs.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend and frontend directories into the container
COPY backend /app/backend
COPY frontend /app/frontend

# Create necessary directories for runtime data (even if we move to S3 later)
RUN mkdir -p /app/backend/data/uploads/emotions \
    /app/backend/data/uploads/diary \
    /app/backend/data/reports

# Expose the port the app runs on
EXPOSE 8000

# Run the application using uvicorn
# We use 0.0.0.0 to allow external connections from the cloud
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
