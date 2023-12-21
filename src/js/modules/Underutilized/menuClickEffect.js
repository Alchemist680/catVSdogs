//!Меню эффект по клику (не протестенно)

//!Импорт
/* import { menuIndicatorEffect } from "./modules/menuClickEffect.js"; */
//!Иницилизация (может быть можно просто импортировать файл, чтобы все содержимое просто перенислось и иницилировать прямо тут)
/* const menuIndicatorWrappers = document.querySelectorAll('[data-menu-indicator]');
menuIndicatorWrappers.length ? menuIndicatorEffect() : null; */
//!Пример html (обязательны li, атрибут data-menu-indicator у оболочки)
/* <ul data-menu-indicator class="list">
    <li data-menu-indicator-color="red" class="list__item"><a href="">Element 1</a></li>
    <li data-menu-indicator-color="blue" class="list__item active"><a href="">Element 2</a></li>
    <li data-menu-indicator-color="green" class="list__item"><a href="">Element 3</a></li>
    <li data-menu-indicator-color="purple" class="list__item"><a href="">Element 4</a></li>
    <li data-menu-indicator-color="yellow" class="list__item"><a href="">Element 5</a></li>
</ul> */
//! нужные стили вот:
/*на список
 .list {
    position: relative;
    на эффект
    .effect{
    position: absolute;
    width: rem(10);
    left: 0;
    background-color: #fff;
    transition: all 0.3s ease 0s;
    border-radius: 0 rem(5) rem(5) 0;
}
} */

export function menuIndicatorEffect() {
    menuIndicatorWrappers.forEach(menuIndicatorWrapper => {
        const items = menuIndicatorWrapper.querySelectorAll('li');
        if (items.length) {
            const activeItem = menuIndicatorWrapper.querySelector('li.active');
            const effect = document.createElement('span');
            effect.classList.add('effect');
            menuIndicatorWrapper.appendChild(effect);
            if (activeItem) {
                const rectAcitveItem = activeItem.getBoundingClientRect();
                const rectList = menuIndicatorWrapper.getBoundingClientRect();
                const top = rectAcitveItem.top - rectList.top;
                const height = rectAcitveItem.height;
                const color = activeItem.dataset.menuIndicatorColor;

                effect.style.top = `${top}px`;
                effect.style.height = `${height}px`;
                color !== null ? effect.style.backgroundColor = color : null;
            }
            menuIndicatorWrapper.addEventListener('click', (e) => {
                if (e.target.closest('li')) {
                    const currentActiveItem = e.target.closest('li');
                    const color = currentActiveItem.dataset.menuIndicatorColor;

                    const rectAcitveItem = currentActiveItem.getBoundingClientRect();
                    const rectList = menuIndicatorWrapper.getBoundingClientRect();
                    const top = rectAcitveItem.top - rectList.top;
                    const height = rectAcitveItem.height;
                    const left = rectAcitveItem.left - rectList.left;

                    effect.style.top = `${top}px`;
                    effect.style.left = `${left}px`;
                    effect.style.height = `${height}px`;
                    color !== null ? effect.style.backgroundColor = color : null;
                    e.preventDefault();
                }
            });
        }
    });
}