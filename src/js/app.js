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

    //Стоит ли кот
    let isStandMainHero = false;
    let isHit = false;
    //В какую сторону повернут кот
    let direction = "right";
    //переменная для анимации
    let animation;

    //Обработчик нажатия на клавишу
    document.addEventListener("keydown", (e) => {
        const keyPressed = e.code;

        if (keyPressed === "KeyD" || keyPressed === "ArrowRight") {

            if (isStandMainHero) {
                clearInterval(animation);
                animation = null;
                isStandMainHero = false;
            }

            if (!animation) {
                animation = setInterval(() => {
                    rightHandler();
                }, 50);
            }

        }
        if (keyPressed === "KeyA" || keyPressed === "ArrowLeft") {

            if (isStandMainHero) {
                clearInterval(animation);
                animation = null;
                isStandMainHero = false;
            }

            if (!animation) {
                animation = setInterval(() => {
                    leftHandler();
                }, 50);
            }

        }

        if (keyPressed === "KeyF") {

            if (isStandMainHero) {
                clearInterval(animation);
                animation = null;
                isStandMainHero = false;
            }

            if (!animation) {
                let counter = 0;
                animation = setInterval(() => {
                    counter++;
                    console.log(counter);
                    hitHandler();
                    if (counter == 3) {
                        clearInterval(animation);
                        animation = null;
                        isHit = false;
                    }
                }, 200);
            }

        }
    });
    //Обработчик опускания клавиши
    document.addEventListener("keyup", (e) => {
        clearInterval(animation);
        //animation = null;
        isStandMainHero = true;

        if (!isHit) {
            animation = setInterval(() => {
                standHanlder();
            }, 100);
        }
      
    });

    //ФУнкция передвижения главного героя вправо
    function rightHandler() {
        leftPosMainHero <= -192 ? leftPosMainHero = 0 : leftPosMainHero -= 32;
        translateMainHero >= 12 ? null : translateMainHero += 1;

        hero.style.left = translateMainHero + "%";

        heroImg.style.top = "0px";
        heroImg.style.transform = "scale(1, 1)";
        heroImg.style.left = leftPosMainHero + "px";

        direction = "right";
    }
    //передвижение влево
    function leftHandler() {
        leftPosMainHero >= 0 ? leftPosMainHero = -192 : leftPosMainHero += 32;
        translateMainHero <= 5 ? null : translateMainHero -= 1;

        hero.style.left = translateMainHero + "%";

        heroImg.style.top = "0px";
        heroImg.style.transform = "scale(-1, 1)";
        heroImg.style.left = leftPosMainHero + "px";

        direction = "left";
    }
    //анимация стоянки
    function standHanlder() {
        if (direction === "right") {
            leftPosMainHero <= -32 ? leftPosMainHero = 0 : leftPosMainHero -= 32;
            heroImg.style.transform = "scale(1, 1)";
        } else {
            leftPosMainHero >= -160 ? leftPosMainHero = -192 : leftPosMainHero += 32;
            heroImg.style.transform = "scale(-1, 1)";
        }

        heroImg.style.top = "-32px";
        heroImg.style.left = leftPosMainHero + "px";
    }
    //Удар
    function hitHandler() {

        /* heroImg.style.transform = "scale(1, 1)";
        heroImg.style.top = "-32px";
        leftPosMainHero -= 0;
        heroImg.style.left = "0px";
        isHit = true;
        
        animation = setTimeout(() => {
            leftPosMainHero -= 32;
            console.log(leftPosMainHero);
            heroImg.style.left = leftPosMainHero + "px";

            if (leftPosMainHero <= -96) {
                clearInterval(animation);
                animation = null;
                isHit = false;
            }
        }, 200); */


        if (direction === "right") {
            leftPosMainHero <= -32 ? leftPosMainHero = 0 : leftPosMainHero -= 32;
            heroImg.style.transform = "scale(1, 1)";
        } else {
            leftPosMainHero >= -160 ? leftPosMainHero = -192 : leftPosMainHero += 32;
            heroImg.style.transform = "scale(-1, 1)";
        }

        heroImg.style.top = "-0px";
        heroImg.style.left = leftPosMainHero + "px";

        isHit = true;


    }


    function start() {
        animation = setInterval(() => {
            standHanlder();
        }, 100);
        isStandMainHero = true;
    }
    start();
}