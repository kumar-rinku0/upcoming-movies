const module = document.querySelector(".module");
const refresh = document.querySelectorAll(".refresh");
let count = 1;
let start = 0;
let limit = 10;

const createMoviesTital = (movie, div) => {
    const newDiv = document.createElement("div");
    const tgh3 = document.createElement("h4");
    const pera = document.createElement("p");
    newDiv.append(tgh3);
    newDiv.append(pera);
    div.append(newDiv);
    tgh3.setAttribute("class", "movie-tital");
    pera.setAttribute("class", "small-font");
    tgh3.innerText = movie.title;
    if(movie.releaseDate != "")
    pera.innerText = `release on ${movie.releaseDate}`;
}


const createMoviesImg = (movie, div) => {
    if (movie.image != null) {
        const img = document.createElement("img");
        img.setAttribute("class", "fit-img");
        div.append(img);
        img.setAttribute("src", `${movie.image}`);
    }
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
    for (let i = start; i< start+limit && i<movies.length; i++) {
        const div = document.createElement("div");
        module.append(div);
        div.setAttribute("class", "box");
        createMoviesImg(movies[i], div);
        createMoviesTital(movies[i], div);
        boxClick(movies[i], div);
    }
}

const setPrevOrNextHide = (length) => {
    const minus = document.querySelector("#minus");
    if(count == 1) {
        minus.classList.add("hide");
    } else if(count == 2) {
        minus.classList.remove("hide");
    }
    const plus = document.querySelector("#plus");
    let countlimit = (count)*limit;
    if(countlimit > length) {
        plus.classList.add("hide");
    } else {
        plus.classList.remove("hide");
    }
}

const fetchReq = async () => {
    const url = `https://moviesverse1.p.rapidapi.com/get-trending-trailers`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8fd61c192emshb1fac7beb8b6214p14172bjsn2d3ae8bb6896',
		    'X-RapidAPI-Host': 'moviesverse1.p.rapidapi.com'
        }
    };
    const p = createLoader();
    try {
        const response = await fetch(url, options);
        console.log(response.status);
        const result = await response.json();
        removeLoader(p);
        setPrevOrNextHide(result.trailers.length);
        showMovies(result.trailers);

    } catch (err) {
        console.log(err);
    }
}

const boxClick = (movie, module) => {
    module.addEventListener("click", () => {
        open(`${movie.videoLink}`, "_self");
    })
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
            if(id == "plus") {
                start += limit;
            } else {
                start -= limit;
            }
            fetchReq();
        });
    })
}

fetchReq();
refreshclick();