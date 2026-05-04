/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
} */

//DOM selectors

const searchHistoryDatalist = document.getElementById('search-history');
const searchHistory = JSON.parse(localStorage.getItem('searchHistory') ?? '[]');

// Restore autocomplete datalist from saved history
searchHistory.forEach((term) => {
  const option = document.createElement('option');
  option.value = term;
  searchHistoryDatalist.appendChild(option);
});

let browseIndex = parseInt(localStorage.getItem('browseIndex') ?? '1', 10);
const browseMin = 1;
const browseMax = 1025; // last mainline Pokémon ID
const browsePrev = document.getElementById('browse-prev');
const browseNext = document.getElementById('browse-next');

function updateBrowseButtons() {
  browsePrev.disabled = browseIndex <= browseMin;
  browseNext.disabled = browseIndex >= browseMax;
}

browsePrev.addEventListener('click', () => {
  if (browseIndex <= browseMin) return;
  browseIndex--;
  getPokemon(browseIndex);
  updateBrowseButtons();
});

browseNext.addEventListener('click', () => {
  if (browseIndex >= browseMax) return;
  browseIndex++;
  getPokemon(browseIndex);
  updateBrowseButtons();
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.key === ' ') {
    e.preventDefault();
    const name = pokeName.textContent;
    if (name && name !== 'No Image Found') speak(name);
    return;
  }
  if (e.key === 'ArrowLeft' && browseIndex > browseMin) {
    browseIndex--;
    getPokemon(browseIndex);
    updateBrowseButtons();
  } else if (e.key === 'ArrowRight' && browseIndex < browseMax) {
    browseIndex++;
    getPokemon(browseIndex);
    updateBrowseButtons();
  }
});

