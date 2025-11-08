# epic_nigeria_portal/accounts/management/commands/create_oauth2_app.py

from django.core.management.base import BaseCommand
from oauth2_provider.models import Application
from django.conf import settings

class Command(BaseCommand):
    help = 'Creates a default OAuth2 application for Swagger UI and API clients'

    def handle(self, *args, **options):
        # App name and client details
        app_name = "EPIC Portal Client"
        client_id = "epic_nigeria_mvp_client"  # optional: you can omit to auto-generate
        client_secret = "epic_secure_secret_2025"  # change in production!

        # Check if app already exists
        app, created = Application.objects.get_or_create(
            name=app_name,
            defaults={
                'client_type': Application.CLIENT_CONFIDENTIAL,
                'authorization_grant_type': Application.GRANT_PASSWORD,
                'client_id': client_id,
                'client_secret': client_secret,
                'skip_authorization': True,
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created OAuth2 application: "{app.name}"\n'
                    f'Client ID: {app.client_id}\n'
                    f'Client Secret: {app.client_secret}\n'
                    f'Grant Type: Resource Owner Password\n'
                    f'Use these credentials in Swagger UI or API clients.'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'OAuth2 application "{app.name}" already exists. Skipping creation.\n'
                    f'Client ID: {app.client_id}'
                )
            )