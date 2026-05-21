from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string


class Application(models.Model):
    TYPE_RECORDATION = 'Recordation'
    TYPE_RENEWAL = 'Renewal'
    TYPE_CHANGE_OWNER = 'Change of Ownership'
    TYPE_CHANGE_NAME = 'Change of Name'
    TYPE_DISCONTINUATION = 'Discontinuation'

    STATUS_DRAFT = 'Draft'
    STATUS_SUBMITTED = 'Submitted'
    STATUS_UNDER_REVIEW = 'Under Review'
    STATUS_NEED_MORE_INFO = 'Need More Information'
    STATUS_APPROVED = 'Approved'
    STATUS_REJECTED = 'Rejected'

    TYPE_CHOICES = [
        (TYPE_RECORDATION, TYPE_RECORDATION),
        (TYPE_RENEWAL, TYPE_RENEWAL),
        (TYPE_CHANGE_OWNER, TYPE_CHANGE_OWNER),
        (TYPE_CHANGE_NAME, TYPE_CHANGE_NAME),
        (TYPE_DISCONTINUATION, TYPE_DISCONTINUATION),
    ]

    STATUS_CHOICES = [
        (STATUS_DRAFT, STATUS_DRAFT),
        (STATUS_SUBMITTED, STATUS_SUBMITTED),
        (STATUS_UNDER_REVIEW, STATUS_UNDER_REVIEW),
        (STATUS_NEED_MORE_INFO, STATUS_NEED_MORE_INFO),
        (STATUS_APPROVED, STATUS_APPROVED),
        (STATUS_REJECTED, STATUS_REJECTED),
    ]

    tracking_number = models.CharField(max_length=32, unique=True, editable=False)
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=200)
    application_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    reviewer_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = self._generate_tracking_number()
        super().save(*args, **kwargs)

    def _generate_tracking_number(self):
        prefix = 'APP'
        timestamp = timezone.now().strftime('%Y%m%d')
        random_part = get_random_string(6, allowed_chars='0123456789')
        return f'{prefix}-{timestamp}-{random_part}'

    def can_edit(self):
        return self.status in {self.STATUS_DRAFT, self.STATUS_NEED_MORE_INFO}

    def can_submit(self):
        return self.status in {self.STATUS_DRAFT, self.STATUS_NEED_MORE_INFO}

    def can_start_review(self):
        return self.status == self.STATUS_SUBMITTED

    def can_decide(self):
        return self.status == self.STATUS_UNDER_REVIEW
