import '../styles/main.scss';

const AssignmentCard = ({ assignment, onClick }) => {
  return (
    <div className="assignment-card card" onClick={() => onClick(assignment._id)}>
      <div className="assignment-card__header">
        <h3 className="assignment-card__title">{assignment.title}</h3>
        <span className={`badge assignment-card__badge assignment-card__badge--${assignment.difficulty.toLowerCase()}`}>
          {assignment.difficulty}
        </span>
      </div>
      <p className="assignment-card__description">{assignment.description}</p>
      <div className="assignment-card__footer">
        <span className="assignment-card__table">Table: {assignment.tableName}</span>
        <button className="assignment-card__btn">Start →</button>
      </div>
    </div>
  );
};

export default AssignmentCard;