function addToSearchHistory(term) {
  if (searchHistory.includes(term)) return;
  searchHistory.push(term);
  const option = document.createElement('option');
  option.value = term;
  searchHistoryDatalist.appendChild(option);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

const blankDetails = document.getElementById('empty-pokemon-details');
const filledDetails = document.getElementById('filled-pokemon-details');
const selectElement = document.getElementById('search-option');
const inputElement = document.querySelector('input[id="search-input"]');
const errorSpan = document.getElementById('error-span');
const goButton = document.querySelector('button[class="go-button"]');
const pokeImage = document.getElementById('poke-image');
const pokeImageWrapper = document.getElementById('poke-image-wrapper');
const speechBubble = document.getElementById('speech-bubble');

// Voice config
const voiceConfig = { rate: 0.75, pitch: 1, volume: 1, voice: null };

// Pronunciation corrections for commonly mispronounced Pokémon names.
// Keys are lowercase, stripped of non-alphanumeric chars to match any display form.
// Values are phonetic spellings the TTS engine handles naturally.
const pronunciations = {
  // Gen 1
  'exeggcute':    'ex-egg-kyoot',
  'exeggutor':    'ex-egg-yoo-tor',
  'marowak':      'mair-oh-wak',
  'scyther':      'sy-ther',
  'scizor':       'sy-zer',
  'wobbuffet':    'wob-uh-fay',
  'wynaut':       'why-not',
  'mrmime':       'mister mime',
  'mimejr':       'mime junior',
  'hooh':         'ho oh',
  // Gen 2
  'meganium':     'meh-gay-nee-um',
  'typhlosion':   'ty-floh-zhun',
  'feraligatr':   'feh-ral-ih-gay-ter',
  'suicune':      'swee-koon',
  'entei':        'en-tay',
  'raikou':       'ry-koo',
  'lugia':        'loo-jee-uh',
  'celebi':       'sell-uh-bee',
  // Gen 3
  'kyogre':       'ky-oh-ger',
  'groudon':      'grow-don',
  'rayquaza':     'ray-kwaz-uh',
  'jirachi':      'jih-rah-chee',
  'deoxys':       'dee-ox-is',
  'regice':       'rej-ee-ice',
  'regirock':     'rej-ee-rock',
  'registeel':    'rej-ee-steel',
  'regigigas':    'rej-ee-guy-gus',
  'latias':       'lay-tee-us',
  'latios':       'lay-tee-os',
  // Gen 4
  'lucario':      'loo-car-ee-oh',
  'garchomp':     'gar-chomp',
  'dialga':       'dee-al-guh',
  'palkia':       'pal-kee-uh',
  'giratina':     'jeer-uh-tee-nuh',
  'uxie':         'yook-see',
  'mesprit':      'mes-prit',
  'azelf':        'ay-zelf',
  'heatran':      'hee-tran',
  'shaymin':      'shay-min',
  'darkrai':      'dark-rye',
  'cresselia':    'kreh-see-lee-uh',
  'phione':       'fee-oh-nee',
  'manaphy':      'man-uh-fee',
  'rotom':        'roh-tom',
  // Gen 5
  'zoroark':      'zor-oh-ark',
  'reshiram':     'resh-ih-ram',
  'zekrom':       'zek-rom',
  'kyurem':       'kyoo-rem',
  'genesect':     'jen-uh-sect',
  'keldeo':       'kel-dee-oh',
  'meloetta':     'mel-oh-et-uh',
  'cobalion':     'koh-bay-lee-on',
  'terrakion':    'teh-rack-ee-on',
  'virizion':     'vih-riz-ee-on',
  'tornadus':     'tor-nay-dus',
  'thundurus':    'thun-dyoor-us',
  'landorus':     'lan-dor-us',
  // Gen 6
  'xerneas':      'zur-nee-us',
  'yveltal':      'ee-vel-tal',
  'zygarde':      'zy-gard',
  'diancie':      'dy-an-see',
  'hoopa':        'hoo-pah',
  'volcanion':    'vol-kay-nee-on',
  // Gen 7
  'tapu koko':    'tah-poo koh-koh',
  'tapukoko':     'tah-poo koh-koh',
  'tapulele':     'tah-poo leh-lay',
  'tapubulu':     'tah-poo boo-loo',
  'tapufini':     'tah-poo fee-nee',
  'solgaleo':     'sol-gay-lee-oh',
  'lunala':       'loo-nah-luh',
  'nihilego':     'ny-hil-eh-go',
  'buzzwole':     'buz-wole',
  'xurkitree':    'zur-kih-tree',
  'celesteela':   'sel-uh-stee-luh',
  'kartana':      'kar-tah-nuh',
  'guzzlord':     'guz-lord',
  'necrozma':     'neh-kroz-muh',
  'magearna':     'muh-jeer-nuh',
  'marshadow':    'mar-shuh-doh',
  'poipole':      'poy-pole',
  'naganadel':    'nag-uh-nay-del',
  'stakataka':    'stah-kuh-tah-kuh',
  'blacephalon':  'blay-sef-uh-lon',
  'zeraora':      'zeh-rah-or-uh',
  // Gen 8
  'zacian':       'zay-shun',
  'zamazenta':    'zam-uh-zen-tuh',
  'eternatus':    'ee-ter-nah-tus',
  'kubfu':        'koob-foo',
  'urshifu':      'ur-shee-foo',
  'calyrex':      'kal-ih-rex',
  'glastrier':    'glas-tree-er',
  'spectrier':    'spek-tree-er',
  'arceus':       'ar-see-us',
  // Misc tricky ones
  'porygon2':     'porygon two',
  'porygonz':     'porygon zee',
  'typenull':     'type null',
  'silvally':     'sil-val-ee',
  'charizard':    'char-i-zard',
  'raichu':       'rhy-chew',
  'clefable':     'cla-fable',
  'gyarados':     'gair-uh-dos',
  'mimikyu':      'mim-ih-kyoo',
  'togepi':       'toh-geh-pee',
  'togetic':      'toh-geh-tik',
  'togekiss':     'toh-geh-kiss',
};

function speak(text) {
  speechSynthesis.cancel();
  const key = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const phonetic = pronunciations[key] ?? text;
  const utterance = new SpeechSynthesisUtterance(phonetic);
  utterance.rate = voiceConfig.rate;
  utterance.pitch = voiceConfig.pitch;
  utterance.volume = voiceConfig.volume;
  if (voiceConfig.voice) utterance.voice = voiceConfig.voice;
  speechSynthesis.speak(utterance);
}

const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const langSelect = document.getElementById('lang-select');
const voiceSelect = document.getElementById('voice-select');
const rateSlider = document.getElementById('rate-slider');
const pitchSlider = document.getElementById('pitch-slider');
const volumeSlider = document.getElementById('volume-slider');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const volumeValue = document.getElementById('volume-value');

settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('open');
});

