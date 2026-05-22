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

# Backwards-compatible single router (kept for compatibility)
legacy_api = Router(tags=['applications'])


@legacy_api.post('/applications/', response=ApplicationOut)
def create_application(request, payload: ApplicationCreate):
    application = Application.objects.create(**payload.dict())
    return application


@legacy_api.get('/applications/', response=List[ApplicationOut])
@paginate
def list_applications(request):
    return Application.objects.all()


@legacy_api.get('/applications/{application_id}/', response=ApplicationOut)
def get_application(request, application_id: int):
    application = get_application_or_404(application_id)
    return application


@legacy_api.put('/applications/{application_id}/', response=ApplicationOut)
def update_draft(request, application_id: int, payload: ApplicationUpdate):
    application = get_application_or_404(application_id)
    try:
        return update_application(application, payload.dict())
    except ValueError as exc:
        raise HttpError(400, str(exc))


@legacy_api.post('/applications/{application_id}/submit/', response=ApplicationOut)
def submit_draft(request, application_id: int):
    application = get_application_or_404(application_id)
    try:
        return submit_application(application)
    except ValueError as exc:
        raise HttpError(400, str(exc))


@legacy_api.post('/applications/{application_id}/start-review/', response=ApplicationOut)
def start_application_review(request, application_id: int):
    application = get_application_or_404(application_id)
    try:
        return start_review(application)
    except ValueError as exc:
        raise HttpError(400, str(exc))


@legacy_api.post('/applications/{application_id}/decision/', response=ApplicationOut)
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


# Applicant-facing router: create/edit/submit and personal list
applicant_api = Router(tags=['applicant'])


@applicant_api.post('/applications/', response=ApplicationOut)
def applicant_create_application(request, payload: ApplicationCreate):
    application = Application.objects.create(**payload.dict())
    return application


@applicant_api.get('/applications/', response=List[ApplicationOut])
@paginate
def applicant_list_applications(request):
    return Application.objects.all()


@applicant_api.get('/applications/{application_id}/', response=ApplicationOut)
def applicant_get_application(request, application_id: int):
    application = get_application_or_404(application_id)
    return application


@applicant_api.put('/applications/{application_id}/', response=ApplicationOut)
def applicant_update_draft(request, application_id: int, payload: ApplicationUpdate):
    application = get_application_or_404(application_id)
    try:
        return update_application(application, payload.dict())
    except ValueError as exc:
        raise HttpError(400, str(exc))


@applicant_api.post('/applications/{application_id}/submit/', response=ApplicationOut)
def applicant_submit_draft(request, application_id: int):
    application = get_application_or_404(application_id)
    try:
        return submit_application(application)
    except ValueError as exc:
        raise HttpError(400, str(exc))


# Official-facing router: review operations
official_api = Router(tags=['official'])


@official_api.get('/applications/', response=List[ApplicationOut])
@paginate
def official_list_applications(request):
    # Official typically reviews submitted/under review items; filter if desired
    # Keep decided items visible to officials as well (approved/rejected)
    return Application.objects.filter(status__in=[
        Application.STATUS_SUBMITTED,
        Application.STATUS_UNDER_REVIEW,
        Application.STATUS_NEED_MORE_INFO,
        Application.STATUS_APPROVED,
        Application.STATUS_REJECTED,
    ])


@official_api.get('/applications/{application_id}/', response=ApplicationOut)
def official_get_application(request, application_id: int):
    application = get_application_or_404(application_id)
    return application


@official_api.post('/applications/{application_id}/start-review/', response=ApplicationOut)
def official_start_application_review(request, application_id: int):
    application = get_application_or_404(application_id)
    try:
        return start_review(application)
    except ValueError as exc:
        raise HttpError(400, str(exc))


@official_api.post('/applications/{application_id}/decision/', response=ApplicationOut)
def official_record_reviewer_decision(request, application_id: int, payload: ReviewerDecisionIn):
    application = get_application_or_404(application_id)
    try:
        return apply_reviewer_decision(
            application,
            payload.decision,
            payload.reviewer_comment or '',
        )
    except ValueError as exc:
        raise HttpError(400, str(exc))
