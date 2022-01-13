function offset(element: HTMLElement){
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop;
    const left = rect.left + screenLeft;
    return {top: top, left: left, bottom: top + element.offsetHeight, right: left + element.offsetWidth};
}

function parseCSS(strCSS: string){
    const pattern = new RegExp(String.raw`\.[\w|\d|\-]{0,}`, "g");
    let selectors = [...new Set(Array.from(strCSS.matchAll(pattern), m => m[0]))];
    selectors = selectors.filter(s => {
        if (!s.startsWith(".")){
            console.log(`selector ${s} in ${strCSS} isn't a class and will skip`);
            return false;
        }
        return true;
    }).map(s => s.slice(1));

    return [selectors[0], selectors.slice(1)];
}

function selectElementsToAnime(animeExecClasses: string[]){
    const allAnimeElements = new Set<Element>();
    animeExecClasses.forEach(className => {
        const selectedClassAnimeElements = document.getElementsByClassName(className);
        for(const e of selectedClassAnimeElements)
            allAnimeElements.add(e);
    });

    return Array.from(allAnimeElements);
}

function makeSelectorPropertyValueDict(selectors: string[], property: string, strCSS: string){
    const d: {[key: string]: string} = {};
    selectors.forEach(selector => {
        const patternPropertyValue = new RegExp(String.raw`${property}\s{0,}:\s{0,}[\w|\-]{0,}\s{0,};`)
        const patternSelectorProperty = new RegExp(String.raw`\.${selector}\{[^\}]{0,}${property}\s{0,}:\s{0,}[\w|\-|\d]{0,}\s{0,};`, "gs");
        const selectorProperties = Array.from(strCSS.matchAll(patternSelectorProperty), m => m[0]);

        if (selectorProperties.length > 1)
            throw new Error(`css property ${property} was overwritten by ${selectorProperties.slice(1).join(", ")}. Create new classes vice cascading.`);
        if (selectorProperties.length == 0)
            console.log(`class ${selector} doesn't contain property ${property} or RegExp pattern has bag`);
        else{
            const propertyValueList = selectorProperties[0].match(patternPropertyValue);
            if (!propertyValueList || propertyValueList.length == 0)
                throw new Error(`pattern ${patternSelectorProperty} found wanted string, but pattern ${patternPropertyValue} which incule in previous pattern didn't find wanted part of the string`);
            if (propertyValueList.length > 1)
                console.log(`found few properties with equal key in one class. Should remove not used.`);
            const propertyValue = propertyValueList[propertyValueList.length - 1];
            const value = propertyValue.slice(propertyValue.indexOf(":") + 1, propertyValue.indexOf(";")).trim();
            d[selector] = value;
            console.log(`${value} is value of property ${property} for selector ${selector}`);
        }
    });

    return d;
}

function combineAnimeClasses(animeElements: Element[], animeExecClasses: string[], strCss: string){
    const selectorValueDict = makeSelectorPropertyValueDict(animeExecClasses, "animation-name", strCss);
    animeElements.forEach(animeElement => {
        const intersectAnimeClasses: string[] = [];
        debugger;
        animeElement.classList.forEach(className =>{
            if (animeExecClasses.includes(className))
                intersectAnimeClasses.push(className);
        });
        const animeNames: string[] = [];
        intersectAnimeClasses.forEach(className => {
            animeNames.push(selectorValueDict[className]);
        });
        (animeElement as HTMLElement).style.animationName = animeNames.join(", ");
    });
}

function setAnimeStartAtScroll(animeElements: HTMLElement[]){
    const screenHeight = document.documentElement.clientHeight;
    const topStart = screenHeight / 3 * 2;
    animeElements.forEach(animeElement => {
        const animeElementOffset = offset(animeElement);
        addEventListener("scroll", () => {
            if (screenHeight + scrollY > animeElementOffset.bottom || topStart + scrollY > animeElementOffset.top)
                animeElement.style.animationPlayState = "running";
        });
    });
}

async function initAnimation(nameCSS: string){
    const defaultOnScroll = window.onscroll;
    window.onscroll = () => window.scrollTo(0, 0);
    const strCSS = await fetch(`../css/${nameCSS}`).then(response => response.text());
    window.onscroll = defaultOnScroll;
    const selectors = parseCSS(strCSS);
    const animeStartClass = selectors[0] as string;
    const animeExecClasses = selectors[1] as string[];
    const animeElements = selectElementsToAnime(animeExecClasses);
    combineAnimeClasses(animeElements, animeExecClasses, strCSS);
    setAnimeStartAtScroll(animeElements as HTMLElement[]);
    console.log(animeStartClass + " class used for anime start");
    console.log(animeExecClasses + " classes used for define anime");
    console.log(animeElements + " elements from html page, which will anime");
}

initAnimation("new-animation.css");