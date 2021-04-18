import React from "react";
import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";

const Todo = (props) => {
  let history = useHistory();

  const { deleteTodo, setTodoDone } = props;
  const { id, title, description, isDone } = props.todo;

  const cardColor = isDone ? "text-white bg-secondary" : "";
  const btnColor = isDone
    ? "btn btn-primary btn-sm"
    : "btn btn-outline-primary btn-sm";

  const navigateToDetails = () => {
    localStorage.setItem("todo", JSON.stringify(props.todo));
    history.push(`/todo/${id}`);
  };

  return (
    <div
      id={id}
      className={`card ${cardColor} col-md-2`}
      style={{ margin: "2%" }}
    >
      <div className="card-body" onClick={navigateToDetails}>
        <h4 className="card-title">{title}</h4>
        <p className="card-text">{description}</p>
      </div>
      <div style={{ margin: "5%" }}>
        <button
          value={id}
          style={{ marginRight: "10%" }}
          onClick={setTodoDone}
          className={btnColor}
        >
          {!isDone ? "Done" : "Undone"}
        </button>
        <button id={id} onClick={deleteTodo} className="btn btn-primary btn-sm">
          Delete
        </button>
      </div>
    </div>
  );
};

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isDone: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  setTodoDone: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
};

export default Todo;
