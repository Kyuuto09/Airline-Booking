import os

from storages.backends.azure_storage import AzureStorage


class AzureMediaStorage(AzureStorage):
    """Custom Azure Storage backend for media files"""

    account_name = os.getenv("AZURE_ACCOUNT_NAME")
    account_key = os.getenv("AZURE_ACCOUNT_KEY")
    azure_container = "media"
    expiration_secs = None
    overwrite_files = True  # Allow overwriting existing files
