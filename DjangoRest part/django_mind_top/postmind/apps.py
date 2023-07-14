from django.apps import AppConfig


class PostmindConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'postmind'

    def ready(self):
        import postmind.signals
