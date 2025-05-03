FROM python:3.9-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg libsndfile1 sox wget unzip git && \
    pip install --no-cache-dir montreal-forced-aligner fastapi uvicorn

# Create working directory
WORKDIR /app

# Copy your FastAPI app code
COPY app /app

# Expose the port
EXPOSE 6501

# Run FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "6501"]
