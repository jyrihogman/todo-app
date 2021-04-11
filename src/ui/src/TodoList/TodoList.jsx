import React from "react";
import PropTypes from "prop-types";

import Todo from "./Todo";

const TodoList = (props) => {
  const todoComponents = props.todos
    .sort((a, b) => a.id - b.id)
    .map((todo) => (
      <Todo
        deleteTodo={props.deleteTodo}
        setTodoDone={props.setTodoDone}
        key={todo.id}
        {...todo}
      />
    ));

  return (
    <div className="col-md-12">
      <div className="row justify-content-md-center">{todoComponents}</div>
    </div>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      isDone: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  setTodoDone: PropTypes.func.isRequired,
};

export default TodoList;
