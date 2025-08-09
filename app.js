// for the slider

const sliders = document.querySelectorAll(".hero-slider");
const sliderInit = (slider)=>{
    const container = slider.querySelector(".slider-content");
    const next = slider.querySelector(".next");
    const prev = slider.querySelector(".prev");
    const visibleItems = Number(getComputedStyle(slider).getPropertyValue("--slider-items"));
    const remainItems = container.childElementCount-visibleItems;
    let pose=0;
    const slideNext = ()=>{
        pose++;
        container.style.transform = `translateX(-${container.children[pose].offsetLeft}px)`;
        if(pose >= remainItems){
            next.classList.add("disabled");
            slider.classList.add("hide");
        } 
        prev.classList.remove("disabled");
    }
    next.addEventListener("click",slideNext);
    const slidePrev = ()=>{
        pose--;
        container.style.transform = `translateX(-${container.children[pose].offsetLeft}px)`;
        if(pose <= 0) prev.classList.add("disabled");
        next.classList.remove("disabled");
        slider.classList.remove("hide");
    }
    prev.addEventListener("click",slidePrev);
    prev.classList.add("disabled");
}
sliders.forEach(val => sliderInit(val));

// search bar functions and evenListeners
const searchForm = document.querySelector(".search-form");
const searchBar = document.querySelector(".search-bar");
const filter = document.querySelector(".filter");
let searchContent = document.querySelector(".content");
let searchResult = document.querySelector(".search-results");
let noResults = document.querySelector(".no-results");
let hero = document.querySelector(".page1");
let feature = document.querySelector(".feature-sec");
let about = document.querySelector(".about-sec");
let contact = document.querySelector(".contact-sec");
let download = document.querySelector(".download-sec");
const showInfo = document.querySelector(".show-info");
const exit = document.querySelector(".exit");
let exitMovie = document.querySelector(".exit-movie");

// to close the search area
const exitAll = ()=>{
    while(searchResult.firstChild){
        searchResult.firstChild.remove();
    }
    searchBar.value='';
    disSearch();
    showInfo.style.display='none';

}
exit.addEventListener("click",exitAll);



searchBar.addEventListener("click",(e)=>{
    e.stopPropagation();    
    noResults.style.opacity ="0";
    if(searchResult.childElementCount===0) noResults.style.opacity ="1";
    searchBar.style.backgroundColor="var(--hilight)";
    searchForm.querySelector("#filterOn").classList.remove("disabled");
    filter.style.color="var(--text-color)";
    searchBar.placeholder=""; 
    searchBar.style.paddingLeft="23%";   
    searchContent.style.minHeight='85vh';
    searchContent.style.height='max-content';
    hero.style.display='none';
    feature.style.display="none";
    about.style.display="none";
    contact.style.display="none";
    download.style.display="none";
    showInfo.style.display='none';

})
const disFilter = ()=>{
    searchForm.querySelector("#filterOn").classList.add("disabled");
    filter.style.color="var(--hilight)";
    searchBar.placeholder="Find Movies & TV"; 
    searchBar.style.paddingLeft="3rem";
    searchBar.style.backgroundColor="var(--search-bar-background)";
}
const disSearch = () =>{
    searchContent.style.minHeight='0';
    searchContent.style.height='0px';
    hero.style.display='flex';
    feature.style.display="block";
    about.style.display="block";
    contact.style.display="block";
    download.style.display="block";

}

//main functionality and OMDb api, key 75aa3cc0
// for movie details





