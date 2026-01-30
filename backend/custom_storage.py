import os

from storages.backends.azure_storage import AzureStorage


class AzureMediaStorage(AzureStorage):
    """Custom Azure Storage backend for media files"""

    azure_container = "media"
    expiration_secs = None
    overwrite_files = True

    def __init__(self, *args, **kwargs):
        # Load credentials from environment at runtime
        self.account_name = os.getenv("AZURE_ACCOUNT_NAME")
        self.account_key = os.getenv("AZURE_ACCOUNT_KEY")
        print(f"🔧 AzureMediaStorage initialized with account: {self.account_name}")
        super().__init__(*args, **kwargs)

    def _save(self, name, content):
        """Override save to add logging"""
        print(f"📤 Uploading to Azure: {name}")
        try:
            result = super()._save(name, content)
            print(f"✅ Upload successful: {result}")
            return result
        except Exception as e:
            print(f"❌ Upload failed: {type(e).__name__}: {e}")
            raise
            raise
