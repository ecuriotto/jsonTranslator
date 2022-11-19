
const manageCompleteness = (numberOfUpdatedKeys, numberOfTotalKeys) => {
    let saveEl = document.getElementById("save");
    if (numberOfUpdatedKeys != 0 && numberOfUpdatedKeys == numberOfTotalKeys) {
        isFinal = true;
        saveEl.textContent = "Save"
        saveEl.classList.remove("draft-button");
        saveEl.classList.add("final-button");
    }
    else {
        isFinal = false
        saveEl.textContent = "Save as draft"
        saveEl.classList.remove("final-button");
        saveEl.classList.add("draft-button");
    }
}

const updateProgressBar = () => {
    let numberOfUpdatedKeys = 0;
    let progressElement = document.getElementById("progress");
    let progressTextElement = document.getElementById("progressText");
    progressElement.setAttribute("max", numberOfTotalKeys);
    let toTranslate = document.getElementsByName("myTrans");
    for (key of toTranslate) {
        if (key.value != null && key.value != "" && !key.classList.contains(helperColor)) {
            numberOfUpdatedKeys++;
        }
    }
    progressTextElement.innerHTML = numberOfUpdatedKeys + " / " + numberOfTotalKeys + " keys updated";
    progressElement.value = numberOfUpdatedKeys;

    manageCompleteness(numberOfUpdatedKeys, numberOfTotalKeys);

}

setInterval(updateProgressBar, 5000)