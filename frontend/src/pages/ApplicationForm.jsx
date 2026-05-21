import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createApplication, getApplication, updateApplication, submitApplication } from '../api';

const APPLICATION_TYPES = [
  'Recordation',
  'Renewal',
  'Change of Ownership',
  'Change of Name',
  'Discontinuation',
];

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    applicant_name: '',
    applicant_email: '',
    company_name: '',
    application_type: APPLICATION_TYPES[0],
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getApplication(id)
      .then((application) => {
        setForm({
          applicant_name: application.applicant_name,
          applicant_email: application.applicant_email,
          company_name: application.company_name,
          application_type: application.application_type,
          description: application.description || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      const result = id ? await updateApplication(id, payload) : await createApplication(payload);
      navigate(`/applications/${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const application = id ? await submitApplication(id) : await createApplication(form);
      if (!id) {
        await submitApplication(application.id);
      }
      navigate(`/applications/${application.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>{id ? 'Edit Application' : 'Create New Application'}</h2>
        <p>Fill out the application details and save as draft or submit to start review.</p>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Loading application...</div>
      ) : (
        <div className="card">
          <form onSubmit={handleSave}>
            <label>
              Applicant Name
              <input name="applicant_name" value={form.applicant_name} onChange={handleChange} required />
            </label>
            <label>
              Applicant Email
              <input name="applicant_email" type="email" value={form.applicant_email} onChange={handleChange} required />
            </label>
            <label>
              Company Name
              <input name="company_name" value={form.company_name} onChange={handleChange} required />
            </label>
            <label>
              Application Type
              <select name="application_type" value={form.application_type} onChange={handleChange}>
                {APPLICATION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} />
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="submit" className="button" disabled={saving}>
                Save Draft
              </button>
              <button type="button" className="button success" onClick={handleSubmit} disabled={saving}>
                Save & Submit
              </button>
              <button type="button" className="button secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ApplicationForm;
