import { useState } from 'react';
import { getHint } from '../api/api';

const HintPanel = ({ question, userQuery, tableName }) => {
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleGetHint = async () => {
    setLoading(true);
    setVisible(true);
    try {
      const res = await getHint(question, userQuery, tableName);
      setHint(res.data.hint);
    } catch (err) {
      setHint('Failed to get hint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hint-panel">
      <button className="hint-panel__btn" onClick={handleGetHint} disabled={loading}>
        {loading ? '⏳ Getting hint...' : '💡 Get Hint'}
      </button>
      {visible && (
        <div className="hint-panel__box card">
          <p className="hint-panel__label">Hint:</p>
          <p className="hint-panel__text">{loading ? 'Thinking...' : hint}</p>
        </div>
      )}
    </div>
  );
};

export default HintPanel;