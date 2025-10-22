from django.contrib import admin
from .models import MyUser
from django.contrib.auth.admin import UserAdmin

# простой админ-интерфейс для модели пользователя
@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    list_display = ('username','email','full_name','is_administrator','storage_rel_path','is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields':('full_name','is_administrator','storage_rel_path')}),
    )