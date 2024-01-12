"use strict";

window.addEventListener("load", windowLoad);
function windowLoad() {


    let timer;
    let statusGame = 'default';

    document.addEventListener('click', documentActions)
    function documentActions(e) {
        const targetElement = e.target;

        //?Открывание мобального окна (по классу open)
        //атрибуты: data-button-for-open-custom-popup="popup" - кнопка открывания; data-custom-popup="popup" - попап; data-close-for-custom-popup - кнопка закрывания (обязательно внутри попапа);  data-custom-popup-content - контентная оболочка (внутри попапа внутри body попапа).
        if (targetElement.closest("[data-close-for-custom-popup]")) {
            const popup = targetElement.closest("[data-custom-popup]");
            if (popup) {
                popup.classList.remove('open');
                //Устранение дергания при убирании скрола
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = 0;
                const header = document.querySelector("header");
                if (header) {
                    header.style.paddingRight = 0;
                }
            }
        }
        if (targetElement.closest("[data-button-for-open-custom-popup]")) {
            if (timer && statusGame === 'pause') {
                timer.startTimer();
                statusGame = 'default';
            }
            const popupName = targetElement.closest("[data-button-for-open-custom-popup]").dataset.buttonForOpenCustomPopup;
            const popup = document.querySelector(`[data-custom-popup="${popupName}"]`);
            if (popup) {
                popup.classList.add('open');
                //Устранение дергания при убирании скрола
                const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
                document.body.style.paddingRight = lockPaddingValue;
                document.body.style.overflow = "hidden";
                const header = document.querySelector("header");
                if (header) {
                    header.style.paddingRight = lockPaddingValue;
                }

                e.preventDefault();
            }
        } else if (!targetElement.closest("[data-custom-popup].open [data-custom-popup-content]")) {
            if (timer && statusGame === 'pause') {
                timer.startTimer();
                statusGame = 'default';
            }
            const popup = document.querySelector("[data-custom-popup].open");
            if (popup) {
                popup.classList.remove('open');

                //Устранение дергания при убирании скрола
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = 0;
                const header = document.querySelector("header");
                if (header) {
                    header.style.paddingRight = 0;
                }
            }
        }

        //отрытие настроек
        if (targetElement.closest("#settings")) {
            const popupName = statusGame;
            const popup = document.querySelector(`[data-custom-popup="${popupName}"]`);
            if (popup) {

                if (timer && statusGame === 'default') {
                    timer.stopTimer();
                    statusGame = 'pause';
                    popup.querySelector(".timeGame").innerText = timer.getTime();
                }

                popup.classList.add('open');
                //Устранение дергания при убирании скрола
                const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
                document.body.style.paddingRight = lockPaddingValue;
                document.body.style.overflow = "hidden";
                const header = document.querySelector("header");
                if (header) {
                    header.style.paddingRight = lockPaddingValue;
                }

                e.preventDefault();
            }
        }


    }

    const game = document.querySelector("#game");
    let victoryLodge;
    let isGameNotOver = true;
    let isUserStartGame = false;

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

    let fish;

    let arrayEnemies = [];

    let lives = 8;
    let maxLives = lives;

    //Скорость передвижения (3 пикселя каждые 17 мс => 180пикс в секунду)
    let speed = 8;

    //Позиции для главного персонажа
    let leftPosMainHero = 0;
    //let translateMainHero = 64;
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
    let lifeCycleTimer;

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
    document.addEventListener("keydown", Managementtracking);
    function Managementtracking(e) {
        const keyPressed = e.code;
        if (isGameNotOver) {

            //запуск таймера
            if (isUserStartGame === false) {
                isUserStartGame = true;
                timer = new Timer();
            }

            if (keyPressed === "KeyD" || keyPressed === "ArrowRight") {
                if (!isRightSideBlocked) {
                    if (state != "rightWalk" && state != "fall" && state != "hurt" && state != "death") {
                        changeAnimate("rightWalk");
                        rightHandler();
                    }
                }
            }
            if (keyPressed === "KeyA" || keyPressed === "ArrowLeft") {
                if (!isLeftSideBlocked) {
                    if (state != "leftWalk" && state != "fall" && state != "hurt" && state != "death") {
                        changeAnimate("leftWalk");
                        leftHandler();
                    }
                }
            }

            if (keyPressed === "KeyF") {
                if (state != "jump" && state != "fall" && state != "hit" && state != "hurt" && state != "death") {
                    changeAnimate("hit");
                    hitHandler();
                }

            }
            if (keyPressed === "KeyW" || keyPressed === "Space" || keyPressed === "ArrowUp" && state != "death") {
                if (state != "jump" && state != "fall" && state != "hurt") {
                    changeAnimate("jump");
                    jumpHandler();
                }
            }
        }

        //закрывание открытого попапа
        if (keyPressed === "Escape") {
            const popup = document.querySelector("[data-custom-popup].open");
            if (timer && statusGame === 'pause') {
                statusGame = 'default';
                timer.startTimer();
            }
            if (popup) {
                popup.classList.remove('open');
                //Устранение дергания при убирании скрола
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = 0;
                const header = document.querySelector("header");
                if (header) {
                    header.style.paddingRight = 0;
                }
            } else {
                const popupName = statusGame;
                const popup = document.querySelector(`[data-custom-popup="${popupName}"]`);
                if (popup) {

                    if (timer && statusGame === 'default') {
                        timer.stopTimer();
                        statusGame = 'pause';
                        popup.querySelector(".timeGame").innerText = timer.getTime();
                    }

                    popup.classList.add('open');
                    //Устранение дергания при убирании скрола
                    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
                    document.body.style.paddingRight = lockPaddingValue;
                    document.body.style.overflow = "hidden";
                    const header = document.querySelector("header");
                    if (header) {
                        header.style.paddingRight = lockPaddingValue;
                    }

                    e.preventDefault();
                }
            }
        }

    }
    //Обработчик опускания клавиши
    document.addEventListener("keyup", (e) => {
        if (state != "fall" && state != "jump" && state != "hit" && state != "hurt" && state != "death")
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
            setTimeout(() => {
                fish = new Fish();
            }, 150 * 4);

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
            setTimeout(() => {
                fish = new Fish();
            }, 150 * 4);
        }



    }
    class Fish {
        x = heroX + 1;
        fishXPos = this.x * 32;
        flightDistance = 300;
        y = heroY;
        animation;
        fish;
        blockSize = 75;
        constructor() {
            this.createFish();
            this.animateFish();
        }

        createFish() {
            this.fish = document.createElement("div");
            const image = document.createElement("img");

            this.fish.style.cssText = `
                position: absolute;
                left: ${this.x * 32}px;
                bottom: ${this.y * 32}px;
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
                overflow: hidden;
            `;
            game.appendChild(this.fish);

            image.src = "img/fish.png";
            image.style.cssText = `
                position: absolute;
                left: 0;
                bottom: 0;
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
            `;
            if (direction === 'left') {
                image.style.transform = "scale(-1, 1)";
            }
            this.fish.appendChild(image);
        }

        animateFish() {
            const startPosXFish = this.fishXPos;

            if (direction === 'right') {
                this.animation = setInterval(() => {
                    this.fishXPos += speed * 1.5;
                    this.fish.style.left = this.fishXPos + "px";
                    if (this.fishXPos > startPosXFish + this.flightDistance || checkFishToEnemy(this.fishXPos)) {
                        clearInterval(this.animation);
                        this.fish.parentNode.removeChild(this.fish);
                        delete this;
                    }
                }, 17);
            } else {
                this.animation = setInterval(() => {
                    this.fishXPos -= speed * 1.5;
                    this.fish.style.left = this.fishXPos + "px";
                    if (this.fishXPos < startPosXFish - this.flightDistance || checkFishToEnemy(this.fishXPos)) {
                        clearInterval(this.animation);
                        this.fish.parentNode.removeChild(this.fish);
                        delete this;
                    }
                }, 17);
            }



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
            leftPosMainHero = -heroBlockSize * (MaxBlocksXHero - 1);
            heroImg.style.transform = "scale(-1, 1)";
        }

        animationSome = setInterval(() => {
            if (direction === "right") {
                leftPosMainHero <= -heroBlockSize * 3 ? leftPosMainHero = 0 : leftPosMainHero -= heroBlockSize;
            } else {
                leftPosMainHero >= -(MaxBlocksXHero - heroBlockSize * 3) ? leftPosMainHero = -heroBlockSize * MaxBlocksXHero : leftPosMainHero += heroBlockSize;
            }

            heroImg.style.left = leftPosMainHero + "px";
        }, heightJump / 10 * 17 / 3);

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
                else {
                    hero.style.bottom = `${heroY * 32}px`;
                    changeAnimate("stand");
                }
            } else {
                hero.style.bottom = topMainHero + "px";
            }

            if (direction === "right") {
                /* translateMainHero += speed;
                hero.style.left = translateMainHero + "px"; */

                moveWorldRight();
            } else if (Number.parseInt(allObjects.style.left) < 0) {
                /* translateMainHero -= speed;
                hero.style.left = translateMainHero + "px"; */

                moveWorldLeft();
            }

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

        killHeart();
        lives--;

        setTimeout(() => {
            if (lives <= 0)
                changeAnimate("death");
            else
                changeAnimate("stand");
        }, 100);
    }
    function deathHanlder() {
        heroImg.style.top = -heroBlockSize * 5 + "px";
        if (direction === "right") {
            heroImg.style.transform = "scale(1, 1)";
            heroImg.style.left = "0px";
            leftPosMainHero = 0;

            animation = setInterval(() => {
                if (leftPosMainHero <= -heroBlockSize * 4) {
                    //конец игры
                    changeAnimate("dsfsf");
                    gameOver("loss");
                    statusGame = "loss";
                } else {
                    leftPosMainHero -= heroBlockSize;
                    heroImg.style.left = leftPosMainHero + "px";
                }
            }, 150);

        } else {
            heroImg.style.transform = "scale(-1, 1)";
            heroImg.style.left = -(MaxBlocksXHero * heroBlockSize - 4 * heroBlockSize) + "px";
            leftPosMainHero = -(MaxBlocksXHero * heroBlockSize - 4 * heroBlockSize);

            animation = setInterval(() => {
                if (leftPosMainHero >= -(MaxBlocksXHero - 5) * heroBlockSize) {
                    //конец игры
                    changeAnimate("dsfsf");
                    gameOver("loss");
                    statusGame = "loss";
                } else {
                    leftPosMainHero += heroBlockSize;
                    heroImg.style.left = leftPosMainHero + "px";
                }
            }, 150);
        }
    }


    function createTile(x, y = 1) {
        const tile = document.createElement("img");
        tile.src = "img/tiles/main.jpeg";
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
        tileBottom.src = "img/tiles/foundation.jpeg";
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

    function updateHeroY() {
        //heroX = Math.ceil(Number.parseInt(getComputedStyle(hero).left) / 32);
        heroY = Math.ceil(Number.parseInt(getComputedStyle(hero).bottom) / 32);
    }

    //проверка должен ли персонаж падать
    function checkFalling() {
        updateHeroY();
        isFalling = true;
        for (let i = 0; i < tileArray.length; i++) {
            if (heroY <= -3) {
                gameOver("loss");
                statusGame = "loss";
                changeAnimate("fdsf");
            }
            if (Math.ceil(tileArray[i][0]) === heroX && Math.ceil(tileArray[i][1]) + 1 === heroY) {
                isFalling = false;
                break;
            } else if (Math.ceil(tileArray[i][0]) === heroX + 3 && Math.ceil(tileArray[i][1]) + 1 === heroY) {
                isFalling = false;
                break;
            }
        }
    }
    //проверка может ли персонаж идти (есть ли стенка впереди)
    function checkAhead() {
        updateHeroY();
        if (direction === "right") {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX + 3 && Math.ceil(tileArray[i][1]) + 1 === heroY + 1) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX && Math.ceil(tileArray[i][1]) + 1 === heroY + 1) {
                    return false;
                }
            }
        }
        return true;
    }
    //проверка задевает ли рыба монстра
    function checkFishToEnemy(FishX) {
        updateHeroY();
        FishX = Math.ceil(FishX / 32);
        let isTrue = false;

        arrayEnemies.forEach(Enemy => {
            if (Enemy.state != Enemy.DEATH) {
                if (Math.ceil(Enemy.posX) === FishX && Math.ceil(Enemy.posY) === heroY) {
                    if (Enemy.lives <= 1) {
                        Enemy.changeAnimate(Enemy.DEATH);
                    } else {
                        Enemy.changeAnimate(Enemy.HURT);
                        Enemy.showHurt();
                        Enemy.lives--;
                    }
                    isTrue = true;
                    return true;
                }
            }
        });
        if (isTrue)
            return true;
        else return false;
    }
    //проверка может ли персонаж лететь вверх (есть ли потолок потолок)
    function checkSoffit() {
        updateHeroY();
        if (direction === "right") {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX + 2 && Math.ceil(tileArray[i][1]) + 1 === heroY + 2) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < tileArray.length; i++) {
                if (Math.ceil(tileArray[i][0]) === heroX + 1 && Math.ceil(tileArray[i][1]) + 1 === heroY + 2) {
                    return false;
                }
            }
        }
        return true;
    }

    function lifeCycle() {
        lifeCycleTimer = setInterval(() => {
            if (animateWasChanged) {
                animateWasChanged = false;
                if (state === "fall") {
                    fallHandler();
                } else if (state === "stand") {
                    standHanlder();
                } else if (state === "hurt") {
                    hurtHanlder();
                } else if (state === "death") {
                    deathHanlder();
                }
            }
        }, 17);
    }

    function start() {

        //!первой строкой можно добавить загрузку, последней ее удаление

        lifeCycle();

        new generateMap();

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
                        //! убрал получение урона при ситуации, когда герой и монстр столкнулись и герой атакует, так как это делается на рыбе
                        /* this.isHurt = true; */
                        //получение урона делаем только через время, так как сначала дожна пройти анимация атаки кота,
                        //иначе будет многократное получение урона
                        /* setTimeout(() => {
                            this.changeAnimate(this.HURT);
                            this.showHurt();
                            this.lives--;
                        }, 600); */
                    } else if (!this.attack) {
                        this.changeAnimate(this.ATTACK);
                    }
                } else if (heroX == Math.floor(this.posX + 2) || heroX == Math.floor(this.posX + 1)) {
                    isLeftSideBlocked = true;
                    isRightSideBlocked = false;
                    if (state === "hit" && this.state != this.HURT && !this.isHurt) {
                        //! убрал получение урона при ситуации, когда герой и монстр столкнулись и герой атакует, так как это делается на рыбе
                        /* this.isHurt = true; */
                        //получение урона делаем только через время, так как сначала дожна пройти анимация атаки кота,
                        //иначе будет многократное получение урона
                        /* setTimeout(() => {
                            this.changeAnimate(this.HURT);
                            this.showHurt();
                            this.lives--;
                        }, 600); */
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

                            if (lives <= 1) {
                                this.changeAnimate(this.STAND);
                            }
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

                            if (lives <= 1) {
                                this.changeAnimate(this.STAND);
                            }
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

    //Класс для работы с таймером
    class Timer {
        seconds = 0;
        minutes = 0;
        elementMinites = document.querySelector("#minutes");
        elementSeconds = document.querySelector("#seconds");
        ticking;

        constructor() {
            this.startTimer();
        }

        stopTimer() {
            clearInterval(this.ticking);
        }

        startTimer() {
            clearInterval(this.ticking);
            this.ticking = setInterval(() => {
                this.seconds++;
                if (this.seconds === 60) {
                    this.seconds = 0;
                    this.minutes++;
                }

                if (this.minutes < 10)
                    this.elementMinites.innerText = "0" + this.minutes;
                else this.elementMinites.innerText = this.minutes;

                if (this.seconds < 10)
                    this.elementSeconds.innerText = "0" + this.seconds;
                else this.elementSeconds.innerText = this.seconds;
            }, 1000);
        }

        getTime() {
            let sec;
            let min;

            if (this.minutes < 10)
                min = "0" + this.minutes;
            else min = this.minutes;

            if (this.seconds < 10)
                sec = "0" + this.seconds;
            else sec = this.seconds;

            return min + ":" + sec;
        }
    }

    class VictoryLodge {
        posX;
        posY;
        block;

        img;
        imgSrc = "img/VictoryLodge.png";
        spritePosX = 0;
        blockSize = 250;
        spriteMaxPosX = 7;
        timeInterval = 100;

        animation;

        winPosX;

        constructor(x, y) {
            this.posX = x;
            this.posY = y;
            this.winPosX = Math.floor(this.blockSize / 2 / 32 + this.posX);

            this.create();
            this.animateStand();
        }

        checkWin() {
            let checkWinTimer = setInterval(() => {
                let currentPosX = Math.ceil(Number.parseInt(getComputedStyle(allObjects).left) / 32 + this.winPosX - heroX / 2);
                if (currentPosX === heroX && this.posY === heroY) {
                    gameOver("win");
                    statusGame = "win";
                    clearInterval(checkWinTimer);
                }

            }, 50);
        }

        create() {
            this.block = document.createElement("div");
            this.block.style.cssText = `
                position: absolute;
                bottom: ${this.posY * 32}px;
                left: ${this.posX * 32}px;
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
                overflow: hidden;
            `;

            this.img = document.createElement("img");
            this.img.src = this.imgSrc;
            this.img.style.cssText = `
                position: absolute;
                top: 0px;
                left: ${this.spritePosX * this.blockSize}px;
                width: ${this.blockSize * this.spriteMaxPosX}px;
                height: ${this.blockSize}px;
                overflow: hidden;
            `;

            this.block.appendChild(this.img);
            allObjects.appendChild(this.block);
        }

        animateWin() {
            this.spritePosX = 0;
            clearInterval(this.animation);
            this.animation = setInterval(() => {
                this.spritePosX++;
                if (this.spritePosX === this.spriteMaxPosX)
                    this.spritePosX = 0;
                this.img.style.left = -this.spritePosX * this.blockSize + "px";
            }, this.timeInterval);
        }

        animateStand() {
            this.spritePosX = 0;
            this.animation = setInterval(() => {
                this.spritePosX++;
                if (this.spritePosX === 3)
                    this.spritePosX = 0;
                this.img.style.left = -this.spritePosX * this.blockSize + "px";
            }, this.timeInterval);
        }

    }

    function gameOver(state) {
        isGameNotOver = false;
        changeAnimate("stand");
        timer.stopTimer();
        if (state === "win") {
            victoryLodge.animateWin();
            document.querySelector(".timeGame").innerText = timer.getTime();
            setTimeout(() => {
                document.querySelector("[data-custom-popup='win']").classList.add("open");
            }, victoryLodge.timeInterval * (victoryLodge.spriteMaxPosX - 1) * 2);

            //Подсчет звезд
            const ratio = lives / maxLives;
            let starsLenght;
            if (ratio <= .33)
                starsLenght = 1;
            else if (ratio <= .66)
                starsLenght = 2;
            else starsLenght = 3;

            const starsElement = document.querySelector("#stars");
            for (let index = 0; index < starsLenght; index++) {
                const star = document.createElement('img');
                star.src = "img/icons/star.png";
                star.alt = "star";
                starsElement.appendChild(star);
            }


        } else {
            document.querySelector("[data-custom-popup='loss']").classList.add("open");
        }
    }

    class generateDecor {
        nameDecor;
        src = 'img/decors/';
        x;
        y;
        blockSize;

        constructor(name, x, y) {
            this.nameDecor = name;
            this.x = x;
            this.y = y;

            this.definitionOfDecoration();

            this.createDecor();
        }
        definitionOfDecoration() {
            switch (this.nameDecor) {
                case "tree":
                    this.blockSize = 100;
                    this.src += "tree.png";
                    break;
                case "fountain":
                    this.blockSize = 70;
                    this.src += "fountain.png";
                    break;

                default:
                    break;
            }
        }
        createDecor() {
            const decor = document.createElement("div");
            const image = document.createElement("img");

            decor.style.cssText = `
                position: absolute;
                left: ${this.x * 32}px;
                bottom: ${this.y * 32}px;
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
                overflow: hidden;
            `;
            allObjects.appendChild(decor);

            image.src = this.src;
            image.style.cssText = `
                position: absolute;
                left: 0;
                bottom: 0;
                width: ${this.blockSize}px;
                height: ${this.blockSize}px;
            `;
            decor.appendChild(image);
        }
    }

    const levels = {
        "1": {
            'lives': 4,
            'mapLenght': 50,
            'platforms': {
                1: { x: 10, y: 6, length: 10 },
            },
            'decors': {
                1: { name: 'tree', x: 10, y: 10 },
                2: { name: 'fountain', x: 10, y: 10 },
            },
            'enemies': {
                1: { x: 10, y: 10 },
                2: { x: 10, y: 10 },
            },
            'victoryLodge': {
                x: 10, y: 2
            },
            'abysses': {
                //1: { x1: 10, x2: 20 },
                2: { x1: 25, x2: 30 },
            }
        },
        "2": {
            'lives': 4,
            'mapLenght': 50,
            'platforms': {
                1: { x: 10, y: 6, length: 10 },
            },
            'decors': {
                1: { name: 'tree', x: 10, y: 10 },
                2: { name: 'fountain', x: 10, y: 10 },
            },
            'enemies': {
                1: { x: 10, y: 10 },
                2: { x: 10, y: 10 },
            },
            'victoryLodge': {
                x: 10, y: 2
            },
            'abysses': {
                //1: { x1: 10, x2: 20 },
                2: { x1: 25, x2: 30 },
            }
        },

    };

    class generateMap {

        constructor() {

            const urlParams = new URLSearchParams(window.location.search);
            const levelNum = urlParams.get('level');
            if (levelNum && levelNum in levels) {

                const level = levels[levelNum];

                //жизни
                lives = level.lives;
                maxLives = lives;
                for (let index = 0.5; index < lives + 0.5; index++) {
                    hearts.generateHearts(index, 0.5);
                }

                //платформы
                Object.values(level.platforms).forEach((platform) => {
                    createTilesPlatform(platform.x, platform.y, platform.length);
                });

                //Платформа основная с промежностями
                let isAbyss = false;
                for (let i = 0; i < level.mapLenght; i++) {
                    //if (i > 10 && i < 20) continue;
                    isAbyss = false;
                    Object.values(level.abysses).forEach((abyss) => {
                        if (i > abyss.x1 && i < abyss.x2) {
                            isAbyss = true;
                            return;
                        }
                    });
                    if (isAbyss) continue;
                    addTiles(i);
                }

                //Декорации
                Object.values(level.decors).forEach((decor) => {
                    new generateDecor(decor.name, decor.x, decor.y);
                });

                //Монстры
                Object.values(level.enemies).forEach((enemy) => {
                    arrayEnemies.push(new Enemy(enemy.x, enemy.y));
                });

                //Победный дом
                victoryLodge = new VictoryLodge(level.victoryLodge.x, level.victoryLodge.y);
                victoryLodge.checkWin();

            } else {
                document.querySelector("[data-custom-popup='404']").classList.add("open");
                statusGame = '404';
                document.querySelector(".wrapper").classList.add("error");
            }
        }

    }

    start();
}