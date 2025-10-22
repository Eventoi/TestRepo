# модель пользователя — простой расширенный AbstractUser
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class MyUser(AbstractUser):
    # полное имя
    full_name = models.CharField(max_length=255, blank=True)
    # флаг администратора по ТЗ
    is_administrator = models.BooleanField(default=False)
    # относительный путь к хранилищу (внутри MEDIA_ROOT)
    storage_rel_path = models.CharField(max_length=255, blank=True, unique=True)

    def save(self, *args, **kwargs):
        # если нет storage_rel_path — генерируем простую уникальную строку
        if not self.storage_rel_path:
            self.storage_rel_path = f"user_{uuid.uuid4().hex[:12]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username