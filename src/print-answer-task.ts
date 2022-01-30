const mainURI = "https://interactiveclassbookapi.azurewebsites.net/ChooseTask/Tasks";
const localURI = "http://localhost:38272/ChooseTask/Tasks";


function stringHtmlToElement(htmlString: string) {
    var template = document.createElement('template');
    htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = htmlString;
    const node = template.content.firstChild;
    if (node == null)
        throw new Error("string isn't html")
    
    return node;
}

async function loadTask(){
    return await Promise.all([
        fetch(mainURI).then(res => res.json()).catch(er => {
            console.log("fetch error to main remote server " + mainURI + "\n" + er);
            return fetch(localURI).then(res => res.json());
        })
        .catch(er => {
            console.log("fetch error to local sever " + localURI + "\n" + er);
            console.log("task wasnt load");
        }),
        fetch("../blocks/print-answer-task-block.html").then(res => res.text()),
        ]);
}

async function buildTask(dataPromise: Promise<any>){
    const data = await dataPromise;
    const tasks = data[0] as string[];
    const taskBlankString = data[1] as string;
    const parentBlank = document.getElementsByTagName("form")[0].getElementsByClassName("answers")[0];
    let i = 0;

    tasks.forEach(task => {
        const divElement  = stringHtmlToElement(taskBlankString) as HTMLDivElement;
        divElement.getElementsByTagName("p")[0].innerText = task;
        divElement.getElementsByTagName("input")[0].name = i.toString();
        i++;
        parentBlank.appendChild(divElement);
    });
}
function handleSubmit(form: HTMLFormElement){
    const values: string[] = [];
    for (let i = 0; i < form.elements.length; i++){
        if (form.elements[i].tagName == "INPUT"){
            const input = form.elements[i] as HTMLInputElement;
            if (input.type !== "text"){
                continue;
            }
            values.push(input.value);
        }
    }
    return values;
}

async function postTask(answers: string[]): Promise<boolean[]>{
    const res = await fetch(mainURI, {
        method: "POST",
        body: JSON.stringify(answers)
    }).catch(er => {
        console.log("fetch post error to main URI " + mainURI + "\n" + er);
        return fetch(localURI, {
            method: "POST",
            body: JSON.stringify(answers)
        });
    }).catch(er => {
        console.log("fetch post error to local URI " + localURI + "\n" + er);
        console.log("can't load right answers");
    });
    if (!res) return [];
    let bodyJson;
    try{
        bodyJson = res.json();
    }
    catch(e){
        console.log("parse error" + e);
    }

    return bodyJson;
}
function paintAnswers(form: HTMLFormElement, rightAnsers: boolean[]){

    rightAnsers.forEach((isRightAnswer, index) => {
        const element = (form.elements[index] as HTMLElement);
        if (isRightAnswer){
            element.classList.replace("wrong", "right");
            element.classList.add("right");
        } else{
            element.classList.replace("right", "wrong");
            element.classList.add("wrong");
        }
    });
}
async function initTask(){
    buildTask(loadTask());
    const form = document.getElementsByTagName("form")[0];
    form.onsubmit = e => e.preventDefault();
    let answers: string[];
    form.addEventListener("submit", () => {
        answers = handleSubmit(form);
        postTask(answers).then(rightAnswers => paintAnswers(form, rightAnswers))
    });
}


initTask();