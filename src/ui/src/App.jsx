import React, { Component } from "react";
import TodoList from "./TodoList/TodoList";
import TodoDetails from "./TodoDetails/TodoDetails";
import AddTodo from "./TodoList/AddTodo";
import AppBar from "./AppBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./TodoApp.css";
import {
  performGet,
  performDelete,
  performSave,
  performUpdate,
  performDeleteAll,
} from "./Api";

export default class App extends Component {
  state = {
    todos: [],
    pageCount: 0,
    deleteKey: "",
  };

  componentDidMount() {
    this.loadTodos();
  }

  addTodo = (todo) => {
    const { todos } = this.state;
    const todoIdRange =
      todos.length === 0
        ? 1
        : todos.slice(this.state.todos.length - 1)[0].idRange + 1;

    const newTodo = {
      ...todo,
      idRange: todoIdRange,
      isDone: false,
      date: new Date().toString(),
    };

    performSave(newTodo).then((resp) => {
      this.setState((prevState) => ({
        todos: [...prevState.todos, { ...newTodo, id: resp.id }],
      }));
    });
  };

  deleteTodo = (event) => {
    const todoId = event.currentTarget.id;
    const todo = this.state.todos.filter((t) => t.id === todoId)[0];

    performDelete(todo).then(() => {
      this.setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== todoId),
      }));
    });
  };

  setTodoDone = (event) => {
    const { todos } = this.state;

    const todoId = event.currentTarget.value;
    const todo = todos.filter((todo) => todo.id === todoId)[0];

    const newTodo = { ...todo, isDone: !todo.isDone };
    const newTodos = [...todos.filter((todo) => todo.id !== todoId), newTodo];

    performUpdate({
      id: newTodo.id,
      isDone: newTodo.isDone,
      idRange: newTodo.idRange,
    }).then(() => {
      this.setState({
        todos: newTodos,
      });
    });
  };

  deleteAllTodos = () => {
    performDeleteAll(this.state.deleteKey).then(() => {
      this.setState({ todos: [] });
    });
  };

  loadTodos = () => {
    performGet(this.state.pageCount)
      .then((data) => {
        const newTodos = [...this.state.todos, ...data.todos];

        this.setState({
          todos: newTodos,
          deleteKey: data.deleteKey,
          pageCount: data.pageCount,
        });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <Router>
        <div>
          <AppBar deleteAllTodos={this.deleteAllTodos} />
          <Switch>
            <Route path={`/todo/:id`}>
              <TodoDetails
                deleteTodo={this.deleteTodo}
                setTodoDone={this.setTodoDone}
              />
            </Route>
            <Route path="/">
              <div>
                <AddTodo addTodo={this.addTodo} />
              </div>
              <div>
                {!this.state.todos.length ? null : (
                  <TodoList
                    todos={this.state.todos}
                    loadMore={!!this.state.pageCount}
                    loadMoreTodos={this.loadTodos}
                    deleteTodo={this.deleteTodo}
                    setTodoDone={this.setTodoDone}
                  />
                )}
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
