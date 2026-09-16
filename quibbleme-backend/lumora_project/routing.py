from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path

from django.core.asgi import get_asgi_application
# urls that handles the websocket connection is put here
websocket_urlpatterns=[
                    
]



application = ProtocolTypeRouter( 
    {
        'http': get_asgi_application(),
        'https': get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
               websocket_urlpatterns
            )
        ),
    }
)
