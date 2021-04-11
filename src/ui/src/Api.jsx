export function performGet() {
  return fetch(`${getApiUrlPrefix()}/todos`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export function performSave(todo) {
  return fetch(`${getApiUrlPrefix()}/todos`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export function performDelete(todoId) {
  return fetch(`${getApiUrlPrefix()}/todos/${todoId}`, { method: "DELETE" })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export function performUpdate(todo, todoId) {
  return fetch(`${getApiUrlPrefix()}/todos/${todoId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

function getApiUrlPrefix() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  return "http://localhost:3000";
}
