import { Routes, Route, Link } from 'react-router-dom';
import ApplicationList from './pages/ApplicationList';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetail from './pages/ApplicationDetail';
import ReviewerDecision from './pages/ReviewerDecision';
import { RoleProvider, useRole } from './RoleContext';

function RoleToggle() {
  const { role, setRole } = useRole();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ fontSize: 12, opacity: 0.85 }}>View as</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="applicant">Applicant</option>
        <option value="official">Official</option>
      </select>
    </div>
  );
}

function NavLinks() {
  const { role } = useRole();
  return (
    <>
      <Link to="/">Applications</Link>
      {role === 'applicant' && <Link to="/applications/new">New Application</Link>}
    </>
  );
}

function App() {
  return (
    <RoleProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>Business Legality Workflow Tracker</h1>
            <p>Manage draft applications, submissions, reviews, and decisions.</p>
          </div>
          <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <NavLinks />
            <RoleToggle />
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ApplicationList />} />
            <Route path="/applications/new" element={<ApplicationForm />} />
            <Route path="/applications/:id/edit" element={<ApplicationForm />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/applications/:id/decision" element={<ReviewerDecision />} />
          </Routes>
        </main>
      </div>
    </RoleProvider>
  );
}

export default App;
