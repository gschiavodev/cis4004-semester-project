from django.utils import timezone
from django.shortcuts import get_object_or_404
import requests

from .models import Game, GameRiddle

from sentence_transformers import CrossEncoder
from torch import torch

# Initialize both models
cross_encoder_model = CrossEncoder('cross-encoder/stsb-roberta-large', device='cuda' if torch.cuda.is_available() else 'cpu')

class GameService:
    @staticmethod
    def fetch_riddle_from_api():
        response = requests.get('https://riddles-api.vercel.app/random')
        if response.status_code == 200:
            return response.json()  # Expecting keys like 'riddle' and 'answer'
        
        return None

    @staticmethod
    def create_new_game(user):
        """Create a new game for a user if no active game exists."""
        if Game.objects.filter(user=user, is_active=True).exists():
            raise ValueError("User already has an active game.")
        
        game = Game.objects.create(user=user)

        return game

    @staticmethod
    def end_game(user):
        """Ends the active game for a user."""
        game = get_object_or_404(Game, user=user, is_active=True)
        game.is_active = False
        game.last_updated = timezone.now()
        game.save()

        return game

    @staticmethod
    def get_active_game(user):
        """Fetch active game for the user."""
        return Game.objects.filter(user=user, is_active=True).first()

    @staticmethod
    def preview_new_riddle():
        """
        Returns a new riddle from the API without saving it to any game.
        """
        return GameService.fetch_riddle_from_api()

    @staticmethod
    def assign_new_riddle(game):
        """
        Attaches a new riddle to the game, marking the current active riddle as inactive.
        """
        # Mark the current active riddle as inactive if it exists.
        current_riddle = game.game_riddles.filter(is_active=True).first()
        if current_riddle:
            current_riddle.is_active = False
            current_riddle.save()
        
        riddle_data = GameService.fetch_riddle_from_api()
        if not riddle_data:
            raise ValueError("Failed to fetch a new riddle.")
        
        # Create and attach the new riddle.
        new_riddle = GameRiddle.objects.create(
            game=game,
            question=riddle_data['riddle'],
            answer=riddle_data['answer'],
            is_active=True  # Mark the new riddle as active
        )

        return new_riddle

    @staticmethod
    def modify_hearts(user, change):
        """Modify the hearts count (+ or -) for an active game."""
        game = get_object_or_404(Game, user=user, is_active=True)
        game.hearts += change

        if game.hearts <= 0:
            game.hearts = 0

        if game.hearts >= 10:
            game.hearts = 10

        game.last_updated = timezone.now()
        game.save()

        return game

    @staticmethod
    def modify_streak(user, change):
        """Modify the streak count (+ or -) for an active game."""
        game = get_object_or_404(Game, user=user, is_active=True)
        game.streak += change

        if game.streak <= 0:
            game.streak = 0

        game.last_updated = timezone.now()
        game.save()

        return game

    @staticmethod
    def verify_answer(riddle, user_answer):
        """
        Verify answer using either cross-encoder or paraphrase model.
        :param riddle: The riddle object containing the correct answer.
        :param user_answer: The answer provided by the user.
        :return: A normalized similarity score between 0 and 1.
        """

        # Ensure the answer is in lowercase for consistent comparison
        user_answer = user_answer.lower()
        riddle.answer = riddle.answer.lower()

        # Check if the answer is empty
        if not user_answer:
            return 0.0
        
        # Compute similarity score using the cross-encoder model
        pair = [[riddle.answer, user_answer]]
        scores = cross_encoder_model.predict(pair)
        if scores is None or len(scores) == 0:
            return 0.0  # Return 0 if no score is found

        # Convert the first score to a float explicitly
        similarity_score = float(scores[0])
        return similarity_score

    @staticmethod
    def get_current_riddle(game):
        """Fetches the current active riddle for a game."""
        return game.game_riddles.filter(is_active=True).first()

    @staticmethod
    def submit_riddle_answer(user, user_answer):
        """Handles riddle answer submission logic and updates game state accordingly."""
        game = get_object_or_404(Game, user=user, is_active=True)
        current_riddle = GameService.get_current_riddle(game)
        if not current_riddle:
            raise ValueError("No active riddle to answer.")

        # Dynamic threshold based on answer length
        answer_length = len(current_riddle.answer.split())
        
        # Short answers (strict)
        if answer_length <= 3:
            pass_threshold = 0.50
        # Medium answers (moderate)
        elif answer_length <= 6:
            pass_threshold = 0.45
        # Long answers (forgiving)
        else:
            pass_threshold = 0.40

        # Use the desired verification method
        verification_score = GameService.verify_answer(current_riddle, user_answer)
        current_riddle.verification_score = verification_score
        current_riddle.is_correct = verification_score >= pass_threshold
        current_riddle.answered_at = timezone.now()
        current_riddle.save()

        return current_riddle