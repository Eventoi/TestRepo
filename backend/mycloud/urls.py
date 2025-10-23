from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from storage.views import public_download_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),      # регистрация/логин/выход
    path('api/storage/', include('storage.urls')), # API файлов
    path('download/s/<str:token>/', public_download_view, name='public-download'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)