/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
} */

//DOM selectors

const blankDetails = document.getElementById('empty-pokemon-details');
const filledDetails = document.getElementById('filled-pokemon-details');
const selectElement = document.getElementById('search-option');
const inputElement = document.querySelector('input[id="search-input"]');
const errorSpan = document.getElementById('error-span');
const goButton = document.querySelector('button[class="go-button"]');
const pokeImage = document.getElementById('poke-image');
const pokeName = document.getElementById('poke-name');

//Dynamic Placeholder Text
selectElement?.addEventListener('change', (e) => {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  if (selectedOption.value === 'id') {
    inputElement.placeholder = 'Find Pokémon by Id';
  } else if (selectedOption.value === 'name') {
    inputElement.placeholder = 'Find Pokémon by Name';
  }
});

//Function to capitalize words
function capitalizeWords(str) {
  // Split the string into an array of words
  let words = str.split(/[\s-]+/);

  // Iterate through each word in the array
  for (let i = 0; i < words.length; i++) {
    // Capitalize the first letter of the word and concatenate it with the rest of the word
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the array of words back into a single string, using hyphens to re-join hyphenated words
  return words.join('-');
}

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
      TypeInTable.innerHTML = capitalizeWords(pokeTypeValue);

      //Add move1 to DOM
      let pokeMove1 = pokemonMoves[0];
      let ListMove1 = document.getElementById('poke-move-1');
      ListMove1.innerHTML = capitalizeWords(pokeMove1);

      //Add move2 to DOM
      let pokeMove2 = pokemonMoves[1];
      let ListMove2 = document.getElementById('poke-move-2');
      ListMove2.innerHTML = capitalizeWords(pokeMove2);

      //Add move3 to DOM
      let pokeMove3 = pokemonMoves[2];
      let ListMove3 = document.getElementById('poke-move-3');
      ListMove3.innerHTML = capitalizeWords(pokeMove3);

      //Add move4 to DOM
      let pokeMove4 = pokemonMoves[3];
      let ListMove4 = document.getElementById('poke-move-4');
      ListMove4.innerHTML = capitalizeWords(pokeMove4);

      //Add move5 to DOM
      let pokeMove5 = pokemonMoves[4];
      let ListMove5 = document.getElementById('poke-move-5');
      ListMove5.innerHTML = capitalizeWords(pokeMove5);

      //Add sprite image and text
      pokeImage.src = res.data.sprites['front_default'];
      pokeName.innerHTML = capitalizeWords(res.data.name);

      //adds filled details element
      filledDetails.style.display = 'block';

      //adds image element
      pokeImage.style.display = 'block';
    })
    .catch((err) => {
      if (err.response) {
        //server responded with other than 200/success
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
          console.log('No Pokemon found, try again');
          errorSpan.innerHTML = 'No Pokemon found, try again';
        }
      } else if (err.request) {
        //request made, no response
        console.error(err.request);
        errorSpan.innerHTML = 'No Pokemon found, try again';
      } else {
        //any other err, display err message
        console.error(err.message);
        errorSpan.innerHTML = 'No Pokemon found, try again';
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
    getPokemon(inputElement.value.toLowerCase());
  }
});
