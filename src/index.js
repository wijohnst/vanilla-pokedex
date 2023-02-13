/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
} */

console.log('test');

//get axios
axios.get('https://pokeapi.co/api/v2/pokemon/pikachu').then((res) => {
  console.log(res);
});
