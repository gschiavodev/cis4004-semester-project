from django.db.models import Count, Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from game.models import Game

class CustomPagination(PageNumberPagination):
    page_size = 10  # Default limit
    page_size_query_param = 'page_size'  # Allow clients to set page size via query parameter
    max_page_size = 100  # Maximum limit

class HighestStreakView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch users with their highest streak
        users_with_streaks = (
            Game.objects.values('user__username')  # Get the username
            .annotate(highest_streak=Max('streak'))  # Get the highest streak per user
            .order_by('-highest_streak')  # Order by highest streak descending
        )

        # Apply pagination
        paginator = CustomPagination()
        paginated_users = paginator.paginate_queryset(users_with_streaks, request)

        # Format response data
        response_data = [
            {"username": user['user__username'], "highest_streak": user['highest_streak']}
            for user in paginated_users
        ]
        return paginator.get_paginated_response(response_data)

class MostGamesPlayedView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch users with their total games played
        users_with_game_counts = (
            Game.objects.values('user__username')  # Get the username
            .annotate(game_count=Count('id'))  # Count the number of games per user
            .order_by('-game_count')  # Order by game count descending
        )

        # Apply pagination
        paginator = CustomPagination()
        paginated_users = paginator.paginate_queryset(users_with_game_counts, request)

        # Format response data
        response_data = [
            {"username": user['user__username'], "game_count": user['game_count']}
            for user in paginated_users
        ]
        return paginator.get_paginated_response(response_data)