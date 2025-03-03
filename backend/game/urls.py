from django.urls import path
from .views import (
    CreateGameView,
    EndGameView,
    CurrentGameView,
    ModifyHeartsView,
    ModifyStreakView,
    PreviewRiddleView,
    CurrentRiddleView,
    CurrentRiddleAnswerView,
    SubmitAnswerView,
    AssignNewRiddleView,
)

urlpatterns = [
    path('start-game/', CreateGameView.as_view(), name='start_game'),
    path('end-game/', EndGameView.as_view(), name='end_game'),
    path('current-game/', CurrentGameView.as_view(), name='current_game'),
    path('modify-game-hearts/', ModifyHeartsView.as_view(), name='modify_hearts'),
    path('modify-game-streak/', ModifyStreakView.as_view(), name='modify_streak'),
    path('preview-riddle/', PreviewRiddleView.as_view(), name='preview_riddle'),
    path('current-riddle/', CurrentRiddleView.as_view(), name='current_riddle'),
    path('current-riddle-answer/', CurrentRiddleAnswerView.as_view(), name='current_riddle_answer'),
    path('submit-riddle-answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('assign-new-riddle/', AssignNewRiddleView.as_view(), name='assign_new_riddle'),
]
