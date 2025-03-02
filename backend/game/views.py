from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .models import Game
from .serializers import GameSerializer, GameRiddleSerializer, GameRiddleAnswerSerializer, SubmitAnswerSerializer
from .services import GameService

class CreateGameView(LoginRequiredMixin, APIView):
    def post(self, request, *args, **kwargs):
        try:
            game = GameService.create_new_game(request.user)
            return Response({'game': GameSerializer(game).data}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class EndGameView(LoginRequiredMixin, APIView):
    def post(self, request, *args, **kwargs):
        game = GameService.end_game(request.user)
        return Response({'game': GameSerializer(game).data}, status=status.HTTP_200_OK)

class ModifyHeartsView(LoginRequiredMixin, APIView):
    def post(self, request, *args, **kwargs):
        change = int(request.data.get('change', 0))  # Expecting { "change": +1 } or { "change": -1 }
        game = GameService.modify_hearts(request.user, change)
        return Response({'game': GameSerializer(game).data}, status=status.HTTP_200_OK)

class PreviewRiddleView(LoginRequiredMixin, APIView):
    def get(self, request, *args, **kwargs):
        riddle_data = GameService.preview_new_riddle()
        if not riddle_data:
            return Response({'detail': 'Unable to fetch riddle.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(riddle_data, status=status.HTTP_200_OK)

class CurrentRiddleView(LoginRequiredMixin, APIView):
    def get(self, request, *args, **kwargs):
        game = get_object_or_404(Game, user=request.user, is_active=True)
        current_riddle = GameService.get_current_riddle(game)
        if not current_riddle:
            return Response({"detail": "No active riddle found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = GameRiddleSerializer(current_riddle)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CurrentRiddleAnswerView(LoginRequiredMixin, APIView):
    permission_classes = [IsAdminUser]  # Adjust permissions as needed

    def get(self, request, *args, **kwargs):
        game = get_object_or_404(Game, user=request.user, is_active=True)
        current_riddle = GameService.get_current_riddle(game)
        if not current_riddle:
            return Response({"detail": "No active riddle found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = GameRiddleAnswerSerializer(current_riddle)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AssignNewRiddleView(LoginRequiredMixin, APIView):
    def post(self, request, *args, **kwargs):
        game = get_object_or_404(Game, user=request.user, is_active=True)
        try:
            new_riddle = GameService.assign_new_riddle(game)
            return Response({
                'riddle': GameRiddleSerializer(new_riddle).data
            }, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class SubmitAnswerView(LoginRequiredMixin, APIView):
    def post(self, request, *args, **kwargs):
        serializer = SubmitAnswerSerializer(data=request.data)
        if serializer.is_valid():
            try:
                riddle = GameService.submit_riddle_answer(request.user, serializer.validated_data['answer'])
                return Response({'riddle': GameRiddleSerializer(riddle).data, 'is_correct': riddle.is_correct}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
