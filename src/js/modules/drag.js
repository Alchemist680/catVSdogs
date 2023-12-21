    //!Drag эффект - перемещение элементов, для которых надо указать position: absolute; или фиксид (хреново работает, если есть оболочка reloative, лучше на все окно)
    //?работает по атрибуту data-drag=1 с значением айдишником, которые не могут повторяться, активный элемент имеет data-drag-active
    //По доработкам точно можно сократить код тем, что соединить одинаковые куски кодов из комп. версии и моб. версии в функции, но там только обращение к e.clientX разные
    //Также код не очень подготовлен для добавления, изменения новых элементов, объект с параметрами будет увеличиваться, z-indexы становится одинаковыми (по 0 вроде)
    //, но при этом в целом все будет норм работать, не использующиеся элементы не будут чиститься
    //желательно от id избавиться, писать просто data-drag, так как в объекте с одним ключем только один элемент может быть, но это тоже особо не ломает
    let isDragging = false;
    let offsetX, offsetY;
    let pressStartTime;

    //?Объект z-indexов для drag элементов
    if (!localStorage.getItem("objectZIndexDragElements")) {
        const dragElements = document.querySelectorAll("[data-drag]");
        const dragElementsLenght = dragElements.length;
        if (dragElementsLenght) {
            const obj = {};

            let i = 0;
            dragElements.forEach(elem => {
                i++;
                obj[elem.dataset.drag] = i;
                elem.style.zIndex = i;
            });

            const jsonString = JSON.stringify(obj);
            localStorage.setItem("objectZIndexDragElements", jsonString);
        }
    } else {
        //?Установка z-index на каждый drag элемент
        const dragElements = document.querySelectorAll("[data-drag]");
        if (dragElements.length) {
            dragElements.forEach(item => {
                const elementId = item.dataset.drag;
                const objectZIndex = JSON.parse(localStorage.getItem("objectZIndexDragElements"));

                item.style.zIndex = objectZIndex[elementId];
            });
        }
    }

    //?позиционирование элементов по локальному объекту
    if (!localStorage.getItem("ObjectpositionsDragElements")) {
        const obj = {};
        const jsonString = JSON.stringify(obj);
        localStorage.setItem("ObjectpositionsDragElements", jsonString);
    } else {
        //?Установка left и top на каждый drag элемент
        const dragElements = document.querySelectorAll("[data-drag]");
        if (dragElements.length) {
            dragElements.forEach(item => {
                const elementId = item.dataset.drag;
                const objectPositions = JSON.parse(localStorage.getItem("ObjectpositionsDragElements"));

                item.style.left = objectPositions["x" + elementId];
                item.style.top = objectPositions["y" + elementId];
            });
        }
    }

    //?при нажатии лкм либо на моб нажатии
    document.addEventListener("mousedown", e => {
        const targetElement = e.target;
        if (targetElement.closest("[data-drag]")) {
            isDragging = true;
            const dragElement = targetElement.closest("[data-drag]");

            //?Изменение z-index(ов)
            const dragElements = document.querySelectorAll("[data-drag");
            const zIndexObject = JSON.parse(localStorage.getItem("objectZIndexDragElements"));
            let maxZIndex = dragElements.length + 1;

            const currentElementZIdexValue = dragElement.style.zIndex;
            if (currentElementZIdexValue !== maxZIndex) {
                dragElement.style.zIndex = maxZIndex;
                zIndexObject[dragElement.dataset.drag] = maxZIndex;
                for (let i = Number(currentElementZIdexValue) + 1; i <= maxZIndex; i++) {
                    dragElements.forEach(elem => {
                        const zIndexElem = elem.style.zIndex;
                        if (zIndexElem == i) {
                            elem.style.zIndex -= 1;
                            zIndexObject[elem.dataset.drag] -= 1;
                        }
                    });
                }

                localStorage.setItem("objectZIndexDragElements", JSON.stringify(zIndexObject));
            }

            dragElement.dataset.dragActive = "";

            offsetX = e.clientX - dragElement.getBoundingClientRect().left;
            offsetY = e.clientY - dragElement.getBoundingClientRect().top;

            pressStartTime = new Date();
        }
    });
    document.addEventListener("touchstart", e => {
        const targetElement = e.target;
        if (targetElement.closest("[data-drag]")) {
            isDragging = true;

            const dragElement = targetElement.closest("[data-drag]");
            dragElement.dataset.dragActive = "";


            //?Изменение z-index(ов)
            const dragElements = document.querySelectorAll("[data-drag");
            const zIndexObject = JSON.parse(localStorage.getItem("objectZIndexDragElements"));
            let maxZIndex = dragElements.length + 1;

            const currentElementZIdexValue = dragElement.style.zIndex;
            if (currentElementZIdexValue !== maxZIndex) {
                dragElement.style.zIndex = maxZIndex;
                zIndexObject[dragElement.dataset.drag] = maxZIndex;
                for (let i = Number(currentElementZIdexValue) + 1; i <= maxZIndex; i++) {
                    dragElements.forEach(elem => {
                        const zIndexElem = elem.style.zIndex;
                        if (zIndexElem == i) {
                            elem.style.zIndex -= 1;
                            zIndexObject[elem.dataset.drag] -= 1;
                        }
                    });
                }

                localStorage.setItem("objectZIndexDragElements", JSON.stringify(zIndexObject));
            }


            offsetX = e.touches[0].clientX - dragElement.getBoundingClientRect().left;
            offsetY = e.touches[0].clientY - dragElement.getBoundingClientRect().top;
        }
    });

    //?При отпускании кнопки/мобильного нажатия
    document.addEventListener("mouseup", (e) => {
        isDragging = false;

        const activeDragElement = document.querySelector("[data-drag-active]");
        if (activeDragElement) {
            delete activeDragElement.dataset.dragActive;

            //?Сохранение в localStorage
            const updateObj = JSON.parse(localStorage.getItem("ObjectpositionsDragElements"));

            updateObj["x" + activeDragElement.dataset.drag] = activeDragElement.style.left;
            updateObj["y" + activeDragElement.dataset.drag] = activeDragElement.style.top;

            localStorage.setItem("ObjectpositionsDragElements", JSON.stringify(updateObj));

            const pressEndTime = new Date();
            const pressDuration = pressEndTime - pressStartTime;
            if (pressDuration < 100) {
                const elementLink = activeDragElement.querySelector('[data-custom-link]');
                if (elementLink) {
                    window.location.href = elementLink.dataset.customLink;
                }
            }
        }
    });
    document.addEventListener("touchend", () => {
        isDragging = false;
        const activeDragElement = document.querySelector("[data-drag-active]");
        if (activeDragElement) {
            delete activeDragElement.dataset.dragActive;

            //?Сохранение в localStorage
            const updateObj = JSON.parse(localStorage.getItem("ObjectpositionsDragElements"));

            updateObj["x" + activeDragElement.dataset.drag] = activeDragElement.style.left;
            updateObj["y" + activeDragElement.dataset.drag] = activeDragElement.style.top;

            localStorage.setItem("ObjectpositionsDragElements", JSON.stringify(updateObj));
        }
    });

    //?При перемещении
    document.addEventListener("mousemove", e => {
        if (isDragging) {
            const activeDragElement = document.querySelector("[data-drag-active]");

            const x = (e.clientX - offsetX) / window.innerWidth * 100;
            const y = (e.clientY - offsetY) / window.innerHeight * 100;

            let leftPosition = Math.max(0, Math.min(x, 100 - activeDragElement.offsetWidth / window.innerWidth * 100));
            let topPosition = Math.max(0, Math.min(y, 100 - activeDragElement.offsetHeight / window.innerHeight * 100));

            activeDragElement.style.left = leftPosition + '%';
            activeDragElement.style.top = topPosition + '%';

        }
    });
    document.addEventListener("touchmove", e => {
        if (isDragging) {
            const activeDragElement = document.querySelector("[data-drag-active]");

            const x = (e.touches[0].clientX - offsetX) / window.innerWidth * 100;
            const y = (e.touches[0].clientY - offsetY) / window.innerHeight * 100;

            let leftPosition = Math.max(0, Math.min(x, 100 - activeDragElement.offsetWidth / window.innerWidth * 100));
            let topPosition = Math.max(0, Math.min(y, 100 - activeDragElement.offsetHeight / window.innerHeight * 100));

            activeDragElement.style.left = leftPosition + '%';
            activeDragElement.style.top = topPosition + '%';
        }
    });