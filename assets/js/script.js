// Toggle dark/light mode
const modeSwitch = document.querySelector('.header__switch');

function toggleMode() {
  document.body.classList.toggle('dark');
}

modeSwitch.addEventListener('click', toggleMode);

// Show card with fonts and change fonts
const showFontsArrow = document.querySelector('.header__show-fonts-btn');
const fontCard = document.querySelector('.header__font-card');

// Rotate arrow + show font card on click
function onArrowClick() {
  const fontArrow = document.querySelector('.header__arrow-icon');
  fontArrow.classList.toggle('rotate');
  toggleFontCard();
}

function toggleFontCard() {
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
  const currentFont = document.querySelector('.header__current-font');
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

// Vill gärna få att funka om man trycker utanför kortet - ej som nu när man trycker utanför font-selector-diven
function hideFontCardOnClickOutside(e) {
  let element = e.target.closest('.header__font-selector');
  if (!element && !fontCard.classList.contains('hidden')) {
    onArrowClick();
  }
}

showFontsArrow.addEventListener('click', onArrowClick);
fontCard.addEventListener('click', changeFont);
document.addEventListener('click', hideFontCardOnClickOutside);