function populateLangs(voices) {
  const current = langSelect.value;
  const langs = [...new Set(voices.map((v) => v.lang))].sort();
  langSelect.innerHTML = '';
  langs.forEach((lang) => {
    const opt = document.createElement('option');
    opt.value = lang;
    opt.textContent = lang;
    if (lang === current || (!current && lang === 'en-US')) opt.selected = true;
    langSelect.appendChild(opt);
  });
}

function populateVoices() {
  const voices = speechSynthesis.getVoices();
  populateLangs(voices);
  filterVoicesByLang(voices);
}

function filterVoicesByLang(voices) {
  const lang = langSelect.value || 'en-US';
  const filtered = voices.filter((v) => v.lang === lang);
  voiceSelect.innerHTML = '';
  filtered.forEach((v) => {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = v.name;
    voiceSelect.appendChild(opt);
  });
  voiceConfig.voice = filtered[0] ?? null;
}

populateVoices();
speechSynthesis.addEventListener('voiceschanged', populateVoices);

langSelect.addEventListener('change', () => {
  filterVoicesByLang(speechSynthesis.getVoices());
});

voiceSelect.addEventListener('change', () => {
  voiceConfig.voice = speechSynthesis.getVoices().find((v) => v.name === voiceSelect.value) ?? null;
});

rateSlider.addEventListener('input', () => {
  voiceConfig.rate = parseFloat(rateSlider.value);
  rateValue.textContent = voiceConfig.rate;
});

pitchSlider.addEventListener('input', () => {
  voiceConfig.pitch = parseFloat(pitchSlider.value);
  pitchValue.textContent = voiceConfig.pitch;
});

volumeSlider.addEventListener('input', () => {
  voiceConfig.volume = parseFloat(volumeSlider.value);
  volumeValue.textContent = voiceConfig.volume;
});

let spriteIndex = 0;
let spriteInterval = null;

function startSpriteRotation() {
  if (spriteInterval) clearInterval(spriteInterval);

  const spriteUrls = pokeImageWrapper.dataset.spriteUrls;
  if (!spriteUrls) return;

  const sprites = JSON.parse(spriteUrls);
  if (sprites.length <= 1) return;

  spriteIndex = 0;
  pokeImage.style.opacity = '1';
  spriteInterval = setInterval(() => {
    spriteIndex = (spriteIndex + 1) % sprites.length;
    pokeImage.style.opacity = '0';
    setTimeout(() => {
      pokeImage.src = sprites[spriteIndex];
      pokeImage.style.opacity = '1';
    }, 300);
  }, 2000);
}

pokeImageWrapper.addEventListener('mouseenter', () => {
  // const url = pokeImageWrapper.dataset.cryUrl;
  // if (url) new Audio(url).play();

  const name = pokeName.textContent;
  if (name && name !== 'No Image Found') speak(name);
});
const pokeName = document.getElementById('poke-name');

// Full Pokémon name list for fuzzy search (fetched once)
let allPokemonNames = null;

