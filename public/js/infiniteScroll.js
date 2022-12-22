let throttleTimer;

const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;

  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const removeInfiniteScroll = () => {
  window.removeEventListener('scroll', infiniteScrollListenerFunction);
};

let infiniteScrollListenerFunction = () => {
  let checkMyData = document.getElementById('dataGlobal');
  if (checkMyData && checkMyData.childNodes && checkMyData.childNodes.length > 0)
    handleInfiniteScroll();
};

const handleInfiniteScroll = async () => {
  throttle(async () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1;

    if (endOfPage) {
      page = page + 1;
      let paginatedData = await makeRequest(
        'GET',
        '/getData/' + languageSelection.code,
        null,
        'page=' + page + '&limit=' + limit
      );
      writeDom(JSON.parse(paginatedData));
    }
    if (page >= totalPages - 1) {
      removeInfiniteScroll();
    }
  }, 1000);
};

let writePaginatedData = async (pageIndex) => {
  let paginatedData = await makeRequest(
    'GET',
    getDataUrl + languageSelection.code,
    null,
    'page=' + pageIndex + '&limit=' + limit
  );
  writeDom(JSON.parse(paginatedData));
};
