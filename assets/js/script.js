// VARIABLES
const modeSwitch = document.querySelector('.header__switch');
const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');

const showFontsArrow = document.querySelector('.header__show-fonts-btn');
const fontArrow = document.querySelector('.header__arrow-icon');
const fontCard = document.querySelector('.header__font-card');
const currentFont = document.querySelector('.header__current-font');

let wordSection = document.querySelector('.word');
let playButton = document.querySelector('.word__play-btn');
const articleElement = document.querySelector('.dictionary');
const formContainer = document.querySelector('.form__container');

// TOGGLE DARK/LIGHT MODE

function toggleMode() {
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
    localStorage.setItem('mode', 'light');
  } else {
    document.body.classList.add('dark');
    localStorage.setItem('mode', 'dark');
  }
}

function initApp() {
  // Get mode from local storage
  const currentMode = localStorage.getItem('mode');
  if (currentMode === 'dark') {
    document.body.classList = 'dark';
  }

  // Get font from local storage
  const currentFont = localStorage.getItem('font');
  changeCurrentFont(currentFont);
}
initApp();

modeSwitch.addEventListener('click', toggleMode);

// SHOW/HIDE FONT CARD AND CHANGE FONT

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
    localStorage.setItem('font', 'sans');
  } else if (font === 'serif') {
    document.body.style.fontFamily = 'var(--ft-family-serif)';
    currentFont.innerText = 'Serif';
    localStorage.setItem('font', 'serif');
  } else {
    document.body.style.fontFamily = 'var(--ft-family-mono)';
    currentFont.innerText = 'Mono';
    localStorage.setItem('font', 'mono');
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
  resetForm();
  resetPlayButton();
  articleElement.innerHTML = '';

  if (validateInput(formInput.value)) {
    fetchAPIData(formInput.value);
  }
}

function validateInput(input) {
  if (!input) {
    formContainer.style.border = '1px solid var(--clr-accent-secondary)';
    const warningParagraph = document.createElement('p');
    warningParagraph.classList.add('form__warning-paragraph');
    warningParagraph.innerText = "Whoops, can't be empty";
    form.appendChild(warningParagraph);
    return false;
  } else {
    return true;
  }
}

function resetForm() {
  formContainer.style.border = '1px solid transparent';
  const warningParagraph = document.querySelector('.form__warning-paragraph');
  if (warningParagraph) {
    warningParagraph.remove();
  }
}

// FETCH DATA

async function fetchAPIData(searchTerm) {
  const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  const response = await fetch(`${API_URL}${searchTerm}`);
  const data = await response.json();

  if (response.ok) {
    addWordSectionToDOM(data[0].word);
    addPhoneticsToDOM(data[0].phonetics);
    addMeaningsToDOM(data[0].meanings);
    addSourceToDOM(data[0].sourceUrls);
  } else {
    noDefinitionsFound(data);
  }
}

