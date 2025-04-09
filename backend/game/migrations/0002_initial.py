# Generated by Django 5.1.5 on 2025-04-08 17:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('game', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='gameriddle',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_riddles', to='game.game'),
        ),
        migrations.AddConstraint(
            model_name='game',
            constraint=models.UniqueConstraint(condition=models.Q(('is_active', True)), fields=('user',), name='unique_active_game_per_user'),
        ),
        migrations.AddConstraint(
            model_name='gameriddle',
            constraint=models.UniqueConstraint(condition=models.Q(('is_active', True)), fields=('game',), name='unique_active_riddle_per_game'),
        ),
    ]
