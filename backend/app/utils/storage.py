import os
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile
import shutil
from pathlib import Path

# S3 Configuration from Environment Variables
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# Initialize S3 Client
s3_client = None
if S3_BUCKET and AWS_ACCESS_KEY and AWS_SECRET_KEY:
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        region_name=AWS_REGION
    )

def save_file(file: UploadFile, folder: str) -> str:
    """
    Saves a file to S3 if configured, otherwise saves locally.
    Returns the public URL (for S3) or the local relative path.
    """
    file_name = f"{os.urandom(8).hex()}_{file.filename}"
    
    # --- Option A: Upload to S3 ---
    if s3_client:
        try:
            s3_client.upload_fileobj(
                file.file,
                S3_BUCKET,
                f"{folder}/{file_name}",
                ExtraArgs={"ACL": "public-read"} # Make publicly accessible
            )
            # Return the S3 URL
            return f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{folder}/{file_name}"
        except NoCredentialsError:
            print("AWS credentials not found. Falling back to local storage.")
        except Exception as e:
            print(f"S3 Upload failed: {e}. Falling back to local storage.")

    # --- Option B: Local Fallback ---
    # Determine base directory (backend root)
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    local_path = BASE_DIR / "data" / "uploads" / folder
    local_path.mkdir(parents=True, exist_ok=True)
    
    full_path = local_path / file_name
    with open(full_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return local relative path (as currently used in your DB)
    return f"/uploads/{folder}/{file_name}"

def delete_file(file_path: str):
    """
    Optional: Delete a file from S3 or local disk.
    """
    if s3_client and "amazonaws.com" in file_path:
        # Extract key from URL
        key = file_path.split(".com/")[-1]
        try:
            s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
        except Exception as e:
            print(f"S3 Delete failed: {e}")
    elif file_path.startswith("/uploads/"):
        # Local delete
        BASE_DIR = Path(__file__).resolve().parent.parent.parent
        full_path = BASE_DIR / "data" / file_path.lstrip("/")
        if os.path.exists(full_path):
            os.remove(full_path)
