from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistrationSerializer, LoginSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import User

GOOGLE_CLIENT_ID = "1095568890026-ks1cepaebcec4o7amrgnhqesnte545k1.apps.googleusercontent.com"

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if this is a Google OAuth login
        google_token = request.data.get('token')
        if google_token:
            try:
                # Verify the Google token
                idinfo = id_token.verify_oauth2_token(google_token, requests.Request(), GOOGLE_CLIENT_ID)
                email = idinfo['email']

                # Check if the user exists
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    response = JsonResponse({'error': 'No account found with this email. Please register first.'}, status=status.HTTP_404_NOT_FOUND)
                    response.delete_cookie('sessionid')  # Expire the sessionid cookie
                    return response

                # Log the user in
                login(request, user)
                return Response({'message': 'Logged in successfully with Google.'})
            except ValueError:
                response = JsonResponse({'error': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)
                response.delete_cookie('sessionid')  # Expire the sessionid cookie
                return response

        # Traditional login
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # Check if the user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                response = JsonResponse({'error': 'No account found with this email. Please register first.'}, status=status.HTTP_404_NOT_FOUND)
                response.delete_cookie('sessionid')  # Expire the sessionid cookie
                return response

            # Authenticate the user
            user = authenticate(request, username=email, password=password)
            if user is None:
                response = JsonResponse({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
                response.delete_cookie('sessionid')  # Expire the sessionid cookie
                return response

            # Log the user in
            login(request, user)
            return Response({'message': 'Logged in successfully.'})
        else:
            response = JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('sessionid')  # Expire the sessionid cookie
            return response

class RegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if this is a Google OAuth registration
        google_token = request.data.get('token')
        if google_token:
            try:
                # Verify the Google token
                idinfo = id_token.verify_oauth2_token(google_token, requests.Request(), GOOGLE_CLIENT_ID)
                email = idinfo['email']
                username = email.split('@')[0]  # Extract username from email

                # Check if the user already exists
                if User.objects.filter(email=email).exists():
                    response = JsonResponse({'error': 'User already exists.'}, status=status.HTTP_400_BAD_REQUEST)
                    response.delete_cookie('sessionid')  # Expire the sessionid cookie
                    return response

                # Create a new user
                user = User.objects.create_user(email=email, username=username)
                user.set_unusable_password()  # Google users won't have a password
                user.save()

                return Response({'message': 'User registered successfully with Google.'}, status=status.HTTP_201_CREATED)
            except ValueError:
                response = JsonResponse({'error': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)
                response.delete_cookie('sessionid')  # Expire the sessionid cookie
                return response

        # Traditional registration
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        else:
            response = JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('sessionid')  # Expire the sessionid cookie
            return response
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({'message': 'Logged out successfully.'})
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    