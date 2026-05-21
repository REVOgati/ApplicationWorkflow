from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Application


def get_application_or_404(application_id: int) -> Application:
    return get_object_or_404(Application, pk=application_id)


def update_application(application: Application, data: dict) -> Application:
    if not application.can_edit():
        raise ValueError('Only Draft or Need More Information applications can be edited.')

    for field in ['applicant_name', 'applicant_email', 'company_name', 'application_type', 'description']:
        if field in data:
            setattr(application, field, data[field])
    application.save()
    return application


def submit_application(application: Application) -> Application:
    if not application.can_submit():
        raise ValueError('Only Draft or Need More Information applications can be submitted.')
    application.status = Application.STATUS_SUBMITTED
    application.submitted_at = timezone.now()
    application.save()
    return application


def start_review(application: Application) -> Application:
    if not application.can_start_review():
        raise ValueError('Only Submitted applications can be moved to Under Review.')
    application.status = Application.STATUS_UNDER_REVIEW
    application.save()
    return application


def apply_reviewer_decision(application: Application, decision: str, reviewer_comment: str) -> Application:
    if not application.can_decide():
        raise ValueError('Only Under Review applications can receive a reviewer decision.')

    decision = decision.lower()
    if decision == 'approve' or decision == 'approved':
        application.status = Application.STATUS_APPROVED
        application.reviewer_comment = reviewer_comment or ''
    elif decision in {'need_more_information', 'need more information', 'more_information'}:
        if not reviewer_comment:
            raise ValueError('Reviewer comment is required for Need More Information.')
        application.status = Application.STATUS_NEED_MORE_INFO
        application.reviewer_comment = reviewer_comment
    elif decision == 'reject' or decision == 'rejected':
        if not reviewer_comment:
            raise ValueError('Reviewer comment is required for Rejected.')
        application.status = Application.STATUS_REJECTED
        application.reviewer_comment = reviewer_comment
    else:
        raise ValueError('Decision must be approve, need_more_information, or reject.')

    application.reviewed_at = timezone.now()
    application.save()
    return application
