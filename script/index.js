import { offset } from "./slider.js";

(function animeTopic8() {
    const topic8 = document.querySelector(".topic-8")
    const shows = topic8.querySelectorAll(".show")
    const hiddens = topic8.querySelectorAll(".hidden")
    let timer = null;

    const len = Math.min(shows.length, hiddens.length)
    for (let i = 0; i < len; i++) {
        shows[i].addEventListener("mouseover", () => {
            const element = hiddens[i];
            element.style.display = "block";
            let opacity = 0;
            timer = setInterval(() => {
                opacity += 0.01;
                element.style.opacity = opacity;
                if (opacity >= 1)
                    clearInterval(timer);
            })
        })
        shows[i].addEventListener("mouseout", () => {
            if (timer !== null)
                clearInterval(timer);
            const element = hiddens[i];
            element.style.opacity = "0";
            element.style.display = "none";
        })
    }
})();

function addAnimeClass(specifiedScrollY, elements, wasAnimeObj) {
    addEventListener("scroll", () => {
        if (!wasAnimeObj.wasAnime && scrollY + document.documentElement.clientHeight >= specifiedScrollY) {
            wasAnimeObj.wasAnime = true;
            elements.forEach(e => e.classList.add("anime"));
        }
    });
}

(function animeTopic1() {
    const topic = document.querySelector(".topic-1");
    const animeItems = topic.querySelectorAll(".item");
    const topicSize = offset(topic);
    addAnimeClass(topicSize.bottom, animeItems, { wasAnime: false });
    let wasAnime = false;
    addEventListener("scroll",  () => {
        if (!wasAnime && scrollY + document.documentElement.clientHeight >= topicSize.bottom){
            wasAnime = true;
            debugger;
            animeItems[0].classList.add("line");
        }
    })
})();

function doAnimeWithClassAtScroll(specifiedScrollY, className, elements, wasAnime){
    addEventListener("scroll", () => {
        if (!wasAnime.wasAnime && scrollY >= specifiedScrollY){
            wasAnime.wasAnime = true;
            elements.forEach(e => e.classList.add(className));
        }
    });
}

(function animeTopic2(){
    const topic = document.querySelector(".topic-2");
    const beginAnim = offset(topic).top - document.documentElement.clientHeight / 3;
    doAnimeWithClassAtScroll(beginAnim, "anime-left-offset", topic.querySelectorAll(".left-offset"), {wasAnime: false});
    doAnimeWithClassAtScroll(beginAnim, "anime-right-offset", topic.querySelectorAll(".right-offset"), {wasAnime: false});
    doAnimeWithClassAtScroll(beginAnim, "anime-hidden-img", topic.querySelectorAll(".hidden-img"), {wasAnime: false});
})();

function doAnimeWithClassAtScrollWithInterDelay(specifiedScrollY, className, delay, elements, wasAnime){
    addEventListener("scroll", () => {
        if (!wasAnime.wasAnime && scrollY >= specifiedScrollY){
            let delaySum = 0;
            wasAnime.wasAnime = true;
            elements.forEach(e => {
                setTimeout(() => e.classList.add(className), delaySum);
                delaySum += delay;
            });
        }
    });
}

(function animeTopic7(){
    const topic = document.querySelector(".topic-7");
    const beginAnim = offset(topic).top - document.documentElement.clientHeight / 2;
    doAnimeWithClassAtScrollWithInterDelay(beginAnim, "anime-collapse-img", 500, topic.querySelectorAll(".collapse-img"), {wasAnime: false});
    doAnimeWithClassAtScrollWithInterDelay(beginAnim, "anime-transparent", 500, topic.querySelectorAll(".transparent"), {wasAnime: false});
})()