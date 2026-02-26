const ResultsTable = ({ columns, rows, error }) => {
  if (error) {
    return (
      <div className="results-table results-table--error">
        <p className="results-table__error">❌ {error}</p>
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="results-table results-table--empty">
        <p className="results-table__empty">Run a query to see results here</p>
      </div>
    );
  }

  return (
    <div className="results-table card">
      <p className="results-table__count">{rows.length} row(s) returned</p>
      <div className="results-table__wrapper">
        <table className="results-table__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="results-table__th">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="results-table__tr">
                {columns.map((col) => (
                  <td key={col} className="results-table__td">{String(row[col] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;