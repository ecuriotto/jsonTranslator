const manageCompleteness = (numberOfUpdatedKeys) => {
  let saveEl = document.getElementById('save');
  //numberOfUpdatedKeys is the number of translations done by the user in the page
  //The sum with alreadyTranslatedNumber can be greater than numberOfTotalKeys
  if (numberOfUpdatedKeys + alreadyTranslatedNumber >= numberOfTotalKeys) {
    isFinal = true;
    saveEl.textContent = 'Save final';
    saveEl.classList.remove('draft-button');
    saveEl.classList.add('final-button');
  } else {
    isFinal = false;
    saveEl.textContent = 'Save as draft';
    saveEl.classList.remove('final-button');
    saveEl.classList.add('draft-button');
  }
};

const updateProgressBar = () => {
  let numberOfUpdatedKeys = 0;
  let progressElement = document.getElementById('progress');
  let progressTextElement = document.getElementById('progressText');
  progressElement.setAttribute('max', numberOfTotalKeys);
  let toTranslate = document.getElementsByName('myTrans');
  for (key of toTranslate) {
    if (key.value != null && key.value != '' && !key.classList.contains(helperColor)) {
      numberOfUpdatedKeys++;
    }
  }
  let progressText = numberOfUpdatedKeys + ' / ' + numberOfTotalKeys + ' keys updated';

  if (alreadyTranslatedNumber > 0)
    progressText += ' (' + alreadyTranslatedNumber + ') translated previously';
  progressTextElement.innerHTML = progressText;
  progressElement.value = numberOfUpdatedKeys;

  manageCompleteness(numberOfUpdatedKeys);
};

setInterval(updateProgressBar, 5000);
