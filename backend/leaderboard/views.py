from django.shortcuts import render
from .models import Leaderboard

def leaderboard_view(request):
    # Get the top 10 players ordered by score
    leaderboard = Leaderboard.objects.all().order_by('-score', 'timestamp')[:10]

    return render(request, 'leaderboard/leaderboard.html', {'leaderboard': leaderboard})
