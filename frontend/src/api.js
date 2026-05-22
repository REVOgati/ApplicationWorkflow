const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function fetchJson(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.detail || body?.error || response.statusText;
    throw new Error(message || 'Request failed');
  }

  return body;
}

export async function listApplications() {
  return fetchJson('/applicant/applications/');
}

export async function getApplication(id) {
  return fetchJson(`/applicant/applications/${id}/`);
}

export async function listApplicationsOfficial() {
  return fetchJson('/official/applications/');
}

export async function getApplicationOfficial(id) {
  return fetchJson(`/official/applications/${id}/`);
}

export async function createApplication(payload) {
  return fetchJson('/applicant/applications/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateApplication(id, payload) {
  return fetchJson(`/applicant/applications/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function submitApplication(id) {
  return fetchJson(`/applicant/applications/${id}/submit/`, {
    method: 'POST',
  });
}

export async function startReview(id) {
  return fetchJson(`/official/applications/${id}/start-review/`, {
    method: 'POST',
  });
}

export async function recordDecision(id, payload) {
  return fetchJson(`/official/applications/${id}/decision/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
