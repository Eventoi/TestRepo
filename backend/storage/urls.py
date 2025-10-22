from django.urls import path
from .views import FileListCreateView, FileDetailView, FileDownloadView, FileShareView, StorageStatsView

urlpatterns = [
    path('files/', FileListCreateView.as_view(), name='files-list-create'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='file-detail'),
    path('files/<int:pk>/download/', FileDownloadView.as_view(), name='file-download'),
    path('files/<int:pk>/share/', FileShareView.as_view(), name='file-share'),
    path('stats/', StorageStatsView.as_view(), name='storage-stats'),
]