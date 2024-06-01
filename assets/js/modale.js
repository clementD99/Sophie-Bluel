import { getCategories } from "./api.js";
const token = localStorage.getItem("token");
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const closeModal1Button = document.querySelector(".closeModal1");
const closeModal2Button = document.querySelector(".closeModal2");
const openModal1Button = document.getElementById("openModal1");
const openModal2Button = document.getElementById("openModal2");
const retourModal = document.querySelector(".retourModal");

function openModal() {
  modal1.style.display = "flex";
}

function openModal2() {
  modal2.style.display = "flex";
}

function closeModal1() {
  modal1.style.display = "none";
}

function closeModal2() {
  modal2.style.display = "none";
}

// revenir en arrière

retourModal.addEventListener("click", () => {
  modal1.style.display = `flex`;
  modal2.style.display = `none`;
});

// code pour ouvrir les modales au clic

openModal2Button.addEventListener("click", openModal2);
closeModal2Button.addEventListener("click", closeModal2);

openModal1Button.addEventListener("click", openModal);
closeModal1Button.addEventListener("click", closeModal1);

openModal2Button.addEventListener("click", function () {
  modal1.style.display = "none";
  modal2.style.display = "flex";
});

// Code pour choisir les catégories pour la 2e modale

const categories = await getCategories();
const select = document.getElementById("select-categories");
const option = document.createElement("option");
select.appendChild(option);

for (const category of categories) {
  const option = document.createElement("option");
  option.value = category.id;
  option.textContent = category.name;
  select.appendChild(option);
}

console.log(categories);
// FIN Code pour choisir les catégories pour la 2e modale

// ----- Code pour retirer les classes pour que seule l'image apparaisse sur la 2e modale ----- //

document.getElementById("uploadImage").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.src = reader.result;
    imagePreview.style.display = "block";

    // Pour cacher les éléments dans le rectangle
    const elementsToHide = document.querySelectorAll(".fa-image, .ajoutImage, .format");
    elementsToHide.forEach(function (element) {
      element.style.display = "none";
    });

    // Pour changer la couleur du bouton-modal2 quand l'image est téléchargée
    const boutonModal = document.querySelector(".bouton-modal2");
    boutonModal.classList.add("uploaded");
  };

  reader.readAsDataURL(file);
});
// ----- FIN Code pour retirer les classes pour que seule l'image apparaisse sur la 2e modale ----- //

// ----- Code pour empêcher la validation de l'envoi si l'un des 3 champs n'est pas rempli ----- //
function setupSubmitBtn(uploadImageId, formTitleId, selectCategoriesId, submitBtnId) {
  const uploadImage = document.getElementById(uploadImageId);
  const formTitle = document.getElementById(formTitleId);
  const selectCategories = document.getElementById(selectCategoriesId);
  const submitBtn = document.getElementById(submitBtnId);

  function checkFields() {
    const titleFilled = formTitle.value.trim() !== "";
    const categoryFilled = selectCategories.value !== "";
    const imageFilled = uploadImage.files.length > 0;

    return titleFilled && categoryFilled && imageFilled;
  }

  function toggleSubmitBtn() {
    if (checkFields()) {
      submitBtn.disabled = false;
      submitBtn.classList.add("Btn-valide");
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("Btn-valide");
    }
  }

  uploadImage.addEventListener("change", toggleSubmitBtn);
  formTitle.addEventListener("input", toggleSubmitBtn);
  selectCategories.addEventListener("change", toggleSubmitBtn);

  toggleSubmitBtn();
}

setupSubmitBtn("uploadImage", "form-title", "select-categories", "submitBtn");
// ----- FIN Code pour empêcher la validation de l'envoi si l'un des 3 champs n'est pas rempli ----- //

// ----- Appel API du bouton pour la validation d'une photo ----- //

