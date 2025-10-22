# простые API views: register, login, logout, me, список пользователей для администратора
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import authenticate, login, logout
from .serializers import RegisterSerializer, UserSerializer
from .models import MyUser
from django.shortcuts import get_object_or_404

class RegisterView(APIView):
    # регистрация открытая
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail':'created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail':'Неверный логин или пароль'}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)  # ставит сессионный cookie
        return Response(UserSerializer(user).data)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail':'logged out'})

class MeView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'detail':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(request.user).data)

# Админ: список всех пользователей (доступен только админу)
class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        # проверяем, что текущий пользователь — администратор
        user = self.request.user
        if not user.is_authenticated or not getattr(user, 'is_administrator', False):
            return MyUser.objects.none()
        return MyUser.objects.all()

# Удаление и изменение признака администратора — через отдельный view
class AdminUserDetailView(APIView):
    def delete(self, request, pk):
        user = request.user
        if not user.is_authenticated or not getattr(user, 'is_administrator', False):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        target = get_object_or_404(MyUser, pk=pk)
        if target.username == 'admin':
            return Response({'detail':'Нельзя удалить основного админа'}, status=status.HTTP_403_FORBIDDEN)
        target.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        user = request.user
        if not user.is_authenticated or not getattr(user, 'is_administrator', False):
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        target = get_object_or_404(MyUser, pk=pk)
        # менять только is_administrator и full_name по ТЗ
        if 'is_administrator' in request.data:
            target.is_administrator = bool(request.data.get('is_administrator'))
        if 'full_name' in request.data:
            target.full_name = request.data.get('full_name')
        target.save()
        return Response(UserSerializer(target).data)