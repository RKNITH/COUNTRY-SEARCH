let searchBtn = document.querySelector('#searchBtn');
let searchItem = document.querySelector('#searchItem');
let mainCon = document.querySelector('#mainCon');
let backArrow = document.querySelector('#backArrow');
let toogle = document.querySelector('#toogle');
let loading = document.querySelector('#loading');
let docs = document.querySelector('#docs');
let mql = window.matchMedia('(max-width: 1025px)');


let isToogle = false;
let isDoc = false;
let selections = ["all", "name", "capital", "currency", "lang", "region", "subregion"];
let type = `all`;
let search = '';
let lastData = "";
let apiData = "";
const apiUrl = `https://restcountries.com/v3.1/`;

console.log(searchBtn);
console.log(searchItem);
console.log(mainCon);
console.log(backArrow);
console.log(toogle);
console.log(loading);
console.log(docs);
console.log(mql);



searchItem.onkeyup = function (e) { if (e.key === 'Enter') { searchBtn.click(); } }
mql.onchange = (e) => {
    if (e.matches) {
        document.querySelector("#nav1").style.left = "-260px";
        document.querySelector("#nav2").style.right = "-260px";
        isToogle = true;
        isDoc = true;
    }
    else {
        document.querySelector("#nav2").style.right = "0px";
        document.querySelector("#nav1").style.left = "0px";
        isToogle = false;
        isDoc = false;
    }
}

toogle.addEventListener('click', () => {
    if (isToogle) {
        document.querySelector("#nav1").style.left = "0px";
        isToogle = false;
        document.querySelector("#topArrow").classList.remove("fa-angles-right");
        document.querySelector("#topArrow").classList.add("fa-angles-left");
    }
    else {
        document.querySelector("#nav1").style.left = "-260px";
        isToogle = true;
        document.querySelector("#topArrow").classList.add("fa-angles-right");
        document.querySelector("#topArrow").classList.remove("fa-angles-left");
    }
})

docs.addEventListener('click', () => {
    if (isDoc) {
        document.querySelector("#nav2").style.right = "0px";
        isDoc = false;
    }
    else {
        document.querySelector("#nav2").style.right = "-260px";
        isDoc = true;
    }
})

selections.forEach(ele => {
    document.querySelector(`#${ele}`).addEventListener('click', () => {
        searchItem.value = "";
        document.querySelector('#searchCon').classList.remove('hidden');
        selections.forEach(e => {
            document.querySelector(`#${e}`).classList.remove('okactive');
        })
        document.querySelector(`#${ele}`).classList.add('okactive');
        type = ele;
        if (ele === "all") {
            document.querySelector('#searchCon').classList.add('hidden');
            search = "";
            FetchAPI();
        }
        searchItem.placeholder = `Search ${ele}`
    });
});

backArrow.addEventListener('click', () => {
    backArrow.classList.add("hidden");
    mainCon.innerHTML = lastData;
    apiData = JSON.parse(localStorage.getItem("LastFetched"));
    apiData.forEach((country) => {
        document.querySelector(`#${country.cca3}`).addEventListener('click', () => fetchFull(country))
    })
});

searchBtn.addEventListener('click', () => {
    search = searchItem.value;
    FetchAPI();
})

