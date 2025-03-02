from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Game, GameRiddle
import requests
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L6-v2')

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
        Attaches a new riddle to the game if there is no pending riddle.
        This will create a new GameRiddle only if there's no active (pending) one.
        """
        # Check if there's already an active riddle.
        if game.game_riddles.filter(is_correct__isnull=True).exists():
            raise ValueError("There is already an active riddle for this game.")
        
        riddle_data = GameService.fetch_riddle_from_api()
        if not riddle_data:
            raise ValueError("Failed to fetch a new riddle.")
        
        # Create and attach the new riddle.
        new_riddle = GameRiddle.objects.create(
            game=game,
            question=riddle_data['riddle'],
            answer=riddle_data['answer']
        )

        return new_riddle

    @staticmethod
    def modify_hearts(user, change):
        """Modify the hearts count (+ or -) for an active game."""
        game = get_object_or_404(Game, user=user, is_active=True)
        game.hearts += change

        if game.hearts <= 0:
            game.hearts = 0
            game.is_active = False
        elif game.hearts > 10:
            game.hearts = 10
        else:
            game.is_active = True

        game.last_updated = timezone.now()
        game.save()

        return game

    @staticmethod
    def verify_answer(riddle, user_answer):
        """Use sentence similarity to verify the answer."""
        correct_answer = riddle.answer
        embeddings = model.encode([correct_answer, user_answer], convert_to_tensor=True)
        similarity_score = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()

        return similarity_score

    @staticmethod
    def get_current_riddle(game):
        """Fetches the current active (pending) riddle for a game."""
        return game.game_riddles.filter(is_correct__isnull=True).first()

    @staticmethod
    def submit_riddle_answer(user, user_answer, pass_threshold=0.8):
        """Handles riddle answer submission logic and updates game state accordingly."""
        game = get_object_or_404(Game, user=user, is_active=True)
        current_riddle = GameService.get_current_riddle(game)
        if not current_riddle:
            raise ValueError("No pending riddle to answer.")

        verification_score = GameService.verify_answer(current_riddle, user_answer)
        # Update the riddle based on the verification score.
        current_riddle.verification_score = verification_score
        current_riddle.is_correct = verification_score >= pass_threshold
        current_riddle.answered_at = timezone.now()
        current_riddle.save()

        # Update game state based on whether the answer was correct.
        if current_riddle.is_correct:
            game.streak += 1
        else:
            game.hearts -= 1
            if game.hearts <= 0:
                game.hearts = 0
                game.is_active = False
        game.last_updated = timezone.now()
        game.save()

        return current_riddle
