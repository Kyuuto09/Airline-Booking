from booking.api.urls import booking_router
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

# posts
router.registry.extend(booking_router.registry)

urlpatterns = [
    path("", include(router.urls)),
]
