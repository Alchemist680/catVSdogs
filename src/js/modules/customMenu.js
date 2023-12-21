//?Можно еще сделать это все более гибким, в объект передавать аргументы, которые будут определять, должы ли под меню открываться как щас при наведении, либо по клику, надо ли стилизовать открывание меню (в том числе делать его абсолютным). Также можно попробовать интегрировать сюда спойлерскую анмацию, она очень пригодится для моб адаптации. Я хотел также в св-ва выделить все повторяющиеся и можно и не повторяющиеся стили для удобной замены, это можно первым сделать.

//Импортирование 
//import CustomMenu from './modules/customMenu.js';
//Иницилизация
//const CustomMenuObject = new CustomMenu();

//Пример структуры
/* <div class='header__menu menu'>
    <div class='menu__icon'>
        <span></span>
    </div>
    <nav class='menu__body'>
        <ul class='menu__list' data-custom-menu-main-list>
            <li>
                <a href='#' class='menu__link' data-custom-menu-main-link>
                    About Us
                    <div class="menu__arrow icon-Vector" data-custom-menu-main-arrow></div>
                </a>
                <ul class="menu__sub-menu" data-custom-menu-sub-menu>
                    <li>
                        <a href="" class="menu__sub-link" data-custom-menu-sub-link>
                            sub-link 1.1
                            <div class="menu__arrow icon-Vector" data-custom-menu-main-arrow></div>
                        </a>
                        <ul class="menu__sub-sub-menu" data-custom-menu-sub-sub-menu>
                            <li><button class="menu__back-arrow icon-Vector"></button></li>
                            <li><a href="" class="menu__sub-link" data-custom-menu-sub-link>sub-link 2.1</a></li>
                            <li><a href="" class="menu__sub-link" data-custom-menu-sub-link>sub-link 2.3</a></li>
                        </ul>
                    </li>
                    <li><a href="" class="menu__sub-link" data-custom-menu-sub-link>sub-link 1.2</a></li>
                    <li><a href="" class="menu__sub-link" data-custom-menu-sub-link>sub-link 1.3</a></li>
                    <li><a href="" class="menu__sub-link" data-custom-menu-sub-link>sub-link 1.4</a></li>
                </ul>
            </li>
            <li><a href='' class='menu__link' data-custom-menu-main-link>Services</a></li>
            <li><a href='' class='menu__link' data-custom-menu-main-link>Our Blog</a></li>
            <li><a href='' class='menu__link' data-custom-menu-main-link>Contact </a></li>
        </ul>
    </nav>
</div> */

//Все дата атрибуты
// data-custom-menu-main-link - основная ссылка (по которой открываем первое под меню)
// data-custom-menu-main-arrow - основная стрелка(мы ее только для анимации берем)
// data-custom-menu-main-list - самый основной родительский список
// data-custom-menu-sub-link - все вложенные ссылки (и в под меню и в под под меню) для открытия следующего под меню, либо перехода куда-либо
// data-custom-menu-sub-menu - под меню (отличачается от под под меню тем, что его надо с анимацией выводить)
// data-custom-menu-sub-sub-menu - под под меню

export default class CustomMenu {

    zIndexSubMenu = 100;
    zIndexSubMenuCounter = 0;

    closeCustomMenu(parentSubSubMenu) {
        if (parentSubSubMenu) {

            if (parentSubSubMenu.hasAttribute("data-custom-menu-sub-menu")) {
                parentSubSubMenu.style.cssText = `
                    opacity: 0;
                    transform: translate(0, 20px);
                    pointer-events: none;
                    visibility: hidden;
                `;
            } else {
                parentSubSubMenu.style.cssText = `
                    opacity: 1;
                    visibility: hidden;
                `;
            }

            parentSubSubMenu.id = "";
            parentSubSubMenu.closest('[data-custom-menu-main-list]>li').querySelector('[data-custom-menu-main-arrow]').style.cssText = "transform: rotate(0deg);transition: transform 0.3s ease;";

            //убираем лишние индефикаторы у активных под-под-меню и скрываем их
            const activeSubSubMenu = parentSubSubMenu.querySelector("#active-sub-menu");
            if (activeSubSubMenu) {
                activeSubSubMenu.id = "";
                activeSubSubMenu.style.cssText = `
                        visibility: hidden;
                        opacity: 1;
                `;
            }
        }
    }