let curController = null;
const getShows = async (signal,title,year,type) => {
    try{
        year = year ? '&y='+year : '';
        type = type ? '&type='+type : '';
        let response = await fetch(
            `http://www.omdbapi.com/?apikey=75aa3cc0&s=${title}${year}${type}`,{signal}
        );
        let result = await response.json();
        return result;
    }catch(err){
        if(err.name==="AbortError"){
            console.log("prev search aborted");
            return null;
        }
        return false;
    }
}
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    searchBar.value = '';
})
searchBar.addEventListener("input",async e => {
    const query = searchBar.value.trim();
    while(searchResult.firstChild){
        searchResult.firstChild.remove();
    }
    if(curController) curController.abort();
    curController = new AbortController();
    const result = await getShows(curController.signal,query);
    if(result && result.Response !== 'False'){
        console.log(result);
        search = result.Search;
        search.forEach((val)=>{

            let newItem = document.createElement("li");
            newItem.classList.add("search-item");
            newItem.setAttribute("name",val.Title);
            newItem.setAttribute("id",val.imdbID);
            newItem.addEventListener("click",async ()=>{
                try{
                    let response = await fetch(`http://www.omdbapi.com/?apikey=75aa3cc0&i=${val.imdbID}`);
                    let result = await response.json();
                    exitMovie = document.createElement("button");
                    exitMovie.classList.add("exit-movie");
                    showInfo.innerHTML=`<div class="show-details">
                                            <div class="show-poster">
                                                <img src="${result.Poster}" alt="poster of ${result.Title}">
                                            </div>
                                            <div class="info">
                                                <div class="main-details">
                                                    <h1>${result.Title}</h1>
                                                    <p>Directed by ${result.Director}</p>
                                                </div>
                                                <div class="data-genre-rating">
                                                    <p>released in: ${result.Released}</p>
                                                    <p>${result.Rated}, ${result.Genre}:</p>
                                                    
                                                    <ul class="ratings">
                                                        <li class="rotten-tomatoes">
                                                            <img src="./img/rottenTomatoes.png" alt="">
                                                            <p>${result.Ratings[1].Value}</p>
                                                        </li>
                                                        <li class="imdb-rating">
                                                            <img src="./img/Imdb.png" alt="">
                                                            <p>${result.imdbRating}</p>
                                                        </li>
                                                        <li class="metacritic">
                                                            <img src="./img/Metacritic_M.png" alt="">
                                                            <p>${result.Ratings[2].Value}</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="Plot">
                                                    <h2>Plot</h2>
                                                    <p>${result.Plot}</p>
                                                </div>
                                            </div>
                                        </div>`;
                    exitMovie.innerHTML='<i class="fa-solid fa-xmark"></i>';
                    document.querySelector(".show-details").appendChild(exitMovie);
                    exitMovie.addEventListener("click",exitAll);
                    showInfo.style.display='block';
                    searchContent.style.minHeight='0';
                    searchContent.style.height='0px';
                    
                }catch(err){
                    console.log(err);
                }
            });
            if(val.Title.length>35){val=val.slice(0,36)+'...';}
            newItem.innerHTML = `<figure>
                                    <div class="poster-hover">${val.Title}</div>
                                    <img src="${val.Poster}" alt="movie-exp1">
                                </figure>
                                <h2>${val.Title}</h2>   
                                <p>${val.Type}:${val.Year}</p>`;
            searchResult.appendChild(newItem);
            
        })
    };
    if(searchResult.childElementCount>0) noResults.style.opacity="0";
    else noResults.style.opacity = "1";
    if(searchBar.value.trim().length>0) {noResults.querySelector("h1").innerText = 'Not Found';}
    else {noResults.querySelector("h1").innerText = 'please enter something';}
    console.log(searchBar.value.trim().length);

})

// hover effect on nav items ( supposed to be links)
const navItemsContainer = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links li");
const hoverSlider = document.querySelector(".hover-info");
const hoverContainer = document.querySelector(".hover-content")
navItems.forEach((item)=>{
    item.addEventListener("mouseover",(e)=>{
        e.stopPropagation();
        let pos=Number(getComputedStyle(item).getPropertyValue("--pos")); 
        hoverSlider.style.opacity="1"; 
        hoverSlider.style.transform=`translateX(${item.offsetLeft-hoverSlider.offsetLeft}px) translateX(-50%)`;
        hoverContainer.style.transform=`translateX(-${hoverContainer.children[pos].offsetLeft}px)`;
        let height = hoverContainer.children[pos].getBoundingClientRect().height;
        hoverContainer.style.height=`${height}px`;
        hoverSlider.style.height=`${height}px`;
    })
})

const disHover = ()=>{
    hoverSlider.style.opacity="0";     
}


// to cancel effects from eventListeners...
document.addEventListener("click",(e)=>{
    if(!searchForm.contains(e.target)) disFilter();
    if(searchResult.childElementCount===0) disSearch();
})
document.addEventListener("mouseover",(e)=>{
    if(!navItemsContainer.contains(e.target) && !hoverSlider.contains(e.target)){
        disHover();
    }
    
})



    





// for AOS effects 
AOS.init();

