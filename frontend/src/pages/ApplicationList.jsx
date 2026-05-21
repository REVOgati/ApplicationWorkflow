import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listApplications } from '../api';

function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listApplications()
      .then((result) => {
        setApplications(result.results || result.items || result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="card">
        <h2>Application List</h2>
        <p>Track business legality applications across draft, review, and decision stages.</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Loading applications...</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking</th>
                <th>Applicant</th>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.tracking_number}</td>
                  <td>{application.applicant_name}</td>
                  <td>{application.company_name}</td>
                  <td>{application.application_type}</td>
                  <td>
                    <span className="status-chip" data-status={application.status}>
                      {application.status}
                    </span>
                  </td>
                  <td>{new Date(application.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link className="button secondary" to={`/applications/${application.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && <p>No applications found yet.</p>}
        </div>
      )}
    </div>
  );
}

export default ApplicationList;