function noDefinitionsFound(data) {
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

function addWordSectionToDOM(word) {
  const section = document.createElement('section');
  section.classList.add('word');
  const wordContainer = document.createElement('div');
  wordContainer.classList.add('word__container');
  const searchTerm = document.createElement('h1');
  searchTerm.classList.add('word__search-term');
  searchTerm.innerText = word;
  const phonetic = document.createElement('p');
  phonetic.classList.add('word__phonetic');
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('word__play-btn');
  button.setAttribute('id', 'play-btn');
  button.setAttribute('disabled', 'disabled');
  button.innerHTML = `<audio src="" id="audio"></audio>
  <svg
    class="word__play-svg"
    xmlns="http://www.w3.org/2000/svg"
    width="75"
    height="75"
    viewBox="0 0 75 75"
    aria-labelledby="play"
    role="img"
  >
    <title id="play">Play</title>
    <g fill="#A445ED" fill-rule="evenodd">
      <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
      <path d="M29 27v21l21-10.5z" />
    </g>
  </svg>`;

  button.addEventListener('click', playAudio);
  wordContainer.appendChild(searchTerm);
  wordContainer.appendChild(phonetic);
  section.appendChild(wordContainer);
  section.appendChild(button);
  articleElement.appendChild(section);
}

function addPhoneticsToDOM(phonetics) {
  let newWord = '';
  let audioURL = '';
  // Look for first one with both text and audio, else look for only text (don't want to combine a certain phonetic with the wrong audio)
  for (let item of phonetics) {
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
    wordSection = document.querySelector('.word');
    playButton = document.querySelector('.word__play-btn');

    const audioElement = document.getElementById('audio');
    audioElement.src = audioURL;

    wordSection.classList.add('hover');
    playButton.removeAttribute('disabled');
    playButton.style.cursor = 'pointer';
  }
}

function addMeaningsToDOM(meanings) {
  meanings.forEach((item) => {
    // Dela upp i mindre funktioner??

    const partOfSpeech = item.partOfSpeech;
    const definitionsArray = item.definitions;
    const synonymsArray = item.synonyms;

    // Sectionelement and headings
    const section = document.createElement('section');
    section.classList.add('meaning');

    const headingContainer = document.createElement('div');
    headingContainer.classList.add('meaning__heading-container');

    const heading = document.createElement('h2');
    heading.classList.add('meaning__heading');
    heading.innerText = partOfSpeech;

    const horizontalLine = document.createElement('div');
    horizontalLine.classList.add('horizontal-line');
    headingContainer.appendChild(heading);
    headingContainer.appendChild(horizontalLine);
    section.appendChild(headingContainer);

    const subHeading = document.createElement('h3');
    subHeading.classList.add(
      'meaning__subheading',
      'meaning__subheading--meaning'
    );
    subHeading.innerText = 'Meaning';
    section.appendChild(subHeading);

    // List
    const list = document.createElement('ul');
    list.classList.add('meaning__list');
    definitionsArray.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.classList.add('meaning__list-item');
      listItem.innerText = item.definition;
      list.appendChild(listItem);
      if (item.example) {
        const listExample = document.createElement('p');
        listExample.classList.add('meaning__list-example');
        listExample.innerText = item.example;
        list.appendChild(listExample);
      }
    });
    section.appendChild(list);

    // Synonyms
    if (synonymsArray.length !== 0) {
      const synonymsContainer = document.createElement('div');
      synonymsContainer.classList.add('meaning__synonyms-container');
      section.appendChild(synonymsContainer);
      const synonymsSubHeading = document.createElement('h3');
      synonymsSubHeading.classList.add(
        'meaning__subheading',
        'meaning__subheading--synonyms'
      );
      synonymsSubHeading.innerText = 'Synonyms';
      synonymsContainer.appendChild(synonymsSubHeading);

      const synonymsLinksContainer = document.createElement('div');
      synonymsLinksContainer.classList.add('meaning__links-container');
      synonymsArray.forEach((item) => {
        const link = document.createElement('a');
        link.setAttribute('href', '#');
        link.classList.add('meaning__link');
        link.innerText = item;
        link.addEventListener('click', onSynonymClick);
        synonymsLinksContainer.appendChild(link);
      });
      synonymsContainer.appendChild(synonymsLinksContainer);
    }
    articleElement.appendChild(section);
  });
}

function onSynonymClick(e) {
  formInput.value = e.target.innerText;
  document.querySelector('.form__submit-btn').click();
}

function addSourceToDOM(source) {
  const footerElement = document.createElement('footer');
  footerElement.classList.add('source');
  const horizontalLine = document.createElement('div');
  horizontalLine.classList.add('horizontal-line');
  footerElement.appendChild(horizontalLine);

  const sourceMainContainer = document.createElement('div');
  sourceMainContainer.classList.add('source__main-container');
  footerElement.appendChild(sourceMainContainer);

  const sourceHeading = document.createElement('h2');
  sourceHeading.classList.add('source__heading');
  sourceHeading.innerText = 'Source';
  sourceMainContainer.appendChild(sourceHeading);

  source.forEach((item) => {
    const sourceLinkContainer = document.createElement('div');
    sourceLinkContainer.classList.add('source__link-container');
    sourceMainContainer.appendChild(sourceLinkContainer);

    sourceLinkContainer.innerHTML = `<a href="${item}" target="_blank" class="source__link"
  >${item}
  <span class="sr-only">(opens in a new tab)</span></a
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="14"
  height="14"
  viewBox="0 0 14 14"
  aria-hidden="true"
  role="img"
>
  <path
    fill="none"
    stroke="#838383"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"
  />
</svg>`;
  });
  articleElement.appendChild(footerElement);
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

form.addEventListener('submit', onSubmit);
showFontsArrow.addEventListener('click', showHideFontCard);
fontCard.addEventListener('click', changeFont);
document.addEventListener('click', hideFontCardOnClickOutside);
