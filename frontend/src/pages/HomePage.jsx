import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignments } from '../api/api';
import AssignmentCard from '../components/AssignmentCard';

const HomePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAssignments()
      .then((res) => setAssignments(res.data))
      .catch(() => setError('Failed to load assignments'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home page-container">
      <header className="home__header">
        <h1 className="home__title">🛢️ CipherSQL Studio</h1>
        <p className="home__subtitle">Practice SQL with real-time query execution</p>
      </header>

      <main className="home__main">
        {loading && <p className="home__loading">Loading assignments...</p>}
        {error && <p className="home__error">{error}</p>}
        {!loading && !error && (
          <>
            <h2 className="home__section-title">Available Assignments</h2>
            <div className="home__grid">
              {assignments.map((a) => (
                <AssignmentCard
                  key={a._id}
                  assignment={a}
                  onClick={(id) => navigate(`/assignment/${id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;