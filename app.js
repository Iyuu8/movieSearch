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