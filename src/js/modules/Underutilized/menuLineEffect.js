//!Импортирование
/*
    import { menuEffect } from "./modules/menuLineEffect.js";
    import { menuEffectItem } from "./modules/menuLineEffect.js";
*/

//!Иницилизация
/*
    const menuLinksWrappers = document.querySelectorAll('[data-line-effect]');
    menuLinksWrappers.length ? menuEffect() : null;
    menuEffect();
    menuEffectItem();
*/

//!Стили
/*
для li обязательно указываем это
    position: relative;
    overflow: hidden;

стилизация эффекта (текст естественно должен быть стилизирован также, как и ссылка, поэтому стили желательно наследовать)
    .hover{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        background-color: #fff;
        will-change: transform;
        overflow: hidden;
        &__text{
            will-change: transform;
        }
    }
*/

//!Дата атрибуты для работы (снипет lme)
/*
    data-line-effect='horizontal' data-line-effect-speed='300' data-line-effect-timing-function='ease-out'
*/

//!пример html
/* <ul data-line-effect data-line-effect-speed='300' data-line-effect-timing-function='ease-out' class="list">
    <li class="list__item"><a href="">Element 1</a></li>
    <li class="list__item"><a href="">Element 2</a></li>
    <li class="list__item"><a href="">Element 3</a></li>
    <li class="list__item"><a href="">Element 4</a></li>
    <li class="list__item"><a href="">Element 5</a></li>
</ul> */

//Это не надо, но пусть лежит
const menuLinksWrappers = document.querySelectorAll('[data-line-effect]');
menuLinksWrappers.length ? menuEffect() : null;

export function menuEffect() {
    menuLinksWrappers.forEach(menuLinksWrapper => {
        const menuLinks = menuLinksWrapper.querySelectorAll('a');
        const effectSpeed = menuLinksWrapper.dataset.lineEffectSpeed ? menuLinksWrapper.dataset.lineEffectSpeed : 200;
        const isHorizontal = menuLinksWrapper.dataset.lineEffect == "h" || menuLinksWrapper.dataset.lineEffect == "horizontal" ? true : false;
        const effectTransisionTimingFunction = menuLinksWrapper.dataset.lineEffectTimingFunction ? menuLinksWrapper.dataset.lineEffectTimingFunction : 'ease';
        menuLinks.length ? menuEffectItem(menuLinks, effectSpeed, isHorizontal, effectTransisionTimingFunction) : null;
    });
}
export function menuEffectItem(menuLinks, effectSpeed, isHorizontal, effectTransisionTimingFunction) {
    const effectTransition = `transition: transform ${effectSpeed}ms ${effectTransisionTimingFunction};`;
    const effectHover = `transform: translate3d(0px, 0%, 0px);`;
    let effectBack, effectForward;

    if (isHorizontal) {
        effectBack = `transform: translate3d(-100%, 0px, 0px);`;
        effectForward = `transform: translate3d(100%, 0px, 0px);`;
    } else {
        effectBack = `transform: translate3d(0px, -100%, 0px);`;
        effectForward = `transform: translate3d(0px, 100%, 0px);`;
    }

    menuLinks.forEach(menuLink => {
        menuLink.insertAdjacentHTML('beforeend', `
            <span style="transform: translate3d(0px, 100%, 0px);" class="hover">
                <span style="transform: translate3d(0px, -100%, 0px);" class="hover__text">${menuLink.textContent}</span>
            </span>
        `);
        menuLink.onmouseenter = menuLink.onmouseleave = menuLinkActions;
    });

    function menuLinkActions(e) {
        const menuLink = e.target;
        const menuLinkItem = menuLink.querySelector('.hover');
        const menuLinkText = menuLink.querySelector('.hover__text');
        let menuLinkSize, menuLinkPos;
        if (isHorizontal) {
            menuLinkSize = menuLink.offsetWidth / 2;
            menuLinkPos = e.pageX - (menuLink.getBoundingClientRect().left + scrollX);
        } else {
            menuLinkSize = menuLink.offsetHeight / 2;
            menuLinkPos = e.pageY - (menuLink.getBoundingClientRect().top + scrollY);
        }

        if (e.type === 'mouseenter') {
            menuLinkItem.style.cssText = menuLinkPos > menuLinkSize ? effectForward : effectBack;
            menuLinkText.style.cssText = menuLinkPos > menuLinkSize ? effectBack : effectForward;

            setTimeout(() => {
                menuLinkItem.style.cssText = effectHover + effectTransition;
                menuLinkText.style.cssText = effectHover + effectTransition;
            }, 5);
        }

        if (e.type === 'mouseleave') {
            menuLinkItem.style.cssText = menuLinkPos > menuLinkSize ? effectForward + effectTransition : effectBack + effectTransition;
            menuLinkText.style.cssText = menuLinkPos > menuLinkSize ? effectBack + effectTransition : effectForward + effectTransition;
        }
    }
}