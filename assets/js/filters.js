export async function initFilters(categories, works) {
  const parent = document.querySelector(".gallery");
  
  try {
    // Affiche les filtres
    displayFilters(categories, parent);
    
    await addEventsToFilters(works, parent);
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'initialisation des filtres :", error);
  }
}

function displayFilters(categories) {
  const filtersContainer = document.querySelector(".filtres");
  
  const tousButton = createFilterButton("Tous", 0);
  filtersContainer.appendChild(tousButton);
  
  // Créer les boutons pour chaque catégorie
  for (const categorie of categories) {
    const button = createFilterButton(categorie.name, categorie.id);
    filtersContainer.appendChild(button);
  }
}

function createFilterButton(name, id) {
  const button = document.createElement("p");
  button.classList.add("filtres-bouton", "inactive");
  button.dataset.id = id;
  button.textContent = name;
  return button;
}

async function addEventsToFilters(works, parent) {
  const filters = document.querySelectorAll(".filtres-bouton");
  
  filters.forEach(button => {
    button.addEventListener("click", async function () {
      const filterId = +this.dataset.id;
      const filteredWorks = (filterId === 0) ? works : works.filter(work => +work.categoryId === filterId);
      
      displayCategories(filteredWorks, parent);
      
      // inactive quand le bouton n'est pas cliqué
      filters.forEach(btn => {
        btn.classList.add("inactive");
      });
      this.classList.remove("inactive");
    });
  });
}

export function displayCategories(works, parent) {

  parent.innerHTML = "";
  
  // Permet l'ajout des images
  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.dataset.categoryId = work.categoryId;
    
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    
    figure.appendChild(img);
    figure.appendChild(figcaption);
    
    parent.appendChild(figure);
  });
}
