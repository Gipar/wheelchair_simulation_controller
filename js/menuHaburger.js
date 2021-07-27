const menu = document.getElementById('menu-hamburger');

menu.addEventListener('click', () => {
  const nav = document.getElementById('nav');
  const navHamburger = document.getElementsByClassName('nav__hamburger');
  if(!nav.classList.contains('on')) {
    nav.classList.add('on');
    navHamburger[0].classList.add('on');
  } else {
    nav.classList.remove('on');
    navHamburger[0].classList.remove('on');
  }
});
