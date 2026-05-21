import { Routes, Route, Link } from 'react-router-dom';
import ApplicationList from './pages/ApplicationList';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetail from './pages/ApplicationDetail';
import ReviewerDecision from './pages/ReviewerDecision';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Business Legality Workflow Tracker</h1>
          <p>Manage draft applications, submissions, reviews, and decisions.</p>
        </div>
        <nav>
          <Link to="/">Applications</Link>
          <Link to="/applications/new">New Application</Link>
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
  );
}

export default App;
