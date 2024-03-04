const module = document.querySelector(".module");
const refresh = document.querySelectorAll(".refresh");
let count = 1;

const createMoviesTital = (movie, div) => {
    const tgh3 = document.createElement("h4");
    div.append(tgh3);
    tgh3.setAttribute("class", "movie-tital");
    tgh3.innerText = movie["titleText"]["text"];
}

const createMoviesImg = (movie, div) => {

    if (movie["primaryImage"] != null) {
        const img = document.createElement("img");
        img.setAttribute("class", "fit-img");
        div.append(img);
        img.setAttribute("src", `${movie["primaryImage"]["url"]}`);
    }
}

const createReleaseDate = (movie, div) => {
    const pera = document.createElement("p");
    pera.setAttribute("class", "small-font");
    div.append(pera);
    pera.innerText = `release on ${movie["releaseDate"]["day"]} : ${movie["releaseDate"]["month"]} : ${movie["releaseDate"]["year"]}`;
}

const createLoader = () => {
    const p = document.createElement("p");
    const btns = document.querySelectorAll(".refresh");
    btns.forEach((btn) => {
        btn.disabled = true;
    })
    module.append(p);
    if (navigator.onLine) {
        p.innerText = "loading....";
    } else {
        p.innerText = "offline!!";
    }
    return [p, btns];
}
const removeLoader = (p) => {
    p[0].remove();
    p[1].forEach((btn) => {
        btn.disabled = false;
    })
}

const showMovies = (movies) => {
    for (let i = 0; i < movies.length; i++) {
        const div = document.createElement("div");
        module.append(div);
        div.setAttribute("class", "box");
        createMoviesTital(movies[i], div);
        createMoviesImg(movies[i], div);
        createReleaseDate(movies[i], div);
    }
}

const setPrevHide = () => {
    const minus = document.querySelector("#minus");
    if(count == 1) {
        minus.classList.add("hide");
    } else if(count == 2) {
        minus.classList.remove("hide");
    }
}

const fetchReq = async () => {
    const url = `https://moviesdatabase.p.rapidapi.com/titles/x/upcoming?page=${count}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8fd61c192emshb1fac7beb8b6214p14172bjsn2d3ae8bb6896',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };
    const p = createLoader();
    try {
        const response = await fetch(url, options);
        console.log(response.status);
        const result = await response.json();
        removeLoader(p);
        setPrevHide();
        showMovies(result["results"]);

    } catch (err) {
        console.log(err);
    }
}

const refreshclick = () => {
    refresh.forEach((ref) => {
        ref.addEventListener("click", () => {
            let boxes = document.querySelectorAll(".box");
            boxes.forEach((box) => {
                box.remove();
            })
            const id = ref.getAttribute("id");
            id === "plus" ? count++ : count--;
            fetchReq();
        });
    })
}

fetchReq();
refreshclick();