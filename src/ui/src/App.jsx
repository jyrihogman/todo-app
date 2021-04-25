import React, { Component, useEffect, useState } from "react";
import TodoList from "./TodoList/TodoList";
import TodoDetails from "./TodoDetails/TodoDetails";
import AddTodo from "./TodoList/AddTodo";
import AppBar from "./AppBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./TodoApp.css";
import {
  performGetAll,
  performDelete,
  performUpdate,
  performDeleteAll,
  performAdd,
} from "./Api";

export const App = () => {
  const [state, setState] = useState(() => ({
    todos: [],
    deleteKey: "",
    pageCount: 0,
  }));

  useEffect(() => {
    loadTodos();
  }, []);

  function sortTodos(todos) {
    return todos.sort((a, b) => a.idRange - b.idRange, 0);
  }

  const loadTodos = () => {
    performGetAll(state.pageCount)
      .then((data) => {
        setState((prevState) => {
          const newTodos = sortTodos([...prevState.todos, ...data.todos]);

          return {
            todos: newTodos,
            deleteKey: data.deleteKey,
            pageCount: data.pageCount,
          };
        });
      })
      .catch((error) => console.log(error));
  };

  const addTodo = (todo) => {
    const { todos } = state;
    const todoIdRange =
      todos.length === 0 ? 1 : todos.slice(todos.length - 1)[0].idRange + 1;

    const newTodo = {
      ...todo,
      idRange: todoIdRange,
      isDone: false,
      date: new Date().toString(),
    };

    performAdd(newTodo).then((resp) => {
      setState((prevState) => ({
        todos: [...prevState.todos, { ...newTodo, id: resp.id }],
      }));
    });
  };

  const deleteTodo = (event) => {
    const todoId = event.currentTarget.id;
    const todo = state.todos.filter((t) => t.id === todoId)[0];

    performDelete(todo).then(() => {
      setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== todoId),
      }));
    });
  };

  const setTodoDone = (event) => {
    const { todos } = state;

    const todoId = event.currentTarget.value;
    const todo = todos.filter((todo) => todo.id === todoId)[0];

    const newTodo = { ...todo, isDone: !todo.isDone };
    const newTodos = sortTodos([
      ...todos.filter((todo) => todo.id !== todoId),
      newTodo,
    ]);

    performUpdate({
      id: newTodo.id,
      isDone: newTodo.isDone,
      idRange: newTodo.idRange,
    }).then(() => {
      setState({
        todos: newTodos,
      });
    });
  };

  const deleteAllTodos = () => {
    performDeleteAll(state.deleteKey).then(() => {
      setState({ todos: [] });
    });
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route path={`/todo/:id`}>
            <AppBar />
            <TodoDetails deleteTodo={deleteTodo} setTodoDone={setTodoDone} />
          </Route>
          <Route path="/">
            <AppBar deleteAllTodos={deleteAllTodos} />
            <div>
              <AddTodo addTodo={addTodo} />
            </div>
            <div>
              {!state.todos.length ? null : (
                <TodoList
                  todos={state.todos}
                  loadMore={!!state.pageCount}
                  loadMoreTodos={loadTodos}
                  deleteTodo={deleteTodo}
                  setTodoDone={setTodoDone}
                />
              )}
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
