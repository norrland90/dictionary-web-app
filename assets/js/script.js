// Toggle dark/light mode
const modeSwitch = document.querySelector('.header__switch');

function toggleMode() {
  document.body.classList.toggle('dark');
}

modeSwitch.addEventListener('click', toggleMode);

// Show card with fonts
const showFontsArrow = document.querySelector('.header__show-fonts-btn');

// Rotate arrow + show font card on click
function onArrowClick() {
  const fontArrow = document.querySelector('.header__arrow-icon');
  fontArrow.classList.toggle('rotate');

  const fontCard = document.querySelector('.header__font-card');
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

showFontsArrow.addEventListener('click', onArrowClick);
