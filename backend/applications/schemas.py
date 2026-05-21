from ninja import Schema, Field
from typing import Optional
from datetime import datetime


class ApplicationBase(Schema):
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: Optional[str] = ''


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(ApplicationBase):
    pass


class ApplicationSubmit(Schema):
    pass


class ReviewerDecisionIn(Schema):
    decision: str = Field(..., description='approve, need_more_information, or reject')
    reviewer_comment: Optional[str] = ''


class ApplicationOut(Schema):
    id: int
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: Optional[str]
    status: str
    reviewer_comment: Optional[str]
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]
