from typing import List

from ninja import Router
from ninja.errors import HttpError
from ninja.pagination import paginate
from django.shortcuts import get_object_or_404
from .models import Application
from .schemas import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationOut,
    ReviewerDecisionIn,
)
from .services import (
    get_application_or_404,
    update_application,
    submit_application,
    start_review,
    apply_reviewer_decision,
)

api = Router(tags=['applications'])


@api.post('/', response=ApplicationOut)
def create_application(request, payload: ApplicationCreate):
    application = Application.objects.create(**payload.dict())
    return application


@api.get('/', response=List[ApplicationOut])
@paginate
def list_applications(request):
    return Application.objects.all()


@api.get('/{application_id}/', response=ApplicationOut)
def get_application(request, application_id: int):
    application = get_application_or_404(application_id)
    return application


@api.put('/{application_id}/', response=ApplicationOut)
def update_draft(request, application_id: int, payload: ApplicationUpdate):
    application = get_application_or_404(application_id)
    try:
        return update_application(application, payload.dict())
    except ValueError as exc:
        raise HttpError(400, str(exc))


@api.post('/{application_id}/submit/', response=ApplicationOut)
def submit_draft(request, application_id: int):
    application = get_application_or_404(application_id)
    try:
        return submit_application(application)
    except ValueError as exc:
        raise HttpError(400, str(exc))


@api.post('/{application_id}/start-review/', response=ApplicationOut)
def start_application_review(request, application_id: int):
    application = get_application_or_404(application_id)
    try:
        return start_review(application)
    except ValueError as exc:
        raise HttpError(400, str(exc))


@api.post('/{application_id}/decision/', response=ApplicationOut)
def record_reviewer_decision(request, application_id: int, payload: ReviewerDecisionIn):
    application = get_application_or_404(application_id)
    try:
        return apply_reviewer_decision(
            application,
            payload.decision,
            payload.reviewer_comment or '',
        )
    except ValueError as exc:
        raise HttpError(400, str(exc))
