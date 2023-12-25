"use strict";

window.addEventListener("load", windowLoad);
function windowLoad() {

    const game = document.querySelector("#game");

    class Heart {
        img;
        x;
        src = "img/icons/heart.svg";
        block;
        blockSize = 32;
        maxPosXSprite = 4;

        generateHearts(x, y) {
            this.block = document.createElement('div');
            this.block.classList.add("active");
            this.block.id = "heart";
            this.block.style.cssText = `
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
                position: absolute;
                overflow: hidden;
                top: ${y * 32}px;
                left: ${x * 32}px;
            `;
            this.img = document.createElement('img');
            this.img.src = this.src;
            this.img.style.cssText = `
                width: ${this.blockSize * this.maxPosXSprite}px;
                height: ${this.block}px;
                position: absolute;
                top: 0px;
                left: 0px;
            `;

            game.appendChild(this.block);
            this.block.appendChild(this.img);
        }
    }
    const hearts = new Heart();
    function killHeart() {
        const allHearts = document.querySelectorAll("#heart.active");
        if (allHearts.length) {
            const currentHeart = allHearts[allHearts.length - 1];
            currentHeart.classList.remove("active");
            const img = currentHeart.querySelector("img");
            let posXSprite = 0;

            const animationHeart = setInterval(() => {
                if (posXSprite <= 3) {
                    img.style.left = -posXSprite * 32 + "px";
                    posXSprite++;
                } else {
                    clearInterval(animationHeart);
                }
            }, 100);
        }
    }

    //Главный персонаж
    const hero = document.querySelector("#hero");
    //Картинка главного персонажа
    const heroImg = document.querySelector("#mainHeroes");

    let lives = 5;

    //Позиции для главного персонажа
    let leftPosMainHero = 0;
    let translateMainHero = 32;
    let topMainHero = 0;

    const heroBlockSize = 96;
    let MaxBlocksXHero = 7;

    /* let isStandMainHero = true;
    let hit = false;
    let jump = false;
    let fall = false; */
    let state = "stand";

    //В какую сторону повернут кот
    let direction = "right";
    //переменная для анимации
    let animation;
    let animationSome;
    let animateWasChanged = true;

    let heroX = Math.ceil(Number.parseInt(getComputedStyle(hero).left) / 32);
    let heroY = Math.ceil(Number.parseInt(getComputedStyle(hero).bottom) / 32);

    let isFalling = false;

    const heightJump = 150;


    //для карты переменные
    let tileArray = [];

    //Функция для иземенеия состояния персонажа
    function changeAnimate(stateStr) {
        clearInterval(animation);
        clearInterval(animationSome);
        animation = null;
        animationSome = null;
        animateWasChanged = true;
        state = stateStr;
    }

    //Обработчик нажатия на клавишу
    document.addEventListener("keydown", (e) => {
        const keyPressed = e.code;

        if (keyPressed === "KeyD" || keyPressed === "ArrowRight") {
            if (state != "rightWalk" && state != "fall") {
                changeAnimate("rightWalk");
                rightHandler();
            }

        }
        if (keyPressed === "KeyA" || keyPressed === "ArrowLeft") {
            if (state != "leftWalk" && state != "fall") {
                changeAnimate("leftWalk");
                leftHandler();
            }
        }

        if (keyPressed === "KeyF") {
            if (state != "jump" && state != "fall" && state != "hit") {
                changeAnimate("hit");
                hitHandler();
            }

        }
        if (keyPressed === "KeyW" || keyPressed === "Space" || keyPressed === "ArrowUp") {
            if (state != "jump" && state != "fall") {
                changeAnimate("jump");
                jumpHandler();
            }
        }
    });
    //Обработчик опускания клавиши
    document.addEventListener("keyup", (e) => {
        if (state != "fall" && state != "jump" && state != "hit")
            changeAnimate("stand");
    });

    //ФУнкция передвижения главного героя вправо
    function rightHandler() {

        heroImg.style.top = "0px";
        heroImg.style.transform = "scale(1, 1)";
        direction = "right";

        animation = setInterval(() => {
            leftPosMainHero <= -heroBlockSize * (MaxBlocksXHero - 1) ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
            heroImg.style.left = leftPosMainHero + "px";
        }, 60);

        animationSome = setInterval(() => {
            translateMainHero >= 2000 ? null : translateMainHero += 3;
            hero.style.left = translateMainHero + "px";

            checkFalling();
            if (isFalling)
                changeAnimate("fall");
        }, 17);

    }
    //передвижение влево
    function leftHandler() {

        heroImg.style.top = "0px";
        heroImg.style.transform = "scale(-1, 1)";
        direction = "left";

        animation = setInterval(() => {
            leftPosMainHero >= 0 ? leftPosMainHero = -heroBlockSize * (MaxBlocksXHero - 1) : leftPosMainHero += heroBlockSize;

            heroImg.style.left = leftPosMainHero + "px";
        }, 60);

        animationSome = setInterval(() => {
            hero.style.left = translateMainHero + "px";
            translateMainHero <= 32 ? null : translateMainHero -= 3;

            checkFalling();
            if (isFalling)
                changeAnimate("fall");
        }, 17);
    }
    //анимация стоянки
    function standHanlder() {
        animation = setInterval(() => {
            if (direction === "right") {
                leftPosMainHero <= -heroBlockSize ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
                heroImg.style.transform = "scale(1, 1)";
            } else {
                leftPosMainHero >= -((MaxBlocksXHero - 1) * heroBlockSize - heroBlockSize) ? leftPosMainHero = -(MaxBlocksXHero - 1) * heroBlockSize : leftPosMainHero += heroBlockSize;
                heroImg.style.transform = "scale(-1, 1)";
            }

            heroImg.style.top = "-" + heroBlockSize + "px";
            heroImg.style.left = leftPosMainHero + "px";
        }, 100);
    }
    //Удар
    function hitHandler() {
        heroImg.style.top = -heroBlockSize * 3 + "px";
        if (direction === "right") {
            heroImg.style.transform = "scale(1, 1)";
            heroImg.style.left = "0px";
            leftPosMainHero = 0;

            animation = setInterval(() => {
                if (leftPosMainHero <= -heroBlockSize * 5) {
                    changeAnimate("stand");
                } else {
                    leftPosMainHero -= heroBlockSize;
                    heroImg.style.left = leftPosMainHero + "px";
                }
            }, 150);

        } else {
            heroImg.style.transform = "scale(-1, 1)";
            heroImg.style.left = -(MaxBlocksXHero * heroBlockSize - 6 * heroBlockSize) + "px";
            leftPosMainHero = -(MaxBlocksXHero * heroBlockSize - 6 * heroBlockSize);

            animation = setInterval(() => {
                if (leftPosMainHero <= -(MaxBlocksXHero - 1) * heroBlockSize) {
                    changeAnimate("stand");
                } else {
                    leftPosMainHero -= heroBlockSize;
                    heroImg.style.left = leftPosMainHero + "px";
                }
            }, 150);
        }



    }
    //Прыжок
    function jumpHandler() {
        const startPosY = topMainHero;
        topMainHero = heroY * 32;

        //картинка прышка
        heroImg.style.top = -heroBlockSize * 2 + "px";
        animationSome = setInterval(() => {
            if (direction === "right") {
                leftPosMainHero <= -heroBlockSize * 4 ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
                heroImg.style.transform = "scale(1, 1)";
            } else {
                leftPosMainHero >= -(MaxBlocksXHero - heroBlockSize * 4) ? leftPosMainHero = -heroBlockSize * MaxBlocksXHero : leftPosMainHero += heroBlockSize;
                heroImg.style.transform = "scale(-1, 1)";
            }

            heroImg.style.left = leftPosMainHero + "px";
        }, heightJump / 10 * 17 / 4);

        //передвижение персонажа
        animation = setInterval(() => {
            topMainHero += 10;
            if (topMainHero - startPosY > heightJump) {
                checkFalling();
                if (isFalling) {
                    changeAnimate("fall");
                }
                else changeAnimate("stand");
            }

            if (direction === "right") {
                translateMainHero += 10;
                hero.style.left = translateMainHero + "px";
            } else {
                translateMainHero -= 10;
                hero.style.left = translateMainHero + "px";
            }
            hero.style.bottom = topMainHero + "px";
        }, 17);
    }
    function fallHandler() {

        heroImg.style.top = -(heroBlockSize * 2) + "px";
        if (direction === "right") {
            leftPosMainHero = -(heroBlockSize * 2);
            heroImg.style.transform = "scale(1, 1)";
        } else {
            leftPosMainHero = -(heroBlockSize * 3);
            heroImg.style.transform = "scale(-1, 1)";
        }


        animation = setInterval(() => {
            topMainHero -= 3;
            hero.style.bottom = topMainHero + "px";
            checkFalling();
            if (!isFalling) {
                hero.style.bottom = `${heroY * 32}px`;
                changeAnimate("stand");
            }
        }, 17);


        heroImg.style.left = leftPosMainHero + "px";


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
            if (animateWasChanged) {
                animateWasChanged = false;
                if (state === "fall") {
                    fallHandler();
                    /*   } else if (state === "jump") {
                          jumpHandler(); */
                    /*  } else if (state === "hitt") {
                         hitHandler(); */
                } else if (state === "stand") {
                    standHanlder();
                }
            }
        }, 100);
    }

    function start() {

        lifeCycle();

        for (let i = 0; i < 100; i++) {
            if (i > 10 && i < 12) continue;
            addTiles(i);
        }

        createTilesPlatform(10, 6, 15);
        createTilesPlatform(34, 2, 5);

        new Enemy(25, 2);

        for (let index = 0.5; index < lives + 0.5; index++) {
            hearts.generateHearts(index, 0.5);
        }

    }

    //Класс для генерации врага
    class Enemy {

        STAND = "stand";
        ATTACK = "attack";
        DEATH = "death";
        WALK = "walk";
        HURT = "hurt";

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
        attack = false;
        animateWasChanged = true;

        SpriteMaxPosX = 6;
        SpriteMaxPosY = 5;
        SpritePosX = 0;
        SpritePosY = 0;

        NumPosStand = 2;
        NumPosHurt = 1;
        NumPosWalk = 5;
        NumPosAttack = 3;
        NUmPosDeath = 6;

        lives = 2;

        constructor(x, y) {
            this.posX = x;
            this.posY = y;
            this.startX = this.posX;

            this.createEnimy();

            //this.changeAnimate(this.WALK);
            this.lifeCycle();

            this.changeAnimate(this.WALK);
            /* setInterval(() => {
                if (this.state === this.STAND)
                    this.changeAnimate(this.WALK);
                else if (this.state === this.WALK)
                    this.changeAnimate(this.STAND);
            }, 3000); */
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

                this.checkCollide();

                if (this.animateWasChanged) {
                    this.animateWasChanged = false;
                    switch (this.state) {
                        case this.DEATH:
                            this.deathAnimate();
                            break;
                        case this.HURT:
                            this.hurtAnimate();
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

        //Проверка столкновения с героем
        checkCollide() {
            if (heroY == this.posY) {
                if (heroX == Math.floor(this.posX)) {
                    if (state === "hit" && this.state != this.HURT) {
                        this.changeAnimate(this.HURT);
                        lives--;
                        if (lives <= 0) this.changeAnimate(this.DEATH);
                    } else if (!this.attack) {
                        this.changeAnimate(this.ATTACK);
                    }
                } else if (heroX == Math.floor(this.posX + 2) || heroX == Math.floor(this.posX + 1)) {
                    if (state === "hit" && this.state != this.HURT) {
                        this.changeAnimate(this.HURT);
                        lives--;
                        if (lives <= 0) this.changeAnimate(this.DEATH);
                    } else if (!this.attack) {
                        this.changeAnimate(this.ATTACK);
                    }
                } else if (this.state === this.ATTACK) {
                    this.changeAnimate(this.WALK);
                    this.attack = false;
                }
            } else if (this.state === this.ATTACK) {
                this.changeAnimate(this.WALK);
                this.attack = false;
            }
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
            this.img.style.top = "0px";
            this.img.style.left = "0px";
            this.SpritePosX = 1;
            this.animation = setInterval(() => {

                if (this.direction === Math.abs(this.direction)) {
                    this.img.style.transform = "scale(-1, 1)";

                    if (-this.SpritePosX * this.blockSize >= (-(this.SpriteMaxPosX - 1 - this.NumPosStand) * this.blockSize)) {
                        this.SpritePosX = this.SpriteMaxPosX;
                    } else {
                        this.SpritePosX--;
                        this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                    }
                } else {
                    this.img.style.transform = "scale(1, 1)";

                    this.SpritePosX === this.NumPosStand ? this.SpritePosX = 0 : this.SpritePosX++;
                    this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                }
            }, 100);
        }

        walkAnimate() {
            this.img.style.top = -this.blockSize * 4 + "px";
            this.img.style.left = "0px";
            this.SpritePosX = 1;
            this.animationSome = setInterval(() => {
                if (this.posX > this.startX + this.travelInterval) {
                    this.direction *= -1;
                    this.img.style.transform = "scale(1, 1)";
                }
                else if (this.posX <= this.startX) {
                    this.direction = Math.abs(this.direction);
                    this.img.style.transform = "scale(-1, 1)";
                }

                this.posX += this.direction;
                this.block.style.left = this.posX * 32 + "px";
            }, 17);
            this.animation = setInterval(() => {
                this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                this.SpritePosX === this.NumPosWalk ? this.SpritePosX = 0 : this.SpritePosX++;
            }, 100);
        }

        attackAnimate() {
            this.attack = true;
            this.img.style.top = this.blockSize * -2 + "px";
            this.img.style.left = "0px";

            this.SpritePosX = 0;

            this.animation = setInterval(() => {
                if (this.direction === Math.abs(this.direction)) {
                    this.img.style.transform = "scale(-1, 1)";

                    if (-this.SpritePosX * this.blockSize >= (-(this.SpriteMaxPosX - 1 - this.NumPosAttack) * this.blockSize)) {
                        this.SpritePosX = this.SpriteMaxPosX;

                        lives--;
                        killHeart();
                    } else {
                        this.SpritePosX--;
                        this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                    }
                } else {
                    this.img.style.transform = "scale(1, 1)";
                    if (this.SpritePosX >= this.NumPosAttack) {
                        this.SpritePosX = 0;

                        lives--;
                        killHeart();
                    } else {
                        this.SpritePosX++;
                        this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                    }
                }

            }, 150);
        }

        deathAnimate() {
            this.img.style.top = -1 * this.blockSize + "px";

            //если повернут влево(по умолчанию)
            if (this.direction === Math.abs(this.direction)) {
                this.img.style.transform = "scale(-1, 1)";
                this.img.style.left = -(this.maxPosXSprite - this.NUmPosDeath * this.blockSize) + "px";
                this.posXSprite = this.maxPosXSprite - this.NUmPosDeath;

                animation = setInterval(() => {
                    if (this.posXSprite >= this.maxPosXSprite) {
                        //смерть
                        //this.block.style.display = "none";
                        clearInterval(animation);
                        this.changeAnimate(this.STAND);
                    } else {
                        this.img.style.left = -this.maxPosXSprite * this.blockSize + "px";
                        this.posXSprite++;
                    }
                }, 300);

                //если повернут вправо
            } else {
                this.img.style.transform = "scale(1, 1)";
                this.img.style.left = "0px";
                this.posXSprite = 0;

                animation = setInterval(() => {
                    if (this.posXSprite >= this.NUmPosDeath) {
                        //смерть
                        //this.block.style.display = "none";
                        clearInterval(animation);
                        this.changeAnimate(this.STAND);
                    } else {
                        this.img.style.left = this.posXSprite * this.blockSize + "px";
                        this.posXSprite++;
                    }
                }, 300);
            }
        }

        hurtAnimate() {
            this.img.style.top = -3 * this.blockSize + "px";
            if (this.direction === Math.abs(this.direction)) {
                this.img.style.transform = "scale(-1, 1)";
                this.img.style.left = -(this.maxPosXSprite - this.NumPosHurt) * this.blockSize + "px";
            } else {
                this.img.style.transform = "scale(1, 1)";
                this.img.style.left = -this.NumPosHurt * this.blockSize + "px";
            }

            setTimeout(() => {
                this.changeAnimate(this.ATTACK);
            }, 300);

        }
    }




    start();
}