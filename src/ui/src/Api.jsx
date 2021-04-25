const API_URL_PREFIX = getApiUrlPrefix();

export function performGet(pageCount) {
  return performHttpRequest(`/todos`, "GET", {});
}

export function performAdd(todo) {
  return performHttpRequest("/todo/add", todo, "POST");
}

export function performDelete(todo) {
  return performHttpRequest("/todo/delete", "DELETE", {
    id: todo.id,
    idRange: todo.idRange,
  });
}

export function performDeleteAll(deleteKey) {
  return performHttpRequest("/todo/deleteall", "DELETE", {
    deleteKey,
  });
}

export function performUpdate(todo) {
  return performHttpRequest("/todo/update", "PUT", {
    id: todo.id,
    idRange: todo.idRange,
    isDone: todo.isDone,
  });
}

function performHttpRequest(urlSuffix, method, body = {}) {
  return fetch(`${API_URL_PREFIX}${urlSuffix}`, getParams(method, body))
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

function getParams(method, body) {
  if (method === "GET") {
    return {
      method: method,
    };
  }

  return {
    headers: {
      "Content-Type": "application/json",
    },
    method: method,
    body: JSON.stringify(body),
  };
}

function getApiUrlPrefix() {
  if (process.env.NODE_ENV === "development") {
    console.log("dev env");
    return "";
  }
  // Set up to use apiUrl from config.json
  return "https://fsscijtoe1.execute-api.eu-west-1.amazonaws.com/prod";
}
