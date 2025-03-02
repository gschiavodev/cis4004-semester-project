from rest_framework import serializers
from .models import Game, GameRiddle

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'user', 'hearts', 'streak', 'is_active', 'started_at', 'last_updated']

class GameRiddleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRiddle
        # Exclude the answer field for the public endpoint.
        fields = ['id', 'question', 'verification_score', 'is_correct', 'answered_at']
        read_only_fields = ['verification_score', 'is_correct', 'answered_at']

class GameRiddleAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRiddle
        # Include the answer field for secure access.
        fields = ['id', 'question', 'answer', 'verification_score', 'is_correct', 'answered_at']

class SubmitAnswerSerializer(serializers.Serializer):
    answer = serializers.CharField()

class ModifyHeartsSerializer(serializers.Serializer):
    change = serializers.IntegerField()
