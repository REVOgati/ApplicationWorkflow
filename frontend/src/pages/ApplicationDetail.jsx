import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getApplication, getApplicationOfficial, submitApplication, startReview } from '../api';
import { useRole } from '../RoleContext';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { role } = useRole();

  useEffect(() => {
    const loader = role === 'official' ? getApplicationOfficial : getApplication;
    setLoading(true);
    loader(id)
      .then(setApplication)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, role]);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getApplication(id);
      setApplication(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setError('');
    try {
      await submitApplication(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartReview = async () => {
    setActionLoading(true);
    setError('');
    try {
      await startReview(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div>Loading application details…</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  const canEdit = ['Draft', 'Need More Information'].includes(application.status);
  const canSubmit = ['Draft', 'Need More Information'].includes(application.status);
  const canReview = application.status === 'Submitted';
  const canDecide = application.status === 'Under Review';

  return (
    <div>
      <div className="card">
        <h2>Application Details</h2>
        <p>Review the current workflow state and perform allowed transitions.</p>
      </div>

      {error && <div className="error">{error}</div>}
      <div className="card">
        <div className="grid">
          <div>
            <strong>Tracking Number</strong>
            <p>{application.tracking_number}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p>
              <span className="status-chip" data-status={application.status}>
                {application.status}
              </span>
            </p>
          </div>
          <div>
            <strong>Applicant</strong>
            <p>{application.applicant_name}</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>{application.applicant_email}</p>
          </div>
          <div>
            <strong>Company</strong>
            <p>{application.company_name}</p>
          </div>
          <div>
            <strong>Type</strong>
            <p>{application.application_type}</p>
          </div>
          <div>
            <strong>Created</strong>
            <p>{new Date(application.created_at).toLocaleString()}</p>
          </div>
          <div>
            <strong>Submitted</strong>
            <p>{application.submitted_at ? new Date(application.submitted_at).toLocaleString() : '—'}</p>
          </div>
          <div>
            <strong>Reviewed</strong>
            <p>{application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : '—'}</p>
          </div>
        </div>

        <h3>Description</h3>
        <p>{application.description || 'No description provided.'}</p>

        <h3>Reviewer Comment</h3>
        <p>{application.reviewer_comment || 'No reviewer comment yet.'}</p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {role === 'applicant' && canEdit && (
            <Link className="button secondary" to={`/applications/${id}/edit`}>
              Edit
            </Link>
          )}
          {role === 'applicant' && canSubmit && (
            <button className="button success" onClick={handleSubmit} disabled={actionLoading}>
              Submit Application
            </button>
          )}
          {role === 'official' && canReview && (
            <button className="button" onClick={handleStartReview} disabled={actionLoading}>
              Start Review
            </button>
          )}
          {role === 'official' && canDecide && (
            <Link className="button" to={`/applications/${id}/decision`}>
              Record Decision
            </Link>
          )}
          <button className="button secondary" onClick={() => navigate(application.status === 'Draft' ? -1 : '/') }>
            {application.status === 'Draft' ? 'Back' : 'To dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
