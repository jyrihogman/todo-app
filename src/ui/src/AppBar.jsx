import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const AppBar = (props) => {
  let history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  if (props.deleteAllTodos) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <button
          className="btn btn-primary btn-lg"
          style={{ color: "white" }}
          onClick={props.deleteAllTodos}
        >
          Delete all Todos!
        </button>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <button
        className="btn btn-primary btn-lg"
        style={{ color: "white" }}
        onClick={goBack}
      >
        Back
      </button>
    </nav>
  );
};

AppBar.propTypes = {
  deleteAllTodos: PropTypes.func,
};

export default AppBar;
