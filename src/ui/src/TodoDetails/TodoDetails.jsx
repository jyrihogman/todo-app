import React from "react";

const TodoDetails = () => {
  const todo = JSON.parse(localStorage.getItem("todo"));
  const date = new Date(todo.date);

  console.log();
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
          Date: {date.toUTCString()}
        </h2>
      </div>
      <div style={{ margin: "5%", marginLeft: "35%" }}>
        <button
          value={todo.id}
          style={{ marginRight: "10%" }}
          // onClick={setTodoDone}
          className="btn btn-primary btn-lg"
        >
          {!todo.isDone ? "Done" : "Undone"}
        </button>
        <button id={todo.id} className="btn btn-primary btn-lg">
          Delete
        </button>
      </div>
    </div>
  );

  // return (
  //   <div className="col-md-12">
  //     <div className="row justify-content-md-center">
  //       <span className="details-text">{date.toUTCString()}</span>
  //     </div>
  //   </div>
  // );
};

export default TodoDetails;
