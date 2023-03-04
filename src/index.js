/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
} */

//DOM selectors
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const blankDetails = document.getElementById('empty-pokemon-details');
const filledDetails = document.getElementById('filled-pokemon-details');
} 

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
  });

//Use axios to get pokemon response object
function getPokemon(name) {
  axios
    .get('https://pokeapi.co/api/v2/pokemon/' + name)
    .then((res) => {
      //removes blank details element
      blankDetails.style.display = 'none';

      //grabs first five moves of pokemon into an array
      let pokemonMoves = res.data.moves
        .slice(0, 5)
        .map((move) => move.move.name);

      //Add height to table
      let pokeHeightValue = res.data.height;
      let HeightInTable = document.getElementById('poke-height');
      HeightInTable.innerHTML = pokeHeightValue + '"';

      //Add weight to table
      let pokeWeightValue = res.data.weight;
      let WeightInTable = document.getElementById('poke-weight');
      WeightInTable.innerHTML = `${pokeWeightValue} kg`;

      //Add pokemon type to table
      let pokeTypeValue = res.data.types[0].type.name;
      let TypeInTable = document.getElementById('poke-type');
      TypeInTable.innerHTML = pokeTypeValue;

      //Add move1 to DOM
      let pokeMove1 = pokemonMoves[0];
      let ListMove1 = document.getElementById('poke-move-1');
      ListMove1.innerHTML = pokeMove1;

      //Add move2 to DOM
      let pokeMove2 = pokemonMoves[1];
      let ListMove2 = document.getElementById('poke-move-2');
      ListMove2.innerHTML = pokeMove2;

      //Add move3 to DOM
      let pokeMove3 = pokemonMoves[2];
      let ListMove3 = document.getElementById('poke-move-3');
      ListMove3.innerHTML = pokeMove3;

      //Add move4 to DOM
      let pokeMove4 = pokemonMoves[3];
      let ListMove4 = document.getElementById('poke-move-4');
      ListMove4.innerHTML = pokeMove4;

      //Add move5 to DOM
      let pokeMove5 = pokemonMoves[4];
      let ListMove5 = document.getElementById('poke-move-5');
      ListMove5.innerHTML = pokeMove5;

      //adds filled details element
      filledDetails.style.display = 'block';
    })
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
  e.preventDefault();
  errorSpan.innerHTML = '';
  if (inputElement.value === '') {
    errorSpan.innerHTML = 'Please enter a Pokemon Name or ID';
  } else {
    getPokemon(inputElement.value);
  }
});
