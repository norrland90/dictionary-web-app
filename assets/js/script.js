// TOGGLE DARK/LIGHT MODE
const modeSwitch = document.querySelector('.header__switch');

function toggleMode() {
  document.body.classList.toggle('dark');
}

modeSwitch.addEventListener('click', toggleMode);

// SHOW/HIDE FONT CARD AND CHANGE FONT
const showFontsArrow = document.querySelector('.header__show-fonts-btn');
const fontCard = document.querySelector('.header__font-card');

function showHideFontCard() {
  const fontArrow = document.querySelector('.header__arrow-icon');
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

// Hide font card with click outside card
function hideFontCardOnClickOutside(e) {
  const card = e.target.closest('.header__font-card');
  const arrow = e.target.closest('.header__show-fonts-btn');
  if (!card && !fontCard.classList.contains('hidden') && !arrow) {
    showHideFontCard();
  }
}

showFontsArrow.addEventListener('click', showHideFontCard);
fontCard.addEventListener('click', changeFont);
document.addEventListener('click', hideFontCardOnClickOutside);
