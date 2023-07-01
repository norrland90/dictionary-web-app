// TOGGLE DARK/LIGHT MODE
const modeSwitch = document.querySelector('.header__switch');
const form = document.querySelector('.form');

function toggleMode() {
  document.body.classList.toggle('dark');
}

modeSwitch.addEventListener('click', toggleMode);

// SHOW/HIDE FONT CARD AND CHANGE FONT
const showFontsArrow = document.querySelector('.header__show-fonts-btn');
const fontArrow = document.querySelector('.header__arrow-icon');
const fontCard = document.querySelector('.header__font-card');
const currentFont = document.querySelector('.header__current-font');

function showHideFontCard() {
  fontArrow.classList.toggle('rotate');
  if (fontCard.classList.contains('hidden')) {
    fontCard.classList.remove('hidden');
    fontCard.style.transform = 'translateY(0)';
    fontCard.style.opacity = '1';
  } else {
    fontCard.classList.add('hidden');
    fontCard.style.transform = 'translateY(-200%)';
    fontCard.style.opacity = '0';
  }
}

function changeFont(e) {
  if (e.target.id === 'sans-btn') {
    changeCurrentFont('sans');
  } else if (e.target.id === 'serif-btn') {
    changeCurrentFont('serif');
  } else if (e.target.id === 'mono-btn') {
    changeCurrentFont('mono');
  }
}

function changeCurrentFont(font) {
  if (font === 'sans') {
    document.body.style.fontFamily = 'var(--ft-family-sans)';
    currentFont.innerText = 'Sans Serif';
  } else if (font === 'serif') {
    document.body.style.fontFamily = 'var(--ft-family-serif)';
    currentFont.innerText = 'Serif';
  } else {
    document.body.style.fontFamily = 'var(--ft-family-mono)';
    currentFont.innerText = 'Mono';
  }
}

// Hide font card with click outside card
function hideFontCardOnClickOutside(e) {
  const card = e.target.closest('.header__font-card');
  const arrow = e.target.closest('.header__show-fonts-btn');
  if (!card && !fontCard.classList.contains('hidden') && !arrow) {
    showHideFontCard();
  }
}

function onSubmit(e) {
  e.preventDefault();
  const formInput = document.querySelector('.form__input');

  validateInput(formInput.value);

  fetchAPIData(formInput.value);
}

function validateInput(input) {
  const articleElement = document.querySelector('article');
  const formContainer = document.querySelector('.form__container');
  if (!input) {
    articleElement.innerHTML = '';
    formContainer.style.border = '1px solid var(--clr-accent-secondary)';
    const warningParagraph = document.createElement('p');
    warningParagraph.classList.add('form__warning-paragraph');
    warningParagraph.innerText = "Whoops, can't be empty";
    form.appendChild(warningParagraph);
  }
}

form.addEventListener('submit', onSubmit);
showFontsArrow.addEventListener('click', showHideFontCard);
fontCard.addEventListener('click', changeFont);
document.addEventListener('click', hideFontCardOnClickOutside);

// FETCH DATA

const wordSection = document.querySelector('.word');
const playButton = document.querySelector('.word__play-btn');
const articleElement = document.querySelector('article');

async function fetchAPIData(searchTerm) {
  resetPlayButton();

  const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  const response = await fetch(`${API_URL}${searchTerm}`);
  const data = await response.json();

  if (response.ok) {
    console.log(data);
    addSearchTermToDOM(data[0].word, data[0].phonetics);
    addPhoneticsToDOM(data[0].phonetics);
  } else {
    console.log(data);
    noDefinitionsFound(data);
    // Här ska det skrivas ut i DOM att inga data finns.
  }

  // Call functions with data to add stuff

  // console.log(data[0].word);
  // console.log(data[0].phonetics[0]);
  // data[0].meanings.forEach((item) => {
  //   console.log(item.partOfSpeech);
  //   console.log(item.definitions);
  //   console.log(item.synonyms);
  // });
}

function noDefinitionsFound(data) {
  articleElement.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add('no-results');

  const sadFace = document.createElement('i');
  sadFace.classList.add('fa-regular', 'fa-face-frown', 'fa-2xl');

  const heading = document.createElement('h2');
  heading.classList.add('no-results__heading');
  heading.innerText = data.title;

  const paragraph = document.createElement('p');
  paragraph.classList.add('no-results__paragraph');
  paragraph.innerText = `${data.message} ${data.resolution}`;

  div.appendChild(sadFace);
  div.appendChild(heading);
  div.appendChild(paragraph);
  articleElement.appendChild(div);
}

function addSearchTermToDOM(word) {
  // Behöver addera alla element var för sig
  document.querySelector('.word__search-term').innerText = word;
}

function addPhoneticsToDOM(phonetics) {
  let newWord = '';
  let audioURL = '';
  // Look for first one with both text and audio, else look for only text (don't want to combine a certain phonetic with the wrong audio)
  for (let item of phonetics) {
    console.log(item);
    if (item.text && item.audio) {
      newWord = item.text;
      audioURL = item.audio;
      break;
    }
  }
  // If no with both word and audio - check again for first item with text
  if (!newWord) {
    for (let item of phonetics) {
      if (item.text) {
        newWord = item.text;
        audioURL = '';
        break;
      }
    }
  }

  // Add phonetics to DOM
  if (newWord) {
    document.querySelector('.word__phonetic').innerText = newWord;
  } else {
    document.querySelector('.word__phonetic').innerText =
      '/no phonetics found/';
  }

  // Add audio to DOM and change some settings of button
  if (audioURL) {
    const audioElement = document.getElementById('audio');
    audioElement.src = audioURL;

    wordSection.classList.add('hover');
    playButton.removeAttribute('disabled');
    playButton.style.cursor = 'pointer';
  }
}

function playAudio() {
  const audioElement = document.getElementById('audio');
  audioElement.play();
}

function resetPlayButton() {
  wordSection.classList.remove('hover');
  playButton.setAttribute('disabled', 'disabled');
  playButton.style.cursor = 'not-allowed';
  // Ev. gömma knappen istället om det ej finns audio
}

playButton.addEventListener('click', playAudio);
