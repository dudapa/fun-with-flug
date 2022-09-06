const countries = document.getElementById('countries');
const neighbours = document.getElementById('neighbours');
const submitBTn = document.getElementById('submit');


async function getCountry(country) {
    clearCountries();
    let data;
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        [data] = await response.json();
        renderCountry(data)
    } catch(err) {
        const notFoundErr = `
        <div class="alert alert-danger text-center" role="alert" id="alert-result">
        Country does not exist or wrong keyword!!! Please try it again.
        </div>
        `;
        countries.insertAdjacentHTML('beforeend', notFoundErr);
        return
    }
    try {
        const neighbours = data.borders;
        renderNeighbours(neighbours);
    } catch(err) {
        const noNeighbour = `
        <div class="alert alert-info text-center" role="alert" id="alert-neighbour">
        This country does not have any neighbours
        </div>
        `;
        neighbours.insertAdjacentHTML('beforeend', noNeighbour);
    }
}

// Handle user input and render country
function userInput(e) {
    e.preventDefault();
    const userValue = document.getElementById('search').value;
    getCountry(userValue);
    document.getElementById('search').value = '';

    
    
}

// Render country that user look for
function renderCountry(data, neighbour=false){

    const html = `

        <div class="card mt-3">
            <img
              src="${data.flags.svg}"
            />
    
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><span class="descript">Name:</span> <span id="name">${
                data.name.common
              }</span></li>
              <li class="list-group-item"><span class="descript">Capital:</span> <span id="capital">${
                data.capital[0]
              }</span></li>
              <li class="list-group-item"><span class="descript">
                Population:</span> <span id="population">${(
                  +data.population / 1000000
                ).toFixed(1)} mil.</span>
              </li>
              <li class="list-group-item"><span class="descript">
                Language:</span> <span id="language">${
                  Object.values(data.languages)[0]
                }</span>
              </li>
              <li class="list-group-item"><span class="descript">
                Currency:</span> <span id="currency">${
                  Object.values(data.currencies)[0].name
                }</span>
              </li>
            </ul>
          </div>`;
    
    if(!neighbour){
        countries.insertAdjacentHTML('beforeend', html);
    } else {
        neighbours.insertAdjacentHTML('beforeend', html); 
    }

}

// Fetch the neighbours data and reder them
function renderNeighbours(neighbours){
   
        neighbours.forEach(async nb => {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${nb}`);
            const [data] = await response.json()
            renderCountry(data, true);
    }) 
    }


function clearCountries() {
    countries.innerHTML = '';
    neighbours.innerHTML = ''
}

// Event listeners
submitBTn.addEventListener('click', userInput);
