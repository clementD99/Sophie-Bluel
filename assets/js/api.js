const urlAPI = "http://localhost:5678/api";

export async function getWorks() {
  return fetch(`${urlAPI}/works`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

export async function getCategories() {
  return fetch(`${urlAPI}/categories`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
}