const topic8 = document.querySelector(".topic-8")
const shows = topic8.querySelectorAll(".show")
const hiddens = topic8.querySelectorAll(".hidden")
let timer = null;

const len = Math.min(shows.length, hiddens.length)
for (let i = 0; i < len; i++){
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