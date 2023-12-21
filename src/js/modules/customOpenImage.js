//?Открытие изображения
//Все data атрибуты:
//data-open-image-lock-padding - ставим для фиксируемых видимых объектов для устранения дергания при убирании скролла(скролл убирается каждый раз при отркытии картинки), для шапки код уже прописан
//data-open-image - либо пустое для иницилизации, либо в значении название
//data-open-image-speed - время анимации открывания
//data-open-image-timing-function - сценарий открывание (ease-in-out например)

//?Иницилизация: new customOpenImage();

export default class customOpenImage {
    constructor() {
        document.addEventListener("click", (e) => {
            const targetElement = e.target;

            if (targetElement.closest('[data-open-image]')) {
                const item = targetElement.closest('[data-open-image]');
                let image = null;
                if (item.querySelector('img')) {
                    image = item.querySelector('img');
                } else if (item.tagName === 'IMG') {
                    image = item;
                }
                  

                if (image) {
                    image.id = "custom_open_image_active";
                    const speed = item.dataset.openImageSpeed ? item.dataset.openImageSpeed : .8;
                    const timingFunction = item.dataset.openImageTimingDuration ? item.dataset.openImageTimingDuration : "ease";
                    const titleImageValue = item.dataset.openImage.length < 150 ? item.dataset.openImage : item.dataset.openImage.substring(0, 120) + '...';

                    //document.body.style.overflow = "hidden";

                    const titleImage = document.createElement('div');

                    const close = document.createElement('div');
                    close.id = "openImageCloseButton";
                    close.classList.add('close');

                    close.innerHTML = `<svg height="1.5rem" width="1.5rem" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>`;
                    close.style.cssText = `
                            fill: transparent;
                        `;

                    close.addEventListener('mouseenter', this.hoverClose);
                    close.addEventListener('mouseleave', this.unHoverClose);

                    const wpapperOpenImage = document.createElement('div');
                    wpapperOpenImage.id = "wpapperOpenImage";

                    const openImage = image.cloneNode(true);
                    openImage.id = "duplicateImage";
                    delete openImage.dataset.openImage;

                    openImage.style.cssText = `
                        position: absolute;
                        top: ${image.getBoundingClientRect().top}px;
                        left: ${image.getBoundingClientRect().left}px;
                        width: ${image.getBoundingClientRect().width}px; 
                        height: ${image.getBoundingClientRect().height}px;
                    `;

                    wpapperOpenImage.appendChild(openImage);
                    wpapperOpenImage.appendChild(close);

                    if (titleImage) {
                        titleImage.innerHTML = titleImageValue;
                        titleImage.classList.add('titleImage');
                        titleImage.style.cssText = `
                                color: transparent;
                            `;
                        wpapperOpenImage.appendChild(titleImage);
                    }

                    document.documentElement.appendChild(wpapperOpenImage);

                    let scaleValue = (window.innerWidth - window.innerWidth * 0.2) / image.naturalWidth < (window.innerHeight - window.innerHeight * 0.2) / image.naturalHeight ? (window.innerWidth - window.innerWidth * 0.2) / image.naturalWidth : (window.innerHeight - window.innerHeight * 0.2) / image.naturalHeight;

                    setTimeout(() => {
                        openImage.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            width: ${image.naturalWidth * scaleValue}px;
                            height: ${image.naturalHeight * scaleValue}px;
                            transform: translate(-50%, -50%);
                            transition: ${speed}s top ${timingFunction}, ${speed}s left ${timingFunction}, ${speed}s width ${timingFunction}, ${speed}s height ${timingFunction};
                        `;

                        wpapperOpenImage.style.cssText = `
                            position: fixed;
                            z-index: 10000;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            background-color: rgb(0, 0, 0, 0.93);
                            transition: ${speed}s all ${timingFunction};
                        `;
                        if (titleImage) {
                            titleImage.style.cssText = `
                                position: absolute;
                                bottom: 5vh;
                                transform: translate(0, 50%);
                                color: #fff;
                                font-size: 2vh;
                                text-align: center;
                                line-height: 150%;
                                width: 100%;
                                padding: 0 2vw;
                                transition: ${speed}s color ${timingFunction};
                            `;
                        }

                        close.style.cssText = `
                            fill: #fff;
                            opacity: 0.7;
                            position: absolute;
                            top: 2vh;
                            right: 2vh;
                            transition: ${speed}s all ${timingFunction};
                            cursor: pointer;
                        `;
                    }, 0);


                    //Убирание сдвига при скрытии скролла
                    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
                    document.body.style.paddingRight = lockPaddingValue;
                    document.body.style.overflow = "hidden";
                    const header = document.querySelector("header");
                    if (header) {
                        header.style.paddingRight = lockPaddingValue;
                    }
                    const lockPaddingElements = document.querySelectorAll('[data-open-image-lock-padding]');
                    if (lockPaddingElements.length) {
                        lockPaddingElements.forEach(el => {
                            el.style.paddingRight = lockPaddingValue;
                        });
                    }

                    e.preventDefault();
                }
            }
            if (targetElement.closest("#wpapperOpenImage") && !targetElement.closest("#wpapperOpenImage img")) {
                this.closeOpenImage(targetElement);
                e.preventDefault();
            }
        });
        window.addEventListener('resize', () => {
            const image = document.getElementById('custom_open_image_active');
            if (image) {
                const item = image.closest('[data-open-image]');
                const speed = item.dataset.openImageSpeed ? item.dataset.openImageSpeed : 0.8;
                const timingFunction = item.dataset.openImageTimingDuration ? item.dataset.openImageTimingDuration : "ease";
                const openImage = document.querySelector('#duplicateImage');

                const scaleValue = (window.innerWidth - window.innerWidth * 0.2) / image.naturalWidth < (window.innerHeight - window.innerHeight * 0.2) / image.naturalHeight ? (window.innerWidth - window.innerWidth * 0.2) / image.naturalWidth : (window.innerHeight - window.innerHeight * 0.2) / image.naturalHeight;
                openImage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(${scaleValue});
                    transition: ${speed}s all ${timingFunction};
                    `;
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeOpenImage(document.querySelector("#wpapperOpenImage"));
                e.preventDefault();
            }
        });
    }

    hoverClose() {
        document.querySelector('#openImageCloseButton').style.cssText = `
                fill: #fff;
                opacity: 1;
                position: absolute;
                top: 2vh;
                right: 2vh;
                transition: 0.3s all ease;
                cursor: pointer;
            `;
    }
    unHoverClose() {
        document.querySelector('#openImageCloseButton').style.cssText = `
                fill: #fff;
                opacity: 0.7;
                position: absolute;
                top: 2vh;
                right: 2vh;
                transition: 0.3s all ease;
                cursor: pointer;
            `;
    }
    closeOpenImage(targetElement) {
        const wpapperOpenImage = targetElement.closest("#wpapperOpenImage");
        const imageRoot = document.querySelector("#custom_open_image_active");
        const item = imageRoot.closest('[data-open-image]') ? imageRoot.closest('[data-open-image]') : imageRoot;
        const speed = item.dataset.openImageSpeed ? item.dataset.openImageSpeed : 0.8;
        const timingFunction = item.dataset.openImageTimingDuration ? item.dataset.openImageTimingDuration : "ease";
        imageRoot.id = "";

        if (wpapperOpenImage.querySelector('.titleImage')) {
            wpapperOpenImage.querySelector('.titleImage').style.cssText = `
                    position: absolute;
                    bottom: 5vh;
                    transform: translate(0, 50%);
                    color: transparent;
                    font-size: 2vh;
                    text-align: center;
                    line-height: 150%;
                    width: 100%;
                    padding: 0 2vw;
                    transition: ${speed}s all ${timingFunction};
                `;
        }

        wpapperOpenImage.style.cssText = `
                position: fixed;
                z-index: 10000;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: transparent;
                transition: ${speed / 1.5}s all ${timingFunction} ${speed / 1.5}s;
            `;

        wpapperOpenImage.querySelector('img').style.cssText = `
                position: fixed;
                top: ${imageRoot.getBoundingClientRect().top}px;
                left: ${imageRoot.getBoundingClientRect().left}px;
                width: ${imageRoot.getBoundingClientRect().width}px;
                height: ${imageRoot.getBoundingClientRect().height}px;
                transition: ${speed}s top ${timingFunction}, ${speed}s left ${timingFunction}, ${speed}s width ${timingFunction}, ${speed}s height ${timingFunction};
                object-fit: cover;
                opacity: 0.7;
            `;

        wpapperOpenImage.querySelector('.close').style.cssText = `
            fill: transparent;
            position: absolute;
            top: 2vh;
            right: 2vh;
            transition: ${speed}s all ${timingFunction};
            cursor: pointer;
        `;

        setTimeout(() => {
            document.documentElement.removeChild(wpapperOpenImage);

            //Устранение дергания при убирании скрола
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = 0;
            const header = document.querySelector("header");
            if (header) {
                header.style.paddingRight = 0;
            }
            const lockPaddingElements = document.querySelectorAll('[data-open-image-lock-padding]');
            if (lockPaddingElements.length) {
                lockPaddingElements.forEach(el => {
                    el.style.paddingRight = 0;
                });
            }
        }, 800);

        document.querySelector('#openImageCloseButton').removeEventListener('mouseenter', this.hoverClose);
        document.querySelector('#openImageCloseButton').removeEventListener('mouseleave', this.unHoverClose);
    }
}