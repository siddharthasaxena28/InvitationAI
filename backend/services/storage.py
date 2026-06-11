import asyncio
import logging
from typing import Optional
import boto3
from botocore.exceptions import ClientError
from config import get_settings

logger = logging.getLogger(__name__)


class StorageService:
    """S3/MinIO storage service. Uses asyncio.to_thread() for async wrapping."""

    def __init__(self):
        self._client = None

    def _get_client(self):
        """Lazily create boto3 S3 client."""
        if self._client is None:
            settings = get_settings()
            kwargs = {
                "aws_access_key_id": settings.aws_access_key_id,
                "aws_secret_access_key": settings.aws_secret_access_key,
                "region_name": "us-east-1",
            }
            # Use MinIO endpoint in local dev
            if settings.minio_endpoint:
                kwargs["endpoint_url"] = settings.minio_endpoint
            self._client = boto3.client("s3", **kwargs)
            # Ensure bucket exists
            self._ensure_bucket(settings.s3_bucket_name)
        return self._client

    def _ensure_bucket(self, bucket_name: str) -> None:
        """Create bucket if it doesn't exist (MinIO / localstack friendly)."""
        client = self._client
        try:
            client.head_bucket(Bucket=bucket_name)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code in ("404", "NoSuchBucket"):
                try:
                    client.create_bucket(Bucket=bucket_name)
                    logger.info(f"Created bucket: {bucket_name}")
                except ClientError as create_err:
                    logger.warning(f"Could not create bucket {bucket_name}: {create_err}")
            else:
                logger.warning(f"Bucket check error for {bucket_name}: {e}")

    def _upload_bytes_sync(self, data: bytes, key: str, content_type: str) -> str:
        settings = get_settings()
        client = self._get_client()
        try:
            client.put_object(
                Bucket=settings.s3_bucket_name,
                Key=key,
                Body=data,
                ContentType=content_type,
                ACL="public-read",
            )
            # Build public URL
            if settings.minio_endpoint:
                url = f"{settings.minio_endpoint}/{settings.s3_bucket_name}/{key}"
            else:
                url = f"https://{settings.s3_bucket_name}.s3.amazonaws.com/{key}"
            return url
        except ClientError as e:
            logger.error(f"S3 upload failed for key={key}: {e}")
            raise

    def _presigned_url_sync(self, key: str, expires: int = 3600) -> str:
        settings = get_settings()
        client = self._get_client()
        url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.s3_bucket_name, "Key": key},
            ExpiresIn=expires,
        )
        return url

    def _upload_file_sync(self, file_path: str, key: str) -> str:
        settings = get_settings()
        client = self._get_client()
        try:
            client.upload_file(file_path, settings.s3_bucket_name, key)
            if settings.minio_endpoint:
                url = f"{settings.minio_endpoint}/{settings.s3_bucket_name}/{key}"
            else:
                url = f"https://{settings.s3_bucket_name}.s3.amazonaws.com/{key}"
            return url
        except ClientError as e:
            logger.error(f"S3 file upload failed for key={key}: {e}")
            raise

    async def upload_bytes(
        self, data: bytes, key: str, content_type: str
    ) -> str:
        """Upload raw bytes to S3/MinIO. Returns public URL."""
        return await asyncio.to_thread(
            self._upload_bytes_sync, data, key, content_type
        )

    async def generate_presigned_url(
        self, key: str, expires: int = 3600
    ) -> str:
        """Generate a presigned URL for private object access."""
        return await asyncio.to_thread(self._presigned_url_sync, key, expires)

    async def upload_file(self, file_path: str, key: str) -> str:
        """Upload a local file to S3/MinIO. Returns public URL."""
        return await asyncio.to_thread(self._upload_file_sync, file_path, key)
