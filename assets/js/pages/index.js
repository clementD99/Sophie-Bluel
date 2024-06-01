import { initFilters } from "../filters.js";
import { getWorks, getCategories } from "../api.js";
import { displayWorks } from "../works.js";
import { addWorksModal1 } from "../modale.js";
import { changeInterfaceIfAuthenticated } from "../auth.js";

changeInterfaceIfAuthenticated();

const works = await getWorks();
const categories = await getCategories();
console.log(categories);
console.log(works);
displayWorks(works);
initFilters(categories, works);
addWorksModal1(works);