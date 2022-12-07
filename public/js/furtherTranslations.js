const savePrevPhrases = (file) => {
  const reader = new FileReader();
  reader.addEventListener('load', async (event) => {
    const myDataRaw = event.target.result;

    await makeRequest('POST', '/savePreviousVersionTrans/' + languageSelection.code, myDataRaw);
    let x = document.getElementById('snackbar');

    // Add the "show" class to DIV
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 3000);
  });
  reader.readAsText(file);
};
