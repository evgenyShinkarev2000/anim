"use strict";
function parseCSS(strCSS) {
    const pattern = new RegExp(".*{", "g");
    let selectors = [...new Set(Array.from(strCSS.matchAll(pattern), m => m[0]))];
    selectors = selectors.filter(s => {
        if (!s.startsWith(".")) {
            console.log(`selector ${s} in ${strCSS} isn't a class and will skip`);
            return false;
        }
        return true;
    }).map(s => s.slice(1, -1));
    return [selectors[0], selectors.slice(1)];
}
function selectElementsToAnime(animeExecClasses) {
    const allAnimeElements = new Set();
    animeExecClasses.forEach(className => {
        const selectedClassAnimeElements = document.getElementsByClassName(className);
        for (const e of selectedClassAnimeElements)
            allAnimeElements.add(e);
    });
    return Array.from(allAnimeElements);
}
// Нужно дописать регулярку и выделить значение свойства
function makeSelectorPropertyValueDict(selectors, property, strCSS) {
    const d = {};
    selectors.forEach(selector => {
        debugger;
        const pattern = new RegExp(String.raw `${selector}{.{0,4}${property}.{0,1}:`, "gs");
        const values = Array.from(strCSS.matchAll(pattern), m => m[0]);
        if (values.length > 1)
            throw new Error(`css property ${property} was overwritten by ${values.slice(1).join(", ")}. Create new classes vice cascading.`);
        console.log(`${values} of ${property} for selector ${selector}`);
    });
}
// дописать замену классов на один и переопределение style animation-name
function combineAnimeClasses(animeElements, animeExecClasses, strCss) {
    const selectorValueDict = makeSelectorPropertyValueDict(animeExecClasses, "animation-name", strCss);
    animeElements.forEach(animeElement => {
        const intersect = [];
        animeElement.classList.forEach(className => {
            if (className in animeExecClasses)
                intersect.push(className);
        });
    });
}
//дописать обработк event
async function initAnimation(nameCSS) {
    const strCSS = await fetch(`../css/${nameCSS}`).then(response => response.text());
    const selectors = parseCSS(strCSS);
    const animeStartClass = selectors[0];
    const animeExecClasses = selectors[1];
    const animeElements = selectElementsToAnime(animeExecClasses);
    combineAnimeClasses(animeElements, animeExecClasses, strCSS);
    console.log(animeStartClass);
    console.log(animeExecClasses);
    console.log(animeElements);
}
initAnimation("new-animation.css");
//# sourceMappingURL=new-animation.js.map