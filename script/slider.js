function offset(element){
    const rect = element.getBoundingClientRect();
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop;
    const left = rect.left + screenLeft;
    return {top: top, left: left, bottom: top + element.offsetHeight, right: left + element.offsetWidth};
}

const animeBlock = document.querySelector(".slider-1");
const animeItems = animeBlock.querySelectorAll("img");
let isFixed = false;
window.addEventListener("scroll", () => {
    const offsetAnimeBlock = offset(animeBlock);

    // console.log(offsetAnimeBlock.bottom - offsetAnimeBlock.top);
    if (!isFixed && scrollY >= offsetAnimeBlock.top && scrollY + document.documentElement.clientHeight <= offsetAnimeBlock.bottom){
        isFixed = true;
        animeItems.forEach(e => {
            e.style.position = "static";
            eOffset = offset(e);
            const top = eOffset.top - offsetAnimeBlock.top;
            e.style.position = "fixed";
            e.style.top = `${top}px`;
        })
    }
    else if (isFixed && scrollY < offsetAnimeBlock.top){
        isFixed = false;
        animeItems.forEach(e => {
            e.style.position = "static";
        })
    }
    else if (isFixed && scrollY + document.documentElement.clientHeight > offsetAnimeBlock.bottom){
        isFixed = false;
        // console.log(`scrollY ${scrollY} animeBlockBottom ${offsetAnimeBlock.bottom}`);
        animeItems.forEach(e => {
            const topFixed = offset(e).top;
            e.style.position = "static";
            const topStatic = offset(e).top;
            e.style.position = "relative";
            e.style.top = topFixed - topStatic + "px";
        })
    }
})
window.addEventListener("resize", () => {
    console.log("reize");
    animeItems.forEach(e => {
        const parent = e.parentElement;
        e.style["max-width"] = parent.offsetWidth + "px";
        e.style["max-height"] = parent.offsetHeight + "px";
    })
})
