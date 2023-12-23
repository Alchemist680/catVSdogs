"use strict";

window.addEventListener("load", windowLoad);
function windowLoad() {

    const game = document.querySelector("#game");

    //Главный персонаж
    const hero = document.querySelector("#hero");
    //Картинка главного персонажа
    const heroImg = document.querySelector("#mainHeroes");

    //Позиции для главного персонажа
    let leftPosMainHero = 0;
    let translateMainHero = 32;
    let topMainHero = 0;

    let heroBlockSize = 96;
    let MaxBlocksXHero = 7;

    //Стоит ли кот
    let isStandMainHero = false;
    let hit = false;
    let jump = false;
    let fall = false;
    //В какую сторону повернут кот
    let direction = "right";
    //переменная для анимации
    let animation;

    let heroX = Math.ceil(Number.parseInt(getComputedStyle(hero).left) / 32);
    let heroY = Math.ceil(Number.parseInt(getComputedStyle(hero).bottom) / 32);

    let isFalling = false;


    //для карты переменные
    let tileArray = [];

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
                }, 100);
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
                }, 100);
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
                    hitHandler();
                    if (counter == 3) {
                        clearInterval(animation);
                        animation = null;
                        isHit = false;
                    }
                }, 200);
            }

        }
        if (keyPressed === "KeyW" || keyPressed === "Space" || keyPressed === "ArrowTop") {
            jumpHandler();
        }
    });
    //Обработчик опускания клавиши
    document.addEventListener("keyup", (e) => {
        clearInterval(animation);
        //animation = null;
        isStandMainHero = true;

        //lifeCycle();

    });

    //ФУнкция передвижения главного героя вправо
    function rightHandler() {
        leftPosMainHero <= -heroBlockSize * (MaxBlocksXHero - 1) ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
        translateMainHero >= 900 ? null : translateMainHero += 30;

        hero.style.left = translateMainHero + "px";

        heroImg.style.top = "0px";
        heroImg.style.transform = "scale(1, 1)";
        heroImg.style.left = leftPosMainHero + "px";

        direction = "right";

        checkFalling();
        if (isFalling)
            fall = true;
        else fall = false;
    }
    //передвижение влево
    function leftHandler() {
        leftPosMainHero >= 0 ? leftPosMainHero = -heroBlockSize * (MaxBlocksXHero - 1) : leftPosMainHero += heroBlockSize;
        translateMainHero <= 32 ? null : translateMainHero -= 30;

        hero.style.left = translateMainHero + "px";

        heroImg.style.top = "0px";
        heroImg.style.transform = "scale(-1, 1)";
        heroImg.style.left = leftPosMainHero + "px";

        direction = "left";

        checkFalling();
        if (isFalling)
            fall = true;
        else fall = false;
    }
    //анимация стоянки
    function standHanlder() {
        if (direction === "right") {
            leftPosMainHero <= -heroBlockSize ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
            heroImg.style.transform = "scale(1, 1)";
        } else {
            leftPosMainHero >= -((MaxBlocksXHero - 1) * heroBlockSize - heroBlockSize) ? leftPosMainHero = -(MaxBlocksXHero - 1) * heroBlockSize : leftPosMainHero += heroBlockSize;
            heroImg.style.transform = "scale(-1, 1)";
        }
        heroImg.style.top = "-" + heroBlockSize + "px";
        heroImg.style.left = leftPosMainHero + "px";

        isStandMainHero = true;
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
    //Прыжок
    function jumpHandler() {

        topMainHero += 196;

        if (direction === "right") {
            translateMainHero += 250;
            hero.style.left = translateMainHero + "px";
        } else {
            translateMainHero -= 250;
            hero.style.left = translateMainHero + "px";
        }

        hero.style.bottom = topMainHero + "px";

        checkFalling();
        if (isFalling)
            fall = true;
        else fall = false;
        //console.log(isFalling);
    }
    function fallHandler() {
        topMainHero -= 15;
        hero.style.bottom = topMainHero + "px";

        if (direction === "right") {
            leftPosMainHero = -(heroBlockSize * 2);
            heroImg.style.transform = "scale(1, 1)";
        } else {
            leftPosMainHero = -(heroBlockSize * 3);
            heroImg.style.transform = "scale(-1, 1)";
        }
        heroImg.style.top = -(heroBlockSize * 2) + "px";
        heroImg.style.left = leftPosMainHero + "px";

        checkFalling();
        if (isFalling)
            fall = true;
        else {
            fall = false;
            hero.style.bottom = `${heroY * 32}px`;
        }
    }


    function createTile(x, y = 1) {
        const tile = document.createElement("img");
        tile.src = "img/tiles/main.svg";
        tile.style.cssText = `
            position: absolute;
            left: ${x * 32}px;
            bottom: ${y * 32}px;
            width: 32px;
            height: 32px;
        `;
        game.appendChild(tile);

        tileArray.push([x, y]);
    }
    function addTiles(i) {
        createTile(i);

        const tileBottom = document.createElement("img");
        tileBottom.src = "img/tiles/foundation.svg";
        tileBottom.style.cssText = `
            position: absolute;
            left: ${i * 32}px;
            bottom: 0;
            width: 32px;
            height: 32px;
        `;
        game.appendChild(tileBottom);
    }
    function createTilesPlatform(startX, startY, lenght) {
        for (let i = 0; i < lenght; i++) {
            createTile(startX + i, startY);
        }
    }

    function updateHeroXY() {
        heroX = Math.ceil(Number.parseInt(getComputedStyle(hero).left) / 32);
        heroY = Math.ceil(Number.parseInt(getComputedStyle(hero).bottom) / 32);
    }


    function checkFalling() {
        updateHeroXY();
        isFalling = true;
        for (let i = 0; i < tileArray.length; i++) {
            if (tileArray[i][0] === heroX && tileArray[i][1] + 1 === heroY) {
                isFalling = false;
                break;
            }
        }
    }

    function lifeCycle() {
        setInterval(() => {
            if (hit) {
                hitHandler();
            } else if (jump) {
                jumpHandler();
            } else if (fall) {
                fallHandler();
            } else {
                standHanlder();
            }
        }, 100);
    }

    function start() {

        lifeCycle();

        for (let i = 0; i < 100; i++) {
            if (i > 10 && i < 16) continue;
            addTiles(i);
        }

        createTilesPlatform(10, 10, 15);

        new Enemy(25, 2);
    }

    //Класс для генерации врага
    class Enemy {

        STAND = "stand";
        ATTACK = "attack";
        DEATH = "death";
        WALK = "walk";

        posX;
        posY;
        startX;
        travelInterval = 6;
        direction = .1;
        img;
        block;
        blockSize = 96;
        timer;
        animation;
        animationSome;
        state = "stand";
        animateWasChanged = true;

        SpriteMaxPosX = 3;
        SpriteMaxPosY = 1;
        SpritePosX = 0;
        SpritePosY = 0;

        NumPosStand = 2;
        NumPosAttack = 1;
        NUmPosDeath = 6;

        constructor(x, y) {
            this.posX = x;
            this.posY = y;
            this.startX = this.posX;

            this.createEnimy();

            this.changeAnimate(this.WALK);
            this.lifeCycle();
        }

        createEnimy() {
            this.block = document.createElement('div');
            this.block.style.cssText = `
                position: absolute;
                left: ${this.posX * 32}px;
                bottom: ${this.posY * 32}px;
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
                overflow: hidden;
            `;
            game.appendChild(this.block);

            this.img = document.createElement("img");
            this.img.src = "img/characters/enemies/StandDog.svg";
            this.img.style.cssText = `
                position: absolute;
                left: 0;
                bottom: 0;
                width: ${this.blockSize * this.SpriteMaxPosX}px;
                height: ${this.blockSize * this.SpriteMaxPosY}px;
            `;
            this.block.appendChild(this.img);
        }

        lifeCycle() {
            this.timer = setInterval(() => {
                //this.move();
                if (this.animateWasChanged) {
                    this.animateWasChanged = false;
                    switch (this.state) {
                        case this.DEATH:
                            this.deathAnimate();
                            break;
                        case this.WALK:
                            this.walkAnimate();
                            break;
                        case this.STAND:
                            this.standAnimate();
                            break;
                        case this.ATTACK:
                            this.attackAnimate();
                            break;
                        case this.DEATH:
                            this.deathAnimate();
                            break;
                        default:
                            break;
                    }
                }
            }, 100);
        }

        changeAnimate(stateStr) {
            clearInterval(this.animation);
            this.animation = null;
            clearInterval(this.animationSome);
            this.animationSome = null;

            this.state = stateStr;
            this.animateWasChanged = true;
        }
        
        standAnimate() {
            this.animation = setInterval(() => {
                this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                this.SpritePosX === this.NumPosStand ? this.SpritePosX = 0 : this.SpritePosX++;
            }, 100);
        }

        walkAnimate() {
            this.animationSome = setInterval(() => {
                this.move();
            }, 17);
            this.animation = setInterval(() => {
                this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                this.SpritePosX === this.NumPosStand ? this.SpritePosX = 0 : this.SpritePosX++;
            }, 100);
        }
        move() {
            if (this.posX > this.startX + this.travelInterval) {
                this.direction *= -1;
                this.img.style.transform = "scale(-1, 1)";
            }
            else if (this.posX <= this.startX) {
                this.direction = Math.abs(this.direction);
                this.img.style.transform = "scale(1, 1)";
            }

            this.posX += this.direction;
            this.block.style.left = this.posX * 32 + "px";
        }

        attackAnimate() {
            this.animation = setInterval(() => {
                this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                this.SpritePosX === this.NumPosAttack ? this.SpritePosX = 0 : this.SpritePosX++;
            }, 100);
        }

        deathAnimate() {
            this.animation = setInterval(() => {
                this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                this.SpritePosX === this.NUmPosDeath ? this.SpritePosX = 0 : this.SpritePosX++;
            }, 100);
        }
    }


    start();
}