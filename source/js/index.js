let navMain = document.querySelectorAll('.main-nav__list-box');
let navClose = document.querySelector('.main-nav__icon');
let navOpen = document.querySelector('img.main-nav__icon--menu');

console.log(navMain);

navOpen.addEventListener('click', function(){
    navMain.forEach(item => item.classList.remove('main-nav__list-box--closed'));
    navMain.forEach(item => item.classList.add('main-nav__list-box--opened'));

    navOpen.style.display = "none";
});

navClose.addEventListener('click', function(){
    navMain.forEach(item => item.classList.add('main-nav__list-box--closed'));
    navMain.forEach(item => item.classList.remove('main-nav__list-box--opened'));
    navOpen.style.display = "block";
})
