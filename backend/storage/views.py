# простые API views для работы с файлами
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.utils.encoding import smart_str
from django.utils import timezone
from .models import FileRecord
from .serializers import FileRecordSerializer, FileUploadSerializer
from django.db.models import Sum, Count

class FileListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        # если админ и передан user_id, возвращаем файлы того пользователя
        user_id = request.query_params.get('user_id')
        if request.user.is_authenticated and request.user.is_administrator and user_id:
            files = FileRecord.objects.filter(owner__id=user_id)
        else:
            if not request.user.is_authenticated:
                return Response({'detail':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            files = FileRecord.objects.filter(owner=request.user)
        serializer = FileRecordSerializer(files, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'detail':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = FileUploadSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            record = serializer.save()
            return Response(FileRecordSerializer(record).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(FileRecord, pk=pk)

    def get(self, request, pk):
        file = self.get_object(pk)
        if not (request.user.is_authenticated and (request.user.is_administrator or file.owner == request.user)):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        return Response(FileRecordSerializer(file).data)

    def delete(self, request, pk):
        file = self.get_object(pk)
        if not (request.user.is_authenticated and (request.user.is_administrator or file.owner == request.user)):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        # удаляем файл с диска и запись
        file.stored_file.delete(save=False)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        file = self.get_object(pk)
        if not (request.user.is_authenticated and (request.user.is_administrator or file.owner == request.user)):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        # можно поменять комментарий и оригинальное имя (rename)
        changed = False
        if 'comment' in request.data:
            file.comment = request.data.get('comment','')
            changed = True
        if 'new_name' in request.data:
            file.original_name = request.data.get('new_name')
            changed = True
        if changed:
            file.save()
        return Response(FileRecordSerializer(file).data)

class FileDownloadView(APIView):
    def get(self, request, pk):
        file = get_object_or_404(FileRecord, pk=pk)
        if not (request.user.is_authenticated and (request.user.is_administrator or file.owner == request.user)):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        # возвращаем файл и обновляем last_downloaded_at
        f = file.stored_file
        if not f:
            raise Http404("File not found")
        resp = FileResponse(f.open('rb'))
        resp['Content-Length'] = file.size
        resp['Content-Disposition'] = f'attachment; filename="{smart_str(file.original_name)}"'
        file.last_downloaded_at = timezone.now()
        file.save(update_fields=['last_downloaded_at'])
        return resp

# специальная ссылка обезличена (по ТЗ). Uuid.hex не содержит инфы о пользователе
class FileShareView(APIView):
    def post(self, request, pk):
        file = get_object_or_404(FileRecord, pk=pk)
        if not (request.user.is_authenticated and (request.user.is_administrator or file.owner == request.user)):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        # просто возвращаем поле special_link (уже генерируется в save)
        if not file.special_link:
            file.special_link = uuid.uuid4().hex
            file.save(update_fields=['special_link'])
        return Response({'special_link': file.special_link})

# публичная функция скачивания по токену (без авторизации)
def public_download_view(request, token):
    try:
        file = FileRecord.objects.get(special_link=token)
    except FileRecord.DoesNotExist:
        raise Http404("File not found")
    f = file.stored_file
    if not f:
        raise Http404("File data missing")
    resp = FileResponse(f.open('rb'))
    resp['Content-Length'] = file.size
    resp['Content-Disposition'] = f'attachment; filename="{smart_str(file.original_name)}"'
    file.last_downloaded_at = timezone.now()
    file.save(update_fields=['last_downloaded_at'])
    return resp

# админ-статистика по пользователям (кол-во файлов, суммарный размер)
class StorageStatsView(APIView):
    def get(self, request):
        if not (request.user.is_authenticated and request.user.is_administrator):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        users = []
        from django.contrib.auth import get_user_model
        User = get_user_model()
        for u in User.objects.all():
            agg = u.files.aggregate(count=Count('id'), size=Sum('size'))
            users.append({
                'id': u.id,
                'username': u.username,
                'is_administrator': u.is_administrator,
                'files_count': agg['count'] or 0,
                'total_size': agg['size'] or 0,
                'storage_link': f"/api/storage/?user_id={u.id}"
            })
        return Response(users)