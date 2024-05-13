document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    validationlogin();
  });

  function validationlogin() {
    let email = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    const credentials = {
      email: email,
      password: password,
    };

    fetch(`http://localhost:5678/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la requête");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Réponse du serveur :", data);
        localStorage.setItem("token", data.token);
        document.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error);
        const errorElement = document.getElementById("error");
        errorElement.textContent = "L'e-mail et/ou le mot de passe est incorrect";
      });
  }
});
