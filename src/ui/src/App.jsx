import React, { Component } from "react";
import TodoList from "./TodoList/TodoList";
import TodoDetails from "./TodoDetails/TodoDetails";
import AddTodo from "./TodoList/AddTodo";
import AppBar from "./AppBar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import "./TodoApp.css";
import { performGet, performDelete, performSave, performUpdate } from "./Api";

export default class App extends Component {
  state = {
    todos: [],
  };

  componentDidMount() {
    this.loadTodos();
  }

  addTodo = (todo) => {
    const { todos } = this.state;
    const todoId =
      todos.length === 0
        ? 1
        : todos.slice(this.state.todos.length - 1)[0].id + 1;
    const newTodo = Object.assign(
      { id: todoId, isDone: false, date: new Date() },
      todo
    );

    this.setState((prevState) => ({ todos: [...prevState.todos, newTodo] }));
    performSave(newTodo);
  };

  deleteTodo = (event) => {
    const todoId = parseInt(event.currentTarget.id, 0);
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== todoId),
    }));
    performDelete(todoId);
  };

  setTodoDone = (event) => {
    const { todos } = this.state;
    const todoId = parseInt(event.currentTarget.value, 0);
    const todo = todos.filter((todo) => todo.id === todoId)[0];
    const newTodo = { ...todo, isDone: !todo.isDone };

    const newTodos = [...todos.filter((todo) => todo.id !== todoId), newTodo];

    this.setState({
      todos: newTodos,
    });

    performUpdate(newTodo, todoId);
  };

  deleteAllTodos = () => {
    const { todos } = this.state;
    this.setState({
      todos: [],
    });

    todos.map((todo) => performDelete(todo.id));
  };

  loadTodos = () => {
    performGet()
      .then((todos) => {
        console.log(todos);
        this.setState({ todos });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <Router>
        <div>
          <AppBar deleteAllTodos={this.deleteAllTodos} />
          <Switch>
            <Route path={`/todo`}>
              <TodoDetails />
            </Route>
            <Route path="/">
              <div>
                <AddTodo addTodo={this.addTodo} />
              </div>
              <div>
                {!this.state.todos.length ? null : (
                  <TodoList
                    todos={this.state.todos}
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
