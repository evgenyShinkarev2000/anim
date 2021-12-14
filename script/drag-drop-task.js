function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function initDragDropTask(className){
    const dragDropTask = document.querySelector("." + className).querySelector(".drag-task");
    const table = dragDropTask.querySelector("table");
    const answerQuestRows = table.querySelectorAll(".answer-question-row");
    const answersHolder = table.querySelector(".answers-holder");
    const button = dragDropTask.querySelector("button");
    const answers = [];
    const dropableZones = [answersHolder];
    const questAnswerDict = {};

    answerQuestRows.forEach(row => {
        const rowAnswers = [];
        dropableZones.push(row.querySelector(".answer-zone"));
        row.querySelectorAll(".answer").forEach(answer => {
            answer.draggable = true;
            rowAnswers.push(answer.textContent);
            answers.push(answer);
        });
        questAnswerDict[row.querySelector(".question-zone").textContent] = rowAnswers;
    });

    answers.forEach(answer => {
        answer.addEventListener("dragstart", event => {
            event.target.classList.add("selected");
        })
        answer.addEventListener("dragend", event => {
            event.target.classList.remove("selected");
        })
    })
    dropableZones.forEach(zone => {
        zone.addEventListener("dragover", event => {
            event.preventDefault();
            const selected = dragDropTask.querySelector(".selected");
            zone.append(selected);
        });
    });

    shuffle(answers).forEach(answer => answersHolder.append(answer));

    console.log(questAnswerDict);
    debugger;

    button.onclick = () => {
        answerQuestRows.forEach(row => {
            const putAnswers = row.querySelectorAll(".answer");
            const rigthAnswers = questAnswerDict[row.querySelector(".question-zone").textContent];
            putAnswers.forEach(putAnswer => {
                if (rigthAnswers.includes(putAnswer.textContent))
                    putAnswer.style["box-shadow"] = "0px 2px 8px 0px green";
                else 
                    putAnswer.style["box-shadow"] = "0px 2px 8px 0px red";
            })
        });
    }
}

initDragDropTask("drag-task-block-1");