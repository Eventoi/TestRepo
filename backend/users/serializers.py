# сериализаторы для регистрации и показа пользователя
from rest_framework import serializers
from .models import MyUser
import re

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = MyUser
        fields = ('username','full_name','email','password')

    def validate_username(self, value):
        # логин: латинские буквы и цифры, первый символ буква, 4-20 символов
        if not re.match(r'^[A-Za-z][A-Za-z0-9]{3,19}$', value):
            raise serializers.ValidationError("Логин: латинские буквы/цифры, начать с буквы, длина 4-20")
        if MyUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Логин занят")
        return value

    def validate_email(self, value):
        if MyUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email уже используется")
        return value

    def validate_password(self, value):
        # пароль: min6, 1 заглавная, 1 цифра, 1 спец. символ
        if len(value) < 6:
            raise serializers.ValidationError("Пароль должен быть минимум 6 символов")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Нужна заглавная буква")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Нужна цифра")
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("Нужен специальный символ")
        return value

    def create(self, validated_data):
        user = MyUser(username=validated_data['username'],
                      email=validated_data['email'],
                      full_name=validated_data.get('full_name',''))
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ('id','username','full_name','email','is_administrator','storage_rel_path')