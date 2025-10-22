from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render
from storage.views import public_download_view

# простая функция для шаблонов
def home(request):
    return render(request, 'home.html')

def users_page(request):
    return render(request, 'users.html')

def storage_page(request):
    return render(request, 'storage.html')

urlpatterns = [
    path('', home, name='home'),                                    # главная страница
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),                       # регистрация/логин/выход
    path('api/storage/', include('storage.urls')),                  # файлы
    path('download/s/<str:token>/', public_download_view, name='public-download'),
    path('api/auth/page/', users_page, name='users-page'),          # демонстрация API пользователей
    path('api/storage/page/', storage_page, name='storage-page'),   # демонстрация API файлов
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
