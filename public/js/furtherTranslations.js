const savePrevPhrases = (file) => {
  const reader = new FileReader();
  reader.addEventListener('load', async (event) => {
    const myDataRaw = event.target.result;

    await makeRequest('POST', '/savePreviousVersionTrans/' + languageSelection.code, myDataRaw);
  });
  reader.readAsText(file);
};
