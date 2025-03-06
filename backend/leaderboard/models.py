from django.db import models

class Leaderboard(models.Model):
    username = models.CharField(max_length=100)
    score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username}: {self.score} points"
