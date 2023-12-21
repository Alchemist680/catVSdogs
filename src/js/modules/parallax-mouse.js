export class MousePRLX {
    constructor(props, data = null) {
        let defaultConfig = {
            init: true,
            logging: true,
        }
        this.config = Object.assign(defaultConfig, props);
        if (this.config.init) {
            let parallaxMouse = document.querySelectorAll('[data-prlx-mouse]');
            if (parallaxMouse.length) {
                this.parallaxMouseInit(parallaxMouse);
                /* this.setLogging("Слежка за объектами parallax mouse" + parallaxMouse); */
            }/*  else{ this.setLogging("Нет ни одного объекта parallax mouse"); } */
        }
    }
    parallaxMouseInit(parallaxMouse) {
        parallaxMouse.forEach(el => {
            //!Data атрибуты !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const parallaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');
            const paramCoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
            const paramCoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
            const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
            const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
            const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;

            let positionX = 0, positionY = 0;
            let coordXprocent = 0, coordYprocent = 0;

            setMouseParallaxStyle();

            if (parallaxMouseWrapper) {
                mouseMoveParallax(parallaxMouseWrapper);
            }

            function setMouseParallaxStyle() {
                const distX = coordXprocent - positionX;
                const distY = coordYprocent - positionY;
                positionX = positionX + (distX * paramAnimation / 1000);
                positionY = positionY + (distY * paramAnimation / 1000);
                el.style.cssText = `transform: translate3D(${directionX * positionX / (paramCoefficientX / 10)}%,${directionY * positionY / (paramCoefficientY / 10)}%,0);`;
                requestAnimationFrame(setMouseParallaxStyle);
            }
            function mouseMoveParallax(wrapper) {
                wrapper.addEventListener("mousemove", function (e) {
                    const offsetTop = el.getBoundingClientRect().top + window.scrollY;
                    if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
                        const parallaxWidth = window.innerWidth;
                        const parallaxHeight = window.innerHeight;
                        const coordX = e.clientX - parallaxWidth / 2;
                        const coordY = e.clientY - parallaxHeight / 2;
                        coordXprocent = coordX / parallaxWidth * 100;
                        coordYprocent = coordY / parallaxHeight * 100;
                    }
                });
            }

        });
    }
}
/* const MoPRLX = new MousePRLX(); */
