/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
} */

//DOM selectors
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const blankDetails = document.getElementById('empty-pokemon-details');
const filledDetails = document.getElementById('filled-pokemon-details');
let movesArray = document.getElementsByClassName('poke-move');

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

      //tests
      console.log(pokemonMoves);
      console.log(movesArray);

      function moveLooper(pokemonMoves) {
        const listContainer = document.getElementById('poke-moves');
        const listItems = [...pokemonMoves];

        for (let i = 0; i < 5; i++) {
          const listItem = document.createElement('li');

          if (listItems[i]) {
            const listItemText = document.createTextNode(listItems[i]);
            listItem.appendChild(listItemText);
          }

          listContainer.appendChild(listItem);
        }

        document.body.appendChild(listContainer);
      }

      moveLooper(pokemonMoves);

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

//Event listener that calls getPokemon
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = input.value;
  getPokemon(inputValue);
});
