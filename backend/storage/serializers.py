from rest_framework import serializers
from .models import FileRecord

class FileRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileRecord
        fields = ('id','owner','original_name','stored_file','size','uploaded_at','last_downloaded_at','comment','special_link')
        read_only_fields = ('id','owner','size','uploaded_at','last_downloaded_at','special_link')

class FileUploadSerializer(serializers.Serializer):
    # простой загрузчик файла + комментарий
    file = serializers.FileField()
    comment = serializers.CharField(allow_blank=True, required=False)

    def create(self, validated_data):
        request = self.context.get('request')
        f = validated_data['file']
        comment = validated_data.get('comment','')
        owner = request.user
        record = FileRecord(owner=owner, original_name=f.name, size=f.size, comment=comment)
        # сохраняет файл в MEDIA_ROOT через storage.models.user_file_path
        record.stored_file.save(f.name, f, save=True)
        return record