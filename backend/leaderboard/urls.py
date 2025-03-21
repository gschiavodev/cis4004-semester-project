from django.urls import path
from .views import HighestStreakView, MostGamesPlayedView

urlpatterns = [
    path('highest-streak/', HighestStreakView.as_view(), name='highest_streak'),
    path('most-games-played/', MostGamesPlayedView.as_view(), name='most_games_played'),
]