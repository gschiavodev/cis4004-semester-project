from django.urls import path
from .views import (
    CreateGameView, 
    SubmitAnswerView, 
    EndGameView, 
    ModifyHeartsView, 
    PreviewRiddleView,
    CurrentRiddleView,
    CurrentRiddleAnswerView,
    AssignNewRiddleView
)

urlpatterns = [
    path('start/', CreateGameView.as_view(), name='start_game'),
    path('end/', EndGameView.as_view(), name='end_game'),
    path('submit-answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('modify-hearts/', ModifyHeartsView.as_view(), name='modify_hearts'),
    path('preview-riddle/', PreviewRiddleView.as_view(), name='preview_riddle'),
    path('current-riddle/', CurrentRiddleView.as_view(), name='current_riddle'),
    path('current-riddle-answer/', CurrentRiddleAnswerView.as_view(), name='current_riddle_answer'),
    path('assign-new-riddle/', AssignNewRiddleView.as_view(), name='assign_new_riddle'),
]
