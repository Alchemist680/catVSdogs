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

    //Скорость передвижения (3 пикселя каждые 17 мс => 180пикс в секунду)
    let speed = 8;

    //Позиции для главного персонажа
    let leftPosMainHero = 0;
    let translateMainHero = 64;
    let topMainHero = 0;

    const heroBlockSize = 96;
    let MaxBlocksXHero = 7;

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

    let heightJump = 150;

    //для блокировок ходьбы персонажа в какую-либо сторону при получении урона
    let isRightSideBlocked = false;
    let isLeftSideBlocked = false;


    //для карты переменные
    let tileArray = [];
    let AllEnemy = [];
    let allObjects = document.createElement("div");
    allObjects.style.cssText = `
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    `;
    game.appendChild(allObjects);

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
            if (!isRightSideBlocked) {
                if (state != "rightWalk" && state != "fall" && state != "hurt") {
                    changeAnimate("rightWalk");
                    rightHandler();
                }
            }
        }
        if (keyPressed === "KeyA" || keyPressed === "ArrowLeft") {
            if (!isLeftSideBlocked) {
                if (state != "leftWalk" && state != "fall" && state != "hurt") {
                    changeAnimate("leftWalk");
                    leftHandler();
                }
            }
        }

        if (keyPressed === "KeyF") {
            if (state != "jump" && state != "fall" && state != "hit" && state != "hurt") {
                changeAnimate("hit");
                hitHandler();
            }

        }
        if (keyPressed === "KeyW" || keyPressed === "Space" || keyPressed === "ArrowUp") {
            if (state != "jump" && state != "fall" && state != "hurt") {
                changeAnimate("jump");
                jumpHandler();
            }
        }
    });
    //Обработчик опускания клавиши
    document.addEventListener("keyup", (e) => {
        if (state != "fall" && state != "jump" && state != "hit" && state != "hurt")
            changeAnimate("stand");
    });


    //передвижение мира
    function moveWorldRight() {
        allObjects.style.left = Number.parseInt(allObjects.style.left) - speed + "px";
        tileArray.map((elem) => {
            elem[0] = elem[0] - 1 / (32 / speed);
        });
        AllEnemy.map((elem) => {
            elem.moveRight();
        });
    }
    function moveWorldLeft() {
        allObjects.style.left = Number.parseInt(allObjects.style.left) + speed + "px";
        tileArray.map((elem) => {
            elem[0] = elem[0] + 1 / (32 / speed);
        });
        AllEnemy.map((elem) => {
            elem.moveLeft();
        });
    }


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
            if (checkAhead()) {
                /* translateMainHero >= 2000 ? null : translateMainHero += speed;
                hero.style.left = translateMainHero + "px"; */

                moveWorldRight();

                checkFalling();
                if (isFalling)
                    changeAnimate("fall");

                if (isRightSideBlocked) {
                    changeAnimate("stand");
                }
            }
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
            console.log(Number.parseInt(allObjects.style.left))
            if (checkAhead() && !isLeftSideBlocked && Number.parseInt(allObjects.style.left) < 0) {
                moveWorldLeft();
                checkFalling();
                if (isFalling)
                    changeAnimate("fall");
            }
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
        topMainHero = heroY * 32;
        const startPosY = topMainHero;
        //картинка прышка
        heroImg.style.top = -heroBlockSize * 2 + "px";

        //установка изначального положения спрайта
        if (direction === "right") {
            heroImg.style.left = "0px";
            leftPosMainHero = 0;
            heroImg.style.transform = "scale(1, 1)";
        }
        else {
            heroImg.style.left = -heroBlockSize * MaxBlocksXHero + "px";
            leftPosMainHero = -heroBlockSize * MaxBlocksXHero;
            heroImg.style.transform = "scale(-1, 1)";
        }

        animationSome = setInterval(() => {
            if (direction === "right") {
                leftPosMainHero <= -heroBlockSize * 4 ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
            } else {
                leftPosMainHero >= -(MaxBlocksXHero - heroBlockSize * 4) ? leftPosMainHero = -heroBlockSize * MaxBlocksXHero : leftPosMainHero += heroBlockSize;
            }

            heroImg.style.left = leftPosMainHero + "px";
        }, heightJump / 10 * 17 / 4);

        //передвижение персонажа
        animation = setInterval(() => {
            topMainHero += speed;

            if (!checkSoffit()) {
                changeAnimate("fall");
            }

            if (topMainHero - startPosY > heightJump) {
                checkFalling();
                if (isFalling) {
                    changeAnimate("fall");
                }
                else changeAnimate("stand");
            }

            if (direction === "right") {
                /* translateMainHero += speed;
                hero.style.left = translateMainHero + "px"; */

                moveWorldRight();
            } else {
                /* translateMainHero -= speed;
                hero.style.left = translateMainHero + "px"; */

                moveWorldLeft();
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
            topMainHero -= speed;
            hero.style.bottom = topMainHero + "px";
            checkFalling();
            if (!isFalling) {
                hero.style.bottom = `${heroY * 32}px`;
                changeAnimate("stand");
            }
        }, 17);


        heroImg.style.left = leftPosMainHero + "px";


    }
    function hurtHanlder() {
        heroImg.style.top = -heroBlockSize * 4 + "px";
        if (direction === "right") {
            heroImg.style.left = "0px";
        } else {
            heroImg.style.left = -(MaxBlocksXHero - 1) * heroBlockSize + "px";
        }

        setTimeout(() => {
            changeAnimate("stand");
        }, 100);
    }


    function createTile(x, y = 1) {
        const tile = document.createElement("img");
        tile.src = "img/tiles/main.jpg";
        tile.style.cssText = `
            position: absolute;
            left: ${x * 32}px;
            bottom: ${y * 32}px;
            width: 32px;
            height: 32px;
        `;
        allObjects.appendChild(tile);

        tileArray.push([x, y]);
        //objectsArray.push(tile);
    }
    function addTiles(i) {
        createTile(i);

        const tileBottom = document.createElement("img");
        tileBottom.src = "img/tiles/foundation.jpg";
        tileBottom.style.cssText = `
            position: absolute;
            left: ${i * 32}px;
            bottom: 0;
            width: 32px;
            height: 32px;
        `;
        allObjects.appendChild(tileBottom);
        //objectsArray.push(tileBottom);
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

    //есть ли впереди персонажа стена
    //let isAheadOfThwWall = false;

    //проверка должен ли персонаж падать
    function checkFalling() {
        updateHeroXY();
        isFalling = true;
        for (let i = 0; i < tileArray.length; i++) {
            if (Math.ceil(tileArray[i][0]) === heroX && Math.ceil(tileArray[i][1]) + 1 === heroY) {
                isFalling = false;
                break;
            } else if (Math.ceil(tileArray[i][0]) === heroX + 2 && Math.ceil(tileArray[i][1]) + 1 === heroY) {
                isFalling = false;
                break;
            }
        }
    }
    //проверка может ли персонаж идти (есть ли стенка впереди)
    function checkAhead() {
        updateHeroXY();
        if (direction === "right") {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX + 3 && Math.ceil(tileArray[i][1]) + 1 === heroY + 1) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX - 1 && Math.ceil(tileArray[i][1]) + 1 === heroY + 1) {
                    return false;
                }
            }
        }
        return true;
    }
    //проверка может ли персонаж лететь вверх (есть ли потолок потолок)
    function checkSoffit() {
        updateHeroXY();
        if (direction === "right") {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX + 1 && Math.ceil(tileArray[i][1]) + 1 === heroY + 2) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX && Math.ceil(tileArray[i][1]) + 1 === heroY + 2) {
                    return false;
                }
            }
        }
        return true;
    }

    function lifeCycle() {
        setInterval(() => {
            if (animateWasChanged) {
                animateWasChanged = false;
                if (state === "fall") {
                    fallHandler();
                } else if (state === "stand") {
                    standHanlder();
                } else if (state === "hurt") {
                    hurtHanlder();
                }
            }
        }, 17);
    }

    function start() {

        //!первой строкой можно добавить загрузку, последней ее удаление

        lifeCycle();

        for (let i = 0; i < 100; i++) {
            if (i > 10 && i < 20) continue;
            addTiles(i);
        }

        createTilesPlatform(10, 6, 15);
        createTilesPlatform(20, 10, 15);
        createTilesPlatform(30, 14, 15);
        createTilesPlatform(34, 2, 5);

        new Enemy(25, 2);
        new Enemy(24, 11);

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
        isHurt = false;

        SpriteMaxPosX = 6;
        SpriteMaxPosY = 5;
        SpritePosX = 0;
        SpritePosY = 0;

        NumPosStand = 2;
        NumPosHurt = 1;
        NumPosWalk = 5;
        NumPosAttack = 3;
        NUmPosDeath = 4;

        lives = 2;

        constructor(x, y) {
            this.posX = x;
            this.posY = y;
            this.startX = this.posX;

            this.createEnimy();

            AllEnemy.push(this);

            this.lifeCycle();

            this.changeAnimate(this.WALK);

            this.updatePositionX();
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
            }, 17);
        }

        updatePositionX() {
            setInterval(() => {
                this.block.style.left = this.posX * 32 + "px";
            });
        }

        //Проверка столкновения с героем
        checkCollide() {

            if (heroY == this.posY) {
                if (heroX == Math.floor(this.posX)) {
                    isRightSideBlocked = true;
                    isLeftSideBlocked = false;
                    if (state === "hit" && this.state != this.HURT && !this.isHurt) {
                        this.isHurt = true;
                        //получение урона делаем только через время, так как сначала дожна пройти анимация атаки кота,
                        //иначе будет многократное получение урона
                        setTimeout(() => {
                            this.changeAnimate(this.HURT);
                            this.showHurt();
                            this.lives--;
                        }, 600);
                    } else if (!this.attack) {
                        this.changeAnimate(this.ATTACK);
                    }
                } else if (heroX == Math.floor(this.posX + 2) || heroX == Math.floor(this.posX + 1)) {
                    isLeftSideBlocked = true;
                    isRightSideBlocked = false;
                    if (state === "hit" && this.state != this.HURT && !this.isHurt) {
                        this.isHurt = true;
                        //получение урона делаем только через время, так как сначала дожна пройти анимация атаки кота,
                        //иначе будет многократное получение урона
                        setTimeout(() => {
                            this.changeAnimate(this.HURT);
                            this.showHurt();
                            this.lives--;
                        }, 600);
                    } else if (!this.attack) {
                        this.changeAnimate(this.ATTACK);
                    }
                } else if (this.state === this.ATTACK) {
                    this.changeAnimate(this.WALK);
                    this.attack = false;

                    isLeftSideBlocked = false;
                    isRightSideBlocked = false;
                }
            } else if (this.state === this.ATTACK) {
                this.changeAnimate(this.WALK);
                this.attack = false;

                isLeftSideBlocked = false;
                isRightSideBlocked = false;
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

                        if (state != "jump" && state != "fall") {
                            changeAnimate("hurt");
                            lives--;
                            killHeart();
                        }

                    } else {
                        this.SpritePosX--;
                        this.img.style.left = -(this.SpritePosX * this.blockSize) + "px";
                    }
                } else {
                    this.img.style.transform = "scale(1, 1)";
                    if (this.SpritePosX >= this.NumPosAttack) {
                        this.SpritePosX = 0;

                        if (state != "jump" && state != "fall") {
                            changeAnimate("hurt");
                            lives--;
                            killHeart();
                        }
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
                this.img.style.left = -(this.SpriteMaxPosX - this.NUmPosDeath * this.blockSize) + "px";
                this.posXSprite = this.SpriteMaxPosX + 2 - this.NUmPosDeath;

                this.animation = setInterval(() => {
                    if (this.posXSprite < 2) {
                        clearInterval(this.animation);
                        //смерть
                        //this.block.style.display = "none";
                        //clearInterval(animation);
                        //this.changeAnimate(this.STAND);
                    } else {
                        this.img.style.left = -this.posXSprite * this.blockSize + "px";
                        this.posXSprite--;
                    }
                }, 100);

                //если повернут вправо
            } else {
                this.img.style.transform = "scale(1, 1)";
                this.img.style.left = "0px";
                this.posXSprite = 0;

                this.animation = setInterval(() => {
                    if (this.posXSprite > this.NUmPosDeath) {
                        clearInterval(this.animation);
                        //смерть
                        //this.block.style.display = "none";
                        //(animation);
                        //this.changeAnimate(this.STAND);
                    } else {
                        this.img.style.left = -this.posXSprite * this.blockSize + "px";
                        this.posXSprite++;
                    }
                }, 100);
            }

            clearInterval(this.timer);
            isLeftSideBlocked = false;
            isRightSideBlocked = false;

            /* allObjects.appendChild(this.block);
            AllEnemy = AllEnemy.filter(item => item !== this); */
            

        }

        hurtAnimate() {

            this.img.style.top = -3 * this.blockSize + "px";
            if (this.direction === Math.abs(this.direction)) {
                this.img.style.transform = "scale(-1, 1)";
                this.img.style.left = -(this.SpriteMaxPosX - this.NumPosHurt) * this.blockSize + "px";
            } else {
                this.img.style.transform = "scale(1, 1)";
                this.img.style.left = -this.NumPosHurt * this.blockSize + "px";
            }

            setTimeout(() => {
                this.isHurt = false;
                if (this.lives <= 0) {
                    this.changeAnimate(this.DEATH);
                } else {
                    this.changeAnimate(this.ATTACK);
                }
            }, 300);

        }

        //отображение урона
        showHurt() {
            const element = document.createElement("p");
            element.innerText = "-1";
            element.style.cssText = `
                color: red;
                font-weight: 700;
                font-size: 30px;
                text-shadow: 1px 1px 2px #000;
                position: absolute;
                animation: showHurt 1s ease;
                left: ${Number.parseInt(this.block.style.left + 50)}px;
                bottom: ${Number.parseInt(this.block.style.bottom + 32)}px;
            `;
            game.appendChild(element);

            setTimeout(() => {
                element.parentNode.removeChild(element);
            }, 1000);
        }

        //для смены координат при движении камеры
        moveRight() {
            this.startX -= 1 / (32 / speed);
            this.posX -= 1 / (32 / speed);
        }
        moveLeft() {
            this.startX += 1 / (32 / speed);
            this.posX += 1 / (32 / speed);
        }
    }

    start();
}