from django.db import models
from django.conf import settings

class Game(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hearts = models.IntegerField(default=10)
    streak = models.IntegerField(default=0)  # Total number of correct answers
    is_active = models.BooleanField(default=True)
    started_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(is_active=True),
                name='unique_active_game_per_user'
            )
        ]

    def __str__(self):
        return f"Game for {self.user.username} - Hearts: {self.hearts}, Correct Answers: {self.streak}"


class GameRiddle(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="game_riddles")
    question = models.TextField()
    answer = models.CharField(max_length=255)
    verification_score = models.FloatField(null=True, blank=True)  # AI model score (0 to 1)
    is_correct = models.BooleanField(null=True, blank=True)         # Set after answer evaluation
    answered_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = (
            "Correct" if self.is_correct
            else "Wrong" if self.is_correct is not None
            else "Pending"
        )
        return f"{self.game.user.username} - {self.question[:50]}... - {status}"