    constructor() {
        document.addEventListener('click', (e) => {
            const targetElement = e.target;

            //Если у нас нет курсора, то мы открываем первое под меню при клике на основную ссылку
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
                .test(navigator.userAgent)) {
                if (targetElement.closest('[data-custom-menu-main-link]')) {
                    /* const subMenuActive = document.querySelector("#active-first-sub-menu"); */
                    const parentSubSubMenu = document.querySelector("#parent-sub-menu");
                    const elementMenu = targetElement.closest('[data-custom-menu-main-list]>li');
                    const subMenu = elementMenu.querySelector('[data-custom-menu-sub-menu]');



                    this.closeCustomMenu(parentSubSubMenu);


                    //открытие либо закрытие под меню под нашей ссылкой, на которую нажали
                    if (subMenu) {
                        if (subMenu.id != "active-first-sub-menu") {
                            subMenu.id = "active-first-sub-menu";

                            subMenu.style.cssText = `
                            opacity: 1;
                            transform: translate(0, 0);
                            pointer-events: auto;
                            visibility: visible;
                            z-index: 100;
                        `;

                            elementMenu.querySelector('[data-custom-menu-main-arrow]').style.cssText = "transform: rotate(180deg); transition: transform 0.3s ease;";
                        } else {
                            subMenu.id = "";

                            subMenu.style.cssText = `
                            opacity: 0;
                            transform: translate(0, 20px);
                            pointer-events: none;
                            visibility: hidden;
                        `;

                            elementMenu.querySelector('[data-custom-menu-main-arrow]').style.cssText = "transform: rotate(0deg); transition: transform 0.3s ease;";
                        }
                    }

                    e.preventDefault();
                }
            }
            //если у нас не мобильная версия, то закрываем меню при наличии отрытого вложенного меню по клику на основную ссылку
            else {
                if (targetElement.closest('[data-custom-menu-main-link]')) {
                    const parentSubSubMenu = targetElement.closest('li').querySelector("#parent-sub-menu");

                    this.closeCustomMenu(parentSubSubMenu);

                    e.preventDefault();
                }
            }

            //закрывание меню при нажатии на нейтральную область
            if (!targetElement.closest('[data-custom-menu-main-list]>li')) {
                const parentSubSubMenu = document.querySelector("#parent-sub-menu");

                this.closeCustomMenu(parentSubSubMenu);
            }

            //открывание под-под-меню
            if (targetElement.closest('[data-custom-menu-sub-link]')) {
                const link = targetElement.closest('[data-custom-menu-sub-link]');
                const subSubMenu = link.nextElementSibling;
                //если родительское меню активного меню есть, убираем его  id
                const parentSubSubMenu = subSubMenu.closest("#parent-sub-menu");
                if (parentSubSubMenu) parentSubSubMenu.id = "";

                if (subSubMenu) {
                    //считаем сколько у нас есть на всей странице родительских активных под меню, тем самым опрдеделяя сколько у нас открытых под-меню
                    const openMenusLenght = document.querySelectorAll("#parent-sub-menu").length;
                    this.zIndexSubMenuCounter++;
                    this.zIndexSubMenu += openMenusLenght + this.zIndexSubMenuCounter;

                    //убираем саб меню и присваиваем нужный z-index
                    const subMenu = targetElement.closest('[data-custom-menu-sub-menu]');
                    if (subMenu) {
                        subMenu.style.cssText = `visibility: hidden; opacity: 1; pointer-events: auto; transform: translate(0, 0); z-index: ${this.zIndexSubMenu};`;
                    }

                    //если активное меню уже есть, то скрываем его (при чем прозрачность оставляем, иначе просто не будет видно дочернего меню)
                    const aciveSubSubMenu = subMenu.querySelector("#active-sub-menu");
                    if (aciveSubSubMenu) {
                        aciveSubSubMenu.style.cssText = `
                        visibility: hidden;
                        opacity: 1;
                    `;

                        aciveSubSubMenu.id = "parent-sub-menu";
                    } else {
                        subMenu ? subMenu.id = "parent-sub-menu" : null;
                    }

                    subSubMenu.style.cssText = `
                    opacity: 1;
                    visibility: visible;
                `;
                    subSubMenu.id = "active-sub-menu";

                    //возвращаем изначальное значение для z-index
                    this.zIndexSubMenu -= openMenusLenght + this.zIndexSubMenuCounter;
                    /* this.zIndexSubMenuCounter == 5 ? this.zIndexSubMenuCounter = 0 : null; */
                    e.preventDefault();
                }
            }

            //переход назад по вложенным меню
            if (targetElement.closest('.menu__back-arrow')) {
                const subSubMenu = targetElement.closest('[data-custom-menu-sub-sub-menu]');

                //родительское меню для меню, с которым мы работаем находим и показываем
                const parentSubSubMenu = subSubMenu.closest("#parent-sub-menu");
                if (parentSubSubMenu) {
                    parentSubSubMenu.style.cssText = `
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                    transform: translate(0px, 0px);
                `;

                    parentSubSubMenu.id = "active-sub-menu";

                    let newParentSubSubMenu = parentSubSubMenu.parentNode.closest('[data-custom-menu-sub-sub-menu]');
                    if (newParentSubSubMenu) {
                        newParentSubSubMenu.id = "parent-sub-menu";
                    } else {
                        newParentSubSubMenu = parentSubSubMenu.closest('[data-custom-menu-sub-menu]');
                        if (newParentSubSubMenu) {
                            newParentSubSubMenu.id = "parent-sub-menu";
                        }
                    }
                }

                //при возвращении назад обращаемся к меню, с которым щас работаем и скрываем его
                subSubMenu.style.cssText = `
                opacity: 0;
                visibility: hidden;
            `;
                subSubMenu.id = "";

                e.preventDefault();
            }
        });


