import { IMovie } from "./models/Movie";
import { getData } from "./services/movieService";

let movies: IMovie[] = [];

export const init = () => {
  
  let form = document.getElementById("searchForm") as HTMLFormElement;
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    handleSubmit();
  });

  
  const sortSelect = document.getElementById("sortMovies") as HTMLSelectElement;
  sortSelect.addEventListener("change", () => {
    sortAndRender(sortSelect.value);
  });
};


init();

export async function handleSubmit() {
  let searchText = (document.getElementById("searchText") as HTMLInputElement)
    .value;

  let container: HTMLDivElement = document.getElementById(
    "movie-container"
  ) as HTMLDivElement;
  container.innerHTML = "";

  try {
    movies = await getData(searchText);

    if (movies.length > 0) {
      createHtml(movies, container);
    } else {
      displayNoResult(container);
    }
  } catch {
    displayNoResult(container);
  }
}

export function sortAndRender(sortValue: string) {
  const container = document.getElementById("movie-container") as HTMLDivElement;
  container.innerHTML = "";
  const sorted = sortMovies(movies, sortValue);
  createHtml(sorted, container);
}

export function sortMovies(movies: IMovie[], sortValue: string): IMovie[] {
  const sorted = [...movies]; 
  switch (sortValue) {
    case "title-asc":
      sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      break;
    case "title-desc":
      sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      break;
    case "year-asc":
      sorted.sort((a, b) => Number(a.Year) - Number(b.Year));
      break;
    case "year-desc":
      sorted.sort((a, b) => Number(b.Year) - Number(a.Year));
      break;
  }
  return sorted;
}

export const createHtml = (movies: IMovie[], container: HTMLDivElement) => {
  for (let i = 0; i < movies.length; i++) {
    let movie = document.createElement("div");
    let title = document.createElement("h3");
    let img = document.createElement("img");

    movie.classList.add("movie");
    title.innerHTML = movies[i].Title;
    img.src = movies[i].Poster;
    img.alt = movies[i].Title;

    movie.appendChild(title);
    movie.appendChild(img);

    container.appendChild(movie);
  }
};

export const displayNoResult = (container: HTMLDivElement) => {
  let noMessage = document.createElement("p");
  noMessage.innerHTML = "Inga sökresultat att visa";
  container.appendChild(noMessage);
};