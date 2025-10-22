# модель для файлов в хранилище
from django.db import models
from django.conf import settings
import uuid, os

def user_file_path(instance, filename):
    # храним файлы внутри MEDIA_ROOT/<storage_rel_path>/<uuid>.<ext>
    ext = os.path.splitext(filename)[1]
    unique = uuid.uuid4().hex
    return os.path.join(instance.owner.storage_rel_path, f"{unique}{ext}")

class FileRecord(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files')
    original_name = models.CharField(max_length=512)
    stored_file = models.FileField(upload_to=user_file_path)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    special_link = models.CharField(max_length=64, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.special_link:
            self.special_link = uuid.uuid4().hex
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.original_name}"