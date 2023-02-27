/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
} */

//DOM selectors
const selectElement = document.getElementById('search-option');
const inputElement = document.querySelector('input[id="search-input"]');
const errorSpan = document.getElementById('error-span');
const goButton = document.querySelector('button[class="go-button"]');

//Dynamic Placeholder Text
selectElement?.addEventListener('change', (e) => {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  if (selectedOption.value === 'id') {
    inputElement.placeholder = 'Find Pokémon by Id';
  } else if (selectedOption.value === 'name') {
    inputElement.placeholder = 'Find Pokémon by Name';
  }
});

//Use axios to get pokemon response object
function getPokemon(name) {
  axios
    .get('https://pokeapi.co/api/v2/pokemon/' + name)
    .then((res) => console.log(res.data))
    .catch((err) => {
      if (err.response) {
        //server responded with other than 200/success
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
          console.log('No Pokemon found, try again');
        }
      } else if (err.request) {
        //request made, no response
        console.error(err.request);
      } else {
        //any other err, display err message
        console.error(err.message);
      }
    });
}

//pressing GO executes function or error validation
goButton?.addEventListener('click', (e) => {
  console.log('click');
  e.preventDefault();
  errorSpan.innerHTML = '';
  if (inputElement.value === '') {
    errorSpan.innerHTML = 'Please enter a Pokemon Name or ID';
  } else {
    getPokemon(inputElement.value);
  }
});