        //обработчик наведения мыши на основные ссылки меню
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
            .test(navigator.userAgent)) {
            document.addEventListener("mouseover", e => {
                const targetElement = e.target;
                if (targetElement.closest("[data-custom-menu-main-list]>li")) {
                    const subMenu = targetElement.closest("[data-custom-menu-main-list]>li").querySelector("[data-custom-menu-sub-menu]");
                    if (subMenu) {
                        //проверка на наличие уже открытых под-под-меню (нам не надо показывать первое подменю, если уже отрыто одно из более вложенных)
                        const openMenusLenght = document.querySelectorAll("#parent-sub-menu").length;
                        this.zIndexSubMenuCounter++;
                        this.zIndexSubMenu += openMenusLenght + this.zIndexSubMenuCounter;
                        if (!subMenu.querySelector("#active-sub-menu")) {
                            subMenu.style.cssText = `
                        opacity: 1;
                        transform: translate(0, 0);
                        pointer-events: auto;
                        visibility: visible;
                        z-index: ${this.zIndexSubMenu};
                    `;
                            subMenu.id = "active-first-sub-menu";
                            this.zIndexSubMenu -= openMenusLenght + this.zIndexSubMenuCounter;

                            subMenu.closest('[data-custom-menu-main-list]>li').querySelector('[data-custom-menu-main-arrow]').style.cssText = "transform: rotate(180deg);transition: transform 0.3s ease;";
                        }
                    }
                }
                if (targetElement.closest("[data-custom-menu-sub-menu]")) {
                    const subMenu = targetElement.closest("[data-custom-menu-sub-menu]");

                    const openMenusLenght = document.querySelectorAll("#parent-sub-menu").length;
                    this.zIndexSubMenuCounter++;
                    this.zIndexSubMenu += openMenusLenght + this.zIndexSubMenuCounter;

                    if (subMenu.querySelector("#active-sub-menu")) {
                        subMenu.style.cssText = `
                    opacity: 1;
                    transform: translate(0, 0);
                    pointer-events: auto;
                    visibility: hidden;
                    z-index: ${this.zIndexSubMenu};
                `;
                    } else {
                        subMenu.style.cssText = `
                    opacity: 1;
                    transform: translate(0, 0);
                    pointer-events: auto;
                    visibility: visible;
                    z-index: ${this.zIndexSubMenu};
                `;
                    }

                    this.zIndexSubMenu -= openMenusLenght + this.zIndexSubMenuCounter;
                }
            });
        }

        //обработчик события покидания курсора мыши основных элементов меню. Если не открыто ни одно под-под-меню, то скрываем под-меню
        const mainLinksMenu = document.querySelectorAll("[data-custom-menu-main-list]>li");
        if (mainLinksMenu.length) {
            mainLinksMenu.forEach(link => {
                link.addEventListener("mouseleave", () => {
                    if (!link.querySelector("#active-sub-menu")) {
                        const subMenu = link.querySelector("[data-custom-menu-sub-menu]");
                        if (subMenu) {
                            subMenu.style.cssText = `
                            opacity: 0;
                            transform: translate(0, 20px);
                            pointer-events: none;
                            visibility: hidden;
                            transition: 0.3s all ease;
                        `;
                            subMenu.id = "";

                            subMenu.closest('[data-custom-menu-main-list]>li').querySelector('[data-custom-menu-main-arrow]').style.cssText = "transform: rotate(0deg);transition: transform 0.3s ease;";
                        }
                    }

                });
            });
        }

    }


}