function savePrevPhrases(file) {
  const reader = new FileReader();
  reader.addEventListener('load', async (event) => {
    const myDataRaw = event.target.result;

    await makeRequest('POST', '/savePreviousVersionTrans/' + languageSelection.code, myDataRaw);
    let x = document.getElementById('snackbar');
    x.innerHTML = 'The file has been loaded correctly';
    // Add the "show" class to DIV
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 3000);
  });
  reader.readAsText(file);
}

function saveDiff(file) {
  const reader = new FileReader();
  reader.addEventListener('load', async (event) => {
    const myDataRaw = event.target.result;

    const response = await fetch('saveDiff', {
      method: 'POST',
      body: myDataRaw,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    const diffTotal = await response.json();
    console.log(`${diffTotal.numberOfDiff} differences identified`);
    let x = document.getElementById('snackbar');
    x.innerHTML = `${diffTotal.numberOfDiff} differences identified`;
    // Add the "show" class to DIV
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 3000);
  });
  reader.readAsText(file);
}
