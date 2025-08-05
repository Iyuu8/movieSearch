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
searchBar.addEventListener("click",(e)=>{
    e.stopPropagation();    
    searchBar.style.backgroundColor="var(--hilight)";
    searchForm.querySelector("#filterOn").classList.remove("disabled");
    filter.style.color="var(--text-color)";
    searchBar.placeholder=""; 
    searchBar.style.paddingLeft="23%";   
})
const disFilter = ()=>{
    searchForm.querySelector("#filterOn").classList.add("disabled");
    filter.style.color="var(--hilight)";
    searchBar.placeholder="Find Movies & TV"; 
    searchBar.style.paddingLeft="3rem";
    searchBar.style.backgroundColor="var(--search-bar-background)";
}

//main functionality



// hover effect on nav items ( supposed to be links)
const navItemsContainer = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links li");
const hoverSlider = document.querySelector(".hover-info");
const hoverContainer = document.querySelector(".hover-content")
navItems.forEach((item)=>{
    item.addEventListener("mouseover",(e)=>{
        e.stopPropagation();
        let pos=Number(getComputedStyle(item).getPropertyValue("--pos")); 
        hoverSlider.style.display="flex"; 
        hoverSlider.style.transform=`translateX(${item.offsetLeft-hoverSlider.offsetLeft}px) translateX(-50%)`;
        hoverContainer.style.transform=`translateX(-${hoverContainer.children[pos].offsetLeft}px)`;
        let height = hoverContainer.children[pos].getBoundingClientRect().height;
        hoverContainer.style.height=`${height}px`;
        hoverSlider.style.height=`${height}px`;
    })
})

const disHover = ()=>{
    hoverSlider.style.display="none";     
}


// to cancel effects from eventListeners...
document.addEventListener("click",(e)=>{
    if(!searchForm.contains(e.target)) disFilter();
})
document.addEventListener("mouseover",(e)=>{
    if(!navItemsContainer.contains(e.target) && !hoverSlider.contains(e.target)){
        disHover();
    }
})