import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication, recordDecision } from '../api';

const DECISIONS = [
  { value: 'approve', label: 'Approve' },
  { value: 'need_more_information', label: 'Need More Information' },
  { value: 'reject', label: 'Reject' },
];

function ReviewerDecision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [decision, setDecision] = useState('approve');
  const [reviewer_comment, setReviewerComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getApplication(id)
      .then(setApplication)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await recordDecision(id, { decision, reviewer_comment });
      navigate(`/applications/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading review details…</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  if (application.status !== 'Under Review') {
    return (
      <div className="card">
        <h2>Review action unavailable</h2>
        <p>This application is not currently Under Review.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Reviewer Decision for {application.tracking_number}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Decision
          <select value={decision} onChange={(e) => setDecision(e.target.value)}>
            {DECISIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reviewer Comment
          <textarea
            value={reviewer_comment}
            onChange={(e) => setReviewerComment(e.target.value)}
            placeholder="Add comments for decisions that require feedback"
          />
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="button" type="submit" disabled={submitting}>
            Record Decision
          </button>
          <button className="button secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewerDecision;
