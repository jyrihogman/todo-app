const API_URL_PREFIX = getApiUrlPrefix();

export function performGet(pageCount) {
  return performHttpRequest("/todos", { pageCount });
}

export function performSave(todo) {
  return performHttpRequest("/todo/add", todo);
}

export function performDelete(todo) {
  return performHttpRequest("/todo/delete", {
    id: todo.id,
    idRange: todo.idRange,
  });
}

export function performDeleteAll(deleteKey) {
  return performHttpRequest("/todo/deleteall", {
    deleteKey,
  });
}

export function performUpdate(todo) {
  return performHttpRequest("/todo/update", {
    id: todo.id,
    idRange: todo.idRange,
    isDone: todo.isDone,
  });
}

function performHttpRequest(urlSuffix, body = {}) {
  return fetch(`${API_URL_PREFIX}${urlSuffix}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

function getApiUrlPrefix() {
  if (process.env.NODE_ENV === "development") {
    console.log("dev env");
    return "";
  }
  return "http://localhost:3000";
}
