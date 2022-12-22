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
};

setInterval(updateProgressBar, 5000);
