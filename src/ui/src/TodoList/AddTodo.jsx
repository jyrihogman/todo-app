import React, { Component } from "react";
import PropTypes from "prop-types";

class AddTodo extends Component {
  static propTypes = {
    addTodo: PropTypes.func.isRequired,
  };

  state = {
    todoTitle: "",
    todoDescription: "",
  };

  handleChange = (event) => {
    if (event.currentTarget.id === "titleInput") {
      this.setState({ todoTitle: event.currentTarget.value });
    } else {
      this.setState({ todoDescription: event.currentTarget.value });
    }
  };

  addTodo = () => {
    const todoObject = {
      title: this.state.todoTitle,
      description: this.state.todoDescription,
    };

    this.props.addTodo(todoObject);
  };

  render() {
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
            />
          </label>
        </div>
        <button
          disabled={!this.state.todoDescription || !this.state.todoTitle}
          onClick={this.addTodo}
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    );
  }
}

export default AddTodo;
