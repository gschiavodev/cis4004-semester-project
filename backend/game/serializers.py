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
        fields = ['id', 'question', 'verification_score', 'is_correct', 'answered_at', 'is_active']
        read_only_fields = ['verification_score', 'is_correct', 'answered_at', 'is_active']

class GameRiddleAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRiddle
        # Include the answer field for secure access.
        fields = ['id', 'question', 'answer', 'verification_score', 'is_correct', 'answered_at', 'is_active']

class SubmitAnswerSerializer(serializers.Serializer):
    answer = serializers.CharField()

class ModifyHeartsSerializer(serializers.Serializer):
    change = serializers.IntegerField()

class ModifyStreakSerializer(serializers.Serializer):
    change = serializers.IntegerField()

class SubmitAnswerResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRiddle
        fields = ['verification_score', 'is_correct', 'answered_at']