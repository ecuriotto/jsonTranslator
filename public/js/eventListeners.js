const addEventListeners = () => {
  const acceptTranslations = document.querySelectorAll('.targetAcceptCheck');
  for (let acceptTranslation of acceptTranslations) {
    acceptTranslation.addEventListener('change', (el) => {
      let machineTransText = '';
      if (el.target.checked) {
        const machineTransWithSameName = document.getElementById(
          'machineTrans|' + el.target.id.split('|')[1]
        );
        machineTransText = machineTransWithSameName.value;
      }
      const myTransWithSameName = document.getElementById('myTrans|' + el.target.id.split('|')[1]);
      myTransWithSameName.value = machineTransText;
    });
  }

  window.addEventListener('scroll', infiniteScrollListenerFunction);
};