async function FetchAPI() {
    loading.classList.remove("hidden");
    try {
        // console.log(`${apiUrl}${type}/${search}`);
        const response = await fetch(`${apiUrl}${type}/${search}`);
        const apiData = await response.json();
        apiData.sort(function (a, b) {
            return a.name.common.localeCompare(b.name.common);
        });
        loading.classList.add("hidden");
        let temp = "";
        apiData.forEach((country) => {
            temp += `
            <div class="row mb-3 p-2 border border-dark detail-con">
            <h1 class="d-flex align-items-center"> <span class="flag shadow"> ${country.flag} </span> <span class="counName"> ${country.name.common} </span></h1>
            <p class="counDetails">Country region: <span class="special">${country.region}</span>, capital: <span class="special">${country.capital}</span>, timezone: <span class="special">${country.timezones[0]}</span></p>
            <div class="btn-custom" id=${country.cca3}> Read More </div>
            </div>
            `;
        })
        mainCon.innerHTML = temp;
        lastData = temp;
        apiData.forEach((country) => {
            document.querySelector(`#${country.cca3}`).addEventListener('click', () => fetchFull(country))
        })
        localStorage.setItem("LastFetched", JSON.stringify(apiData));
        console.log("Api Working Successfully");
        backArrow.classList.add("hidden");
    } catch {
        loading.classList.add("hidden");
        alert(`Not Found "${search}" in type "${type}", try another.`);
        console.log("Api Fetching failed");
    }
}

FetchAPI();
type = "name";


function fetchFull(country) {
    backArrow.classList.remove("hidden");
    let curName, curSym;
    let curLang = "";
    for (key in country.currencies) {
        if (country.currencies.hasOwnProperty(key)) {
            curName = country.currencies[key].name;
            curSym = country.currencies[key].symbol;
        }
    }
    for (key in country.languages) {
        if (country.languages.hasOwnProperty(key)) {
            curLang += country.languages[key] + " ";
        }
    }
    console.log(country.languages);
    let temp = `
    <div class="row m-2 p-2 ">
    <h1 class="d-flex align-items-center mb-3"> <span class="flag shadow"> ${country.flag} </span> <span class="counName"> ${country.name.common} </span></h1>
    <table class="table table-hover">
            <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Fields</th>
                    <th scope="col">Description</th>
                    </tr>
            </thead>
            <tbody class="table-style">
                <tr>
                <th scope="row">1</th>
                <td>Official Name</td>
                <td>${country.name.official}</td>
                </tr>
                
                <tr>
                <th scope="row">2</th>
                <td>Capital city</td>
                <td>${country.capital}</td>
                </tr>

                <tr>
                <th scope="row">3</th>
                <td>UN Member</td>
                <td>${((country.unMember) ? "Yes" : "No")}</td>
                </tr>

                <tr>
                <th scope="row">4</th>
                <td>Currency</td>
                <td>${curName} ( ${curSym} )</td>
                </tr>

                <tr>
                <th scope="row">5</th>
                <td>Main languages</td>
                <td>${curLang}</td>
                </tr>

                <tr>
                <th scope="row">6</th>
                <td>Region</td>
                <td>${country.region}</td>
                </tr>

                <tr>
                <th scope="row">7</th>
                <td>Sub-Region</td>
                <td>${country.subregion}</td>
                </tr>

                <tr>
                <th scope="row">8</th>
                <td>Average Latitude / Longitude </td>
                <td>${country.latlng[0]} , ${country.latlng[1]} </td>
                </tr>

                <tr>
                <th scope="row">9</th>
                <td>Area Covered</td>
                <td>${country.area} Km.sq</td>
                </tr>

                <tr>
                <th scope="row">10</th>
                <td>Population</td>
                <td>${country.population} </td>
                </tr>

                <tr>
                <th scope="row">11</th>
                <td>Time-Zone</td>
                <td>${country.timezones[0]}</td>
                </tr>

                <tr>
                <th scope="row">12</th>
                <td>Coat Of Arms</td>
                <td><a href="${country.coatOfArms.png}" target="_blank"><img src="${country.coatOfArms.png}" alt="..." class="w-4"></a></td>
                </tr>
                
                <tr>
                <th scope="row">13</th>
                <td>Google Map</td>
                <td><a href="${country.maps.googleMaps}" target="_blank">Visit Now</a></td>
                </tr>

                <tr>
                <th scope="row">14</th>
                <td>Open Street Maps</td>
                <td><a href="${country.maps.openStreetMaps}" target="_blank">Visit Now</a></td>
                </tr>

            </tbody>
    </table>
    </div>`
    mainCon.innerHTML = temp;
    // console.log(country.name.common);
}