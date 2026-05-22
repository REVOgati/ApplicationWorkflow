from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from applications.api import legacy_api, applicant_api, official_api

api = NinjaAPI()
# legacy routes kept for compatibility
api.add_router('', legacy_api)
api.add_router('applicant/', applicant_api)
api.add_router('official/', official_api)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
