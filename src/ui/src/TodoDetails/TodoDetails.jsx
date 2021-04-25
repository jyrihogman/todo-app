import React, { useState, useEffect } from "react";
import { performGetDetails } from "../Api";

import { useParams } from "react-router-dom";

const TodoDetails = (props) => {
  const [todo, setTodo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    performGetDetails(id).then((data) => {
      setTodo(data);
    });
  }, [id]);

  const handleStatusChange = (e) => {
    props.setTodoDone(e);
  };

  const handleDeletion = (e) => {
    props.deleteTodo(e);
  };

  if (!todo) {
    return null;
  }

  return (
    <div
      id={todo.id}
      className="card col-lg-5 col-lg-offset-1"
      style={{ margin: "auto", marginTop: "7%" }}
    >
      <div className="card-body">
        <h1 className="card-title" style={{ margin: "5%" }}>
          {todo.title}
        </h1>
        <h2 className="card-text" style={{ margin: "5%" }}>
          {todo.description}
        </h2>
        <h2 className="card-text" style={{ margin: "5%" }}>
          Date: {new Date(todo.date).toUTCString()}
        </h2>
      </div>
      <div style={{ margin: "5%", marginLeft: "35%" }}>
        <button
          value={todo.id}
          style={{ marginRight: "10%" }}
          onClick={handleStatusChange}
          className="btn btn-primary btn-lg"
        >
          {!todo.isDone ? "Done" : "Undone"}
        </button>
        <button
          id={todo.id}
          className="btn btn-primary btn-lg"
          onClick={handleDeletion}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoDetails;
