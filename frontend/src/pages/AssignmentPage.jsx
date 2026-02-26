import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getAssignment, executeQuery } from '../api/api';
import ResultsTable from '../components/ResultsTable';
import HintPanel from '../components/HintPanel';

const AssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState('SELECT * FROM ');
  const [results, setResults] = useState({ columns: [], rows: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAssignment(id)
      .then((res) => setAssignment(res.data))
      .catch(() => navigate('/'));
  }, [id]);

  const handleExecute = async () => {
    setLoading(true);
    setError('');
    setResults({ columns: [], rows: [] });
    try {
      const res = await executeQuery(query);
      setResults({ columns: res.data.columns, rows: res.data.rows });
    } catch (err) {
      setError(err.response?.data?.error || 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <div className="assignment-page__loading">Loading...</div>;

  return (
    <div className="assignment-page page-container">
      <div className="assignment-page__topbar">
        <button className="assignment-page__back" onClick={() => navigate('/')}>← Back</button>
        <h2 className="assignment-page__title">{assignment.title}</h2>
        <span className={`badge assignment-page__badge assignment-page__badge--${assignment.difficulty.toLowerCase()}`}>
          {assignment.difficulty}
        </span>
      </div>

      <div className="assignment-page__layout">
        {/* Left Panel */}
        <div className="assignment-page__left">
          <div className="card assignment-page__question">
            <h3 className="assignment-page__label">📋 Question</h3>
            <p className="assignment-page__question-text">{assignment.question}</p>
          </div>

          <div className="card assignment-page__schema">
            <h3 className="assignment-page__label">🗂️ Table: {assignment.tableName}</h3>
            <p className="assignment-page__schema-hint">
              Use this table in your queries. Try <code>SELECT * FROM {assignment.tableName} LIMIT 5</code> to explore the data.
            </p>
          </div>

          <div className="card">
            <HintPanel
              question={assignment.question}
              userQuery={query}
              tableName={assignment.tableName}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="assignment-page__right">
          <div className="assignment-page__editor-header sticky-right">
            <h3 className="assignment-page__label">✍️ SQL Editor</h3>
            <button
              className="assignment-page__run-btn"
              onClick={handleExecute}
              disabled={loading}
            >
              {loading ? 'Running...' : '▶ Run Query'}
            </button>
          </div>

          <div className="card assignment-page__editor">
            <Editor
              height="250px"
              language="sql"
              theme="vs-dark"
              value={query}
              onChange={(val) => setQuery(val || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>

          <div className="card assignment-page__results">
            <h3 className="assignment-page__label">📊 Results</h3>
            <ResultsTable
              columns={results.columns}
              rows={results.rows}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;