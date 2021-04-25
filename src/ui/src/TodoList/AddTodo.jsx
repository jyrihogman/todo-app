import React, { useState } from "react";
import PropTypes from "prop-types";

const AddTodo = (props) => {
  const [state, setState] = useState({ todoTitle: "", todoDescription: "" });

  const handleChange = (event) => {
    const { value } = event.currentTarget;

    if (event.currentTarget.id === "titleInput") {
      setState((prevState) => ({
        ...prevState,
        todoTitle: value,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        todoDescription: value,
      }));
    }
  };

  const addTodo = () => {
    const todoObject = {
      title: state.todoTitle,
      description: state.todoDescription,
    };

    props.addTodo(todoObject);
  };

  return (
    <div
      style={{ padding: "3%" }}
      className="jumbotron mx-auto d-block col-sm-3"
    >
      <h4>Add a new Todo!</h4>
      <div className="form-group">
        <label
          htmlFor="titleInput"
          className="col-form-label col-form-label-sm"
        >
          Title
          <input
            id="titleInput"
            className="form-control form-control-sm"
            type="text"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label
          htmlFor="descriptionInput"
          className="col-form-label col-form-label-sm"
        >
          Description
          <input
            id="descriptionInput"
            className="form-control form-control-sm"
            type="text"
            onChange={handleChange}
          />
        </label>
      </div>
      <button
        disabled={!state.todoDescription || !state.todoTitle}
        onClick={addTodo}
        className="btn btn-primary"
      >
        Submit
      </button>
    </div>
  );
};

AddTodo.propTypes = {
  addTodo: PropTypes.func.isRequired,
};

export default AddTodo;
