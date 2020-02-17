let currentPage = 1;
let totalNumberOfRows;
let numberOfRowPerPage = 10;



function ready(callback) {
    if (document.readyState != 'loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback();
    });
}

//  Fetch data onLoad page
ready(function () {
    fetchData();
});

//  Sorting function
const handleSortTable = (n) => {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (n === 1) {
                    let nameX = parseInt(x.innerHTML)
                    let nameY = parseInt(y.innerHTML)

                    if (x.innerHTML === 'unknown') {
                        nameX = 0;
                    }
                    if (y.innerHTML === 'unknown') {
                        nameY = 0;
                    }
                    console.log(nameX, nameY)
                    if (nameX > nameY) {
                        shouldSwitch = true;
                        break;
                    }

                } else if (n === 2) {
                    let nameX =  parseInt(x.innerHTML.replace(/,/g, ""))
                    let nameY = parseInt( y.innerHTML.replace(/,/g, ""))

                    if (x.innerHTML === 'unknown') {
                        nameX = 0;
                    }
                    if (y.innerHTML === 'unknown') {
                        nameY = 0;
                    }
                    console.log(nameX, nameY)
                    if (nameX > nameY) {
                        shouldSwitch = true;
                        break;
                    }

                } else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }

            } else if (dir == "desc") {
                if (n === 1) {
                    let nameX = parseInt(x.innerHTML)
                    let nameY = parseInt(y.innerHTML)

                    if (x.innerHTML === 'unknown') {
                        nameX = 0;
                    }
                    if (y.innerHTML === 'unknown') {
                        nameY = 0;
                    }

                    console.log(nameX, nameY)
                    if (nameX < nameY) {
                        shouldSwitch = true;
                        break;
                    }

                } else if (n === 2) {
                    let nameX = parseInt(x.innerHTML.replace(/,/g, ""))
                    let nameY = parseInt( y.innerHTML.replace(/,/g, ""))

                    if (x.innerHTML === 'unknown') {
                        nameX = 0;
                    }
                    if (y.innerHTML === 'unknown') {
                        nameY = 0;
                    }
                    console.log(nameX, nameY)
                    if (nameX < nameY) {
                        shouldSwitch = true;
                        break;
                    }

                }
                else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
} // End of sorting funcition


// Pagination 
function updatePageNumbers() {
    const leftButton = document.getElementById('leftButton')
    const centerButton = document.getElementById('centerButton')
    const rightButton = document.getElementById('rightButton')

    const lastPageNumber = getLastPageNumber()

    if (currentPage == 1) {
        higlightButton(leftButton);
        leftButton.innerHTML = 1;
        centerButton.innerHTML = 2;
        rightButton.innerHTML = 3;
    } else if (currentPage == lastPageNumber) {
        higlightButton(rightButton);
        leftButton.innerHTML = parseInt(lastPageNumber) - 2;
        centerButton.innerHTML = parseInt(lastPageNumber) - 1;
        rightButton.innerHTML = lastPageNumber;
    } else {
        higlightButton(centerButton);
        leftButton.innerHTML = parseInt(currentPage) - 1;
        centerButton.innerHTML = currentPage;
        rightButton.innerHTML = parseInt(currentPage) + 1;
    }
}

function higlightButton(button) {
    const leftButton = document.getElementById('leftButton')
    const centerButton = document.getElementById('centerButton')
    const rightButton = document.getElementById('rightButton')

    leftButton.className = "";
    centerButton.className = "";
    rightButton.className = "";
    button.className = "active";
}

// Fetch data from server using axios
function fetchData() {

    updatePageNumbers();
    let apiUrl = `https://swapi.co/api/people/?page=${currentPage}`;
    axios.get(apiUrl).then((response) => {
        renderTable(response)
        totalNumberOfRows = response.data.count;
    })

}

const renderTable = (response) => {
    console.log(response)
    const tableBody = document.getElementById('table-body')
    let people = response.data.results;

    tableBody.innerHTML = '';

    people.forEach(function (person, index) {
        rednerRow(person, tableBody);
    });

}

// Dom manipulation - creating elements 
const rednerRow = (person, container) => {

    const name = document.createElement("td")
    const height = document.createElement("td")
    const mass = document.createElement("td")
    const created = document.createElement("td")
    const del = document.createElement("td")

    let personCreated = new Date(person.created)
  
    name.innerHTML = person.name
    height.innerHTML = person.height
    mass.innerHTML = person.mass
    created.innerHTML = `${personCreated.toISOString().substring(0, 10)} ${personCreated.toLocaleTimeString().substring(0, 10)}`
    del.innerHTML = '<i id="centerElement" onClick="deleteRow(event)" class="far fa-trash-alt"></i>'



    const tr = document.createElement("tr");
    tr.appendChild(name);
    tr.appendChild(height);
    tr.appendChild(mass);
    tr.appendChild(created);
    tr.appendChild(del);
    container.appendChild(tr);
}

function deleteRow(event) {
    console.log(event.target.parentElement.parentElement.remove());
}

function goToFirst() {
    currentPage = 1;
    fetchData();
}

function getLastPageNumber() {
    return Math.round(totalNumberOfRows / numberOfRowPerPage)
}

// Arrows pagination functions

function goToLast() {
    currentPage = getLastPageNumber();
    fetchData();
}

function goToPage(event) {

    currentPage = event.target.innerHTML;
    fetchData();

}

function goToPrevious() {

    if (currentPage == 1) {
        return;
    }

    currentPage = parseInt(currentPage) - 1
    fetchData();

}

function goToNext() {
    if (currentPage == getLastPageNumber()) {
        return;
    }

    currentPage = parseInt(currentPage) + 1
    fetchData();
}

