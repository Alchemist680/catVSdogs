"use strict";

//?Импорт кастомного открывания картинок (снипет doi)
//import customOpenImage from './modules/customOpenImage.js';
//?Импор Свайпера (снипет swp)
//import Swiper from 'swiper';
//import { Navigation, Pagination } from 'swiper/modules';


//?Основные скрипты (делегирование, шапка)
//import { delegationClick } from './modules/script.js';
//?Для открытия, закрытия бургера обязательно добавить эту ф-ию (только импортировать, запускать не надо)
//import { closeMenu } from './modules/script.js';
 

//?Функция определения мобильного устройства
//import { isMobile } from "./modules/functions";
//?Импортирование плавного скролла
//import "./modules/smoothScroll.js"
//?Галерея FancyBox
//import { Fancybox } from "@fancyapps/ui";
//import "@fancyapps/ui/dist/fancybox/fancybox.css";
//Fancybox.bind("[data-gallery]", {});
//<a href="img/3.jfif" data-fancybox="gallery" data-caption="Природа" class="block__item"><img src="img/3.jfif" alt="Природа"></a>

//?Динамический адаптив (  useDynamicAdapt()  )
//import { useDynamicAdapt } from './modules/dynamic.js'


window.addEventListener("load", windowLoad);
function windowLoad() {
    
    //Главный персонаж
    const hero = document.querySelector("#hero");
    //Картинка главного персонажа
    const heroImg = document.querySelector("#mainHeroes");

    //Позиции для главного персонажа
    let leftPosMainHero = 0;
    let translateMainHero = 5;

    let animation;

    //Обработчик нажатия на клавишу
    document.addEventListener("keydown", (e) => {
        const keyPressed = e.key;
        
        if (keyPressed === "d") {
            if (!animation) {
                animation = setInterval(() => {
                    rightHandler();
                }, 50);
            }
         
        }
        if (keyPressed === "a") {
            if (!animation) {
                animation = setInterval(() => {
                    leftHandler();
                }, 50);
            }
        }
    });
    //Обработчик опускания клавиши
    document.addEventListener("keyup", (e) => {
        clearInterval(animation);
        animation = null;
    });

    //ФУнкция передвижения главного героя вправо
    function rightHandler() {
        leftPosMainHero <= -96 ? leftPosMainHero = 0 : leftPosMainHero -= 32;
        translateMainHero >= 10 ? null : translateMainHero += 1;

        hero.style.left = translateMainHero + "%";
        heroImg.style.transform = "scale(1, 1)";
        heroImg.style.left = leftPosMainHero + "px";
    }
    function leftHandler() {
        leftPosMainHero >= 0 ? leftPosMainHero = -96 : leftPosMainHero += 32;
        translateMainHero <= 5 ? null : translateMainHero -= 1;

        hero.style.left = translateMainHero + "%";
        heroImg.style.transform = "scale(-1, 1)";
        heroImg.style.left = leftPosMainHero + "px";
    }


}