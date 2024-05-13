export function displayWorks(works) {
  const parent = document.querySelector(".gallery");

  if (parent) {
    for (const work of works) {
      console.log(work)
      parent.innerHTML += `
        <figure data-categoryId="${work.categoryId}">  
          <img src="${work.imageUrl}" alt="${work.title}">
          <figcaption>${work.title}</figcaption>
        </figure>
      `;
    }
  }
}