async function getAllPokemonNames() {
  if (allPokemonNames) return allPokemonNames;
  const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000');
  allPokemonNames = res.data.results.map((p) => p.name);
  return allPokemonNames;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

async function fuzzyMatch(input) {
  const names = await getAllPokemonNames();
  const lower = input.toLowerCase();
  let best = names[0];
  let bestScore = Infinity;
  for (const name of names) {
    const score = levenshtein(lower, name);
    if (score < bestScore) {
      bestScore = score;
      best = name;
      if (score === 0) break;
    }
  }
  return best;
}

//Dynamic Placeholder Text
selectElement?.addEventListener('change', (e) => {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  if (selectedOption.value === 'id') {
    inputElement.placeholder = 'Find Pokémon by Id';
  } else if (selectedOption.value === 'name') {
    inputElement.placeholder = 'Find Pokémon by Name';
  } else if (selectedOption.value === 'fuzzy') {
    inputElement.placeholder = 'Find Pokémon (fuzzy)';
    getAllPokemonNames(); // prefetch
  }
});

// Pokémon type → screen background colour
const typeColors = {
  normal:   '#9a9a7a',
  fire:     '#e06020',
  water:    '#3a70e0',
  electric: '#d4aa10',
  grass:    '#4aaa30',
  ice:      '#5ababa',
  fighting: '#a02820',
  poison:   '#8030a0',
  ground:   '#b89040',
  flying:   '#7868d0',
  psychic:  '#e03870',
  bug:      '#7a9018',
  rock:     '#887828',
  ghost:    '#503870',
  dragon:   '#5028e0',
  dark:     '#483828',
  steel:    '#8888a0',
  fairy:    '#c070a0',
};

const screenDisplay = document.getElementById('screen-display');

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
      const sprites = [
        res.data.sprites.front_default,
        res.data.sprites.back_default,
        res.data.sprites.front_shiny,
        res.data.sprites.back_shiny,
        res.data.sprites.other?.['official-artwork']?.front_default,
        res.data.sprites.other?.['official-artwork']?.front_shiny,
      ].filter(Boolean);

      pokeImage.src = sprites[0] ?? res.data.sprites['front_default'];
      pokeImageWrapper.dataset.spriteUrls = JSON.stringify(sprites);
      pokeName.innerHTML = capitalizeWords(res.data.name);
      document.getElementById('poke-number').textContent = '#' + String(res.data.id).padStart(3, '0');
      screenDisplay.style.background = typeColors[res.data.types[0].type.name] ?? '#3a3a5c';
      speechBubble.textContent = capitalizeWords(res.data.name) + '!';
      pokeImageWrapper.dataset.cryUrl = res.data.cries?.latest ?? '';

      //adds filled details element
      filledDetails.style.display = 'flex';

      //adds image element
      pokeImage.style.display = 'block';

      startSpriteRotation();
      addToSearchHistory(name);
      browseIndex = res.data.id;
      updateBrowseButtons();
      localStorage.setItem('browseIndex', browseIndex);
      localStorage.setItem('lastPokemon', res.data.name);
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

document.querySelector('.poke-moves').addEventListener('mouseover', (e) => {
  if (e.target.tagName === 'LI' && e.target.textContent) {
    speak(e.target.textContent);
  }
});

//pressing GO executes function or error validation
goButton?.addEventListener('click', async (e) => {
  e.preventDefault();
  errorSpan.innerHTML = '';
  const raw = inputElement.value.toLowerCase().trim();
  if (raw === '') {
    errorSpan.innerHTML = 'Please enter a Pokemon Name or ID';
    return;
  }
  const mode = selectElement.options[selectElement.selectedIndex].value;
  if (mode === 'fuzzy') {
    const match = await fuzzyMatch(raw);
    getPokemon(match);
  } else {
    getPokemon(raw);
  }
});

// Restore last session on load
const lastPokemon = localStorage.getItem('lastPokemon');
if (lastPokemon) getPokemon(lastPokemon);
