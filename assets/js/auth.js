// ----- Code pour gérer la connexion et déconnexion ----- //

export function changeInterfaceIfAuthenticated() {
  const token = localStorage.getItem("token");
  const loginForm = document.getElementById("loginForm");
  const logout = document.getElementById("logout");
  const openModalButton = document.getElementById("openModal1");
  const filtersContainer = document.querySelector(".filtres");
  const editorHTML = document.querySelector(".editeur");

  if (token) {
    loginForm.style.display = "none";
    logout.style.display = "block";
    openModalButton.style.display = "inline";
    filtersContainer.style.display = "none";
    editorHTML.style.display = "flex";
  } else {
    loginForm.style.display = "block";
    logout.style.display = "none";
    openModalButton.style.display = "none";
    filtersContainer.style.display = "flex";
    editorHTML.style.display = "none";
  }

  logout.addEventListener("click", (e) => {
    localStorage.removeItem("token");
    document.location.href = "index.html";
  });
}

// ----- FIN Code pour gérer la connexion et déconnexion ----- //