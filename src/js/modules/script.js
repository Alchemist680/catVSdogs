export function delegationClick() {

}
//фу-ия для закрывания меню в случае,если ширина экрана стала больше, чем ширина, при которой отображается меню, иначе у нас будет заблокан скролл
//!поменять 767.98 на другое значение, если нужно (992.98)
export function closeMenu() {
    if (window.innerWidth > 767.98) {
        const activeIcon = document.querySelector('.menu__icon.active');
        if (activeIcon) {
            activeIcon.classList.remove('active');
            document.querySelector(".menu__body.open").classList.remove("open");
            document.body.classList.remove('lock');
        }
    }
}
//Анимация шакпи при скролле
export function headerScroll() {
    const header = document.querySelector('.header');
    if (header) {
        window.scrollY > 0 ? header.classList.add('scroll') : null;

        window.addEventListener('scroll', () => {
            window.scrollY > 0 ? header.classList.add('scroll') : header.classList.remove('scroll');
        });
    }
}
//Если страница проскролена на более 100 пкс, то шапка исчезает, если скролиться вверх, то появляется
export function ScrollHeader() {
    const header = document.querySelector('.header');
    let scrollPrev = 0;
    if (header) {
        window.addEventListener('scroll', () => {
            window.scrollY > 100 && scrollPrev < window.scrollY ? header.classList.add('out') : header.classList.remove('out');
            scrollPrev = window.scrollY;
        });
    }
}
