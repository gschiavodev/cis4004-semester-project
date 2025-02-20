from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistrationSerializer, LoginSerializer, UserSerializer

class RegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'detail': 'Already logged in.'}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully.', 'email': user.email}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        return Response({'detail': 'Method "GET" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'detail': 'Already logged in.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            if user is None:
                return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
            login(request, user)
            return Response({'message': 'Logged in successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        return Response({'detail': 'Method "GET" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'Not logged in.'}, status=status.HTTP_401_UNAUTHORIZED)
        logout(request)
        return Response({'message': 'Logged out successfully.'})
    
    def get(self, request, *args, **kwargs):
        return Response({'detail': 'Method "GET" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class UserDetailView(APIView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'detail': 'User not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        return Response({'detail': 'Method "POST" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)