from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from applications.api import api as applications_api

api = NinjaAPI()
api.add_router('applications/', applications_api)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
