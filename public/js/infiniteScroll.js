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
    window.removeEventListener("scroll", infiniteScrollListenerFunction);
};

let infiniteScrollListenerFunction = () => {
    let checkMyData = document.getElementById("myData");
    if (checkMyData && checkMyData.childNodes && checkMyData.childNodes.length > 0)
        handleInfiniteScroll()
}

const handleInfiniteScroll = async () => {
    throttle(async () => {
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1;

        if (endOfPage) {
            page = page + 1;
            let paginatedData = await makeRequest("GET", "/getData/"+ languageSelection.code, null, "page=" + page + "&limit=" + limit);
            writeDom(JSON.parse(paginatedData));
        }
        if (page >= totalPages - 1) {
            removeInfiniteScroll();
        }
    }, 1000);
};

let writePaginatedData = async (pageIndex) => {
    let paginatedData = await makeRequest("GET", getDataUrl + languageSelection.code, null, "page=" + pageIndex + "&limit=" + limit);
    writeDom(JSON.parse(paginatedData));
}

/*
let writePagination = () => {
    if(totalPages >100){
        let ul = document.createElement("ul");
        let liFirst = document.createElement("li");
        if(page == 0){
            liFirst.classList.add("disabled");
        }
        ul.appendChild(liFirst);
        let btnDiv = document.createElement("div");
        btnDiv.classList.add("are-small");
        //btnDiv.setAttribute("display","table");

        let btnFirst = document.createElement("button");
        btnFirst.classList.add("button");
        //btnFirst.classList.add("is-link");
        //btnFirst.classList.add("is-light");
        btnFirst.classList.add("paginationBtn");
        btnFirst.classList.add("m-1");
        //btnFirst.classList.add("is-light");
        btnFirst.setAttribute("id", "paginationFirst");
        btnFirst.setAttribute("onclick","writePaginatedData(0)");
        btnFirst.setAttribute("name", "paginationFirst");
        btnFirst.textContent="First"
        btnFirst.disabled=true;
        

        let btnLast = btnFirst.cloneNode(true); 
        
        btnLast.setAttribute("id", "paginationEnd");
        btnLast.setAttribute("onclick","writePaginatedData(0)");
        btnLast.setAttribute("name", "paginationEnd");
        btnLast.textContent="End"
        if(totalPages>0){
            btnLast.disabled=false;
        }

        let btnPrev = btnFirst.cloneNode(true); 
        btnPrev.setAttribute("id", "paginationPrev");
        btnPrev.setAttribute("onclick","writePaginatedData(0)");
        btnPrev.setAttribute("name", "paginationPrev");
        btnPrev.textContent="<< Prev"

        let inputPage = document.createElement("input");
        inputPage.classList.add("input");
        inputPage.type="number"
        inputPage.setAttribute("min",0);
        inputPage.setAttribute("max",totalPages);
        inputPage.setAttribute("id","paginationInput")
        inputPage.classList.add("paginationDiv");
        inputPage.setAttribute("placeholder","page between 0 and " + totalPages);
        //inputPage.value=0;
        if(totalPages>0){
            btnLast.disabled=false;
        }
        //inputPage.setAttribute("size",5);

        let btnNext = btnFirst.cloneNode(true); 
        btnNext.setAttribute("id", "paginationNext");
        btnNext.setAttribute("onclick","writePaginatedData(0)");
        btnNext.setAttribute("name", "paginationNext");
        btnNext.textContent="Next >>"
        if(totalPages>0){
            btnNext.disabled=false;
        }

        btnDiv.appendChild(btnFirst);
        btnDiv.appendChild(btnPrev);
        btnDiv.appendChild(inputPage);
        btnDiv.appendChild(btnNext);
        btnDiv.appendChild(btnLast);

        document.getElementById("pagination").appendChild(btnDiv)   
    }
   
}
*/