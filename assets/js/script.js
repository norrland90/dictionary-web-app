const showFontsArrow = document.querySelector('.header__show-fonts-btn');

// Rotate arrow button on click
function onArrowClick() {
  const fontArrow = document.querySelector('.header__arrow-icon');
  fontArrow.classList.toggle('rotate');

  const fontCard = document.querySelector('.header__font-card');
  if (fontCard.classList.contains('hidden')) {
    fontCard.classList.remove('hidden');
    fontCard.style.transform = 'translateY(0)';
  } else {
    fontCard.classList.add('hidden');
    fontCard.style.transform = 'translateY(-250px)';
  }
}

showFontsArrow.addEventListener('click', onArrowClick);
