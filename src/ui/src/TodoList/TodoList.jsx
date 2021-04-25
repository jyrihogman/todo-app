import React from "react";
import PropTypes from "prop-types";

import Todo from "./Todo";

const TodoList = (props) => {
  const todoComponents = props.todos
    .sort((a, b) => a.idRange - b.idRange, 0)
    .map((todo) => (
      <Todo
        deleteTodo={props.deleteTodo}
        setTodoDone={props.setTodoDone}
        key={todo.id}
        todo={todo}
      />
    ));

  const loadMore = () => {
    props.loadMoreTodos();
  };

  return (
    <div className="col-md-12">
      <div className="row justify-content-md-center">{todoComponents}</div>
      <div
        className="row justify-content-md-center"
        style={{ marginTop: "2%", marginBottom: "2%" }}
      >
        {props.loadMore > 0 && (
          <button
            onClick={props.loadmoreTodos}
            className="btn btn-primary btn-lg"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      isDone: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  loadMore: PropTypes.bool.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  setTodoDone: PropTypes.func.isRequired,
  loadMoreTodos: PropTypes.func.isRequired,
};

export default TodoList;