document.getElementById("submitBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const title = document.getElementById("form-title").value;
  const category = parseInt(document.getElementById("select-categories").value);
  const image = document.getElementById("uploadImage").files[0];

  let formData = new FormData();

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Problème lors de l'ajout");
      }
    })
    .then((data) => {
      console.log("Image ajoutée");
      modal1.style.display = "none";
      modal2.style.display = "none";

      // Permet d'ajouter l'image + le titre de l'image sans avoir à recharger la page
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(image);
      imgElement.alt = title;

      const titleElement = document.createElement("p");
      titleElement.textContent = title;

      const containerElement = document.createElement("div");
      containerElement.className = "gallery-item";
      containerElement.setAttribute("data-id", data.id);
      containerElement.appendChild(imgElement);
      containerElement.appendChild(titleElement);

      const gallery = document.querySelector(".gallery");
      if (gallery) {
        gallery.appendChild(containerElement);
      } else {
        console.error("L'élément avec la classe 'gallery' est introuvable.");
      }

      // Ajout de l'image à la première modale
      const item = document.createElement("div");
      item.classList.add("item");
      item.setAttribute("data-id", data.id);

      const corbeille = document.createElement("div");
      corbeille.classList.add("corbeille");
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can");
      corbeille.appendChild(trashIcon);

      const imgInModal = document.createElement("img");
      imgInModal.src = data.imageUrl;
      imgInModal.alt = title;

      item.appendChild(corbeille);
      item.appendChild(imgInModal);

      const itemsContainer = document.querySelector(".items");
      if (itemsContainer) {
        itemsContainer.appendChild(item);

        // Permet de supprimer une image sans avoir à recharger la page
        trashIcon.addEventListener("click", async (event) => {
          const itemId = item.dataset.id;
          await suppressionProjetModale(item, itemId);
        });
      } else {
        console.error("L'élément avec la classe 'items' est introuvable.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
// ----- FIN Appel API du bouton pour la validation d'une photo ----- //

// ----- Affiche les photos dans la modale ----- //

export function addWorksModal1(works) {
  let html = "";

  for (const work of works) {
    html += `
            <div class="item" data-id="${work.id}">
                <div class="corbeille"><i class="fa-solid fa-trash-can"></i></div>
                <img src="${work.imageUrl}" alt="${work.title}" />
            </div>
        `;
  }

  const items = document.querySelector(".items");
  items.innerHTML = html;

  const deleteIcons = document.querySelectorAll(".fa-trash-can");
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", async (event) => {
      const item = event.target.closest(".item");
      const itemId = event.target.closest(".item").dataset.id;
      await suppressionProjetModale(item, itemId);
    });
  });
}
// ----- FIN Affiche les photos dans la modale ----- //

// ----- Code pour supprimer une image avec API ----- //

async function suppressionProjetModale(item, id) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Suppression element dans la modale
      item.remove();

      // Suppression element de la galerie
      const galeryItem = document.querySelector(".gallery");
      const galeryItemTrouve = galeryItem.querySelector(`[data-id="${id}"]`);
      galeryItemTrouve.remove();

      alert("L'élément a été supprimé !");
    } else {
      throw new Error("La suppression du projet a échoué");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error.message);
    alert("Une erreur est survenue lors de la suppression.");
  }
}
// ----- FIN Code pour supprimer une image avec API ----- //

// ----- Code pour générer la modale en JS ----- //

(function () {
  function createModal(title, items, isSecondModal = false) {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add(isSecondModal ? "modal2" : "modal1");
    modalContainer.id = isSecondModal ? "modal2" : "modal1";

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const closeModal = document.createElement("div");
    closeModal.classList.add(isSecondModal ? "closeModal2" : "closeModal1");

    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-xmark");
    closeModal.appendChild(closeIcon);

    modal.appendChild(closeModal);

    const retourModal = document.createElement("div");
    retourModal.classList.add("retourModal");

    const retourIcon = document.createElement("i");
    retourIcon.classList.add("fa-solid", "fa-arrow-left");
    retourModal.appendChild(retourIcon);
    modal.appendChild(retourModal);

    const h2 = document.createElement("h2");
    h2.textContent = title;
    modal.appendChild(h2);

    if (items) {
      const itemsContainer = document.createElement("div");
      itemsContainer.classList.add("items");
      items.forEach((src) => {
        const item = createItem(src);
        itemsContainer.appendChild(item);
      });
      modal.appendChild(itemsContainer);
    }

    const separateur = document.createElement("div");
    separateur.classList.add("separateur");
    modal.appendChild(separateur);

    if (!isSecondModal) {
      const bouton = document.createElement("button");
      bouton.classList.add("bouton");
      bouton.id = "openModal2";
      bouton.textContent = "Ajouter une photo";
      modal.appendChild(bouton);
    }

    modalContainer.appendChild(modal);
    return modalContainer;
  }

  function createItem(src) {
    const item = document.createElement("div");
    item.classList.add("item");

    const corbeille = document.createElement("div");
    corbeille.classList.add("corbeille");

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    corbeille.appendChild(trashIcon);

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";

    item.appendChild(corbeille);
    item.appendChild(img);

    return item;
  }

  const imageSources = [
    "./assets/images/abajour-tahina.png",
    "./assets/images/appartement-paris-v.png",
    "./assets/images/restaurant-sushisen-londres.png",
    "./assets/images/la-balisiere.png",
    "./assets/images/structures-thermopolis.png",
    "./assets/images/appartement-paris-x.png",
    "./assets/images/villa-ferneze.png",
    "./assets/images/appartement-paris-xviii.png",
    "./assets/images/le-coteau-cassis.png",
    "./assets/images/bar-lullaby-paris.png",
    "./assets/images/hotel-first-arte-new-delhi.png",
    "./assets/images/malt-et-juniper-new-york.png",
  ];

  const modal1 = createModal("Galerie photo", imageSources);
  document.body.appendChild(modal1);

  const modal2 = createModal("Ajout photo", null, true);
  document.body.appendChild(modal2);
})();
// ----- FIN Code pour générer la modale en JS ----- //