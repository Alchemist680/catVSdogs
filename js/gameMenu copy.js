window.addEventListener("load", windowLoad);
function windowLoad() {
    function viewRaitingInMenu() {
        const items = document.querySelectorAll("[data-raiting]");
        if (items.length) {
            items.forEach(item => {
                const level = parseInt(item.dataset.raiting);
                if (!isNaN(level)) {
                    const obj = localStorage.getItem("starsRaitingUser");
                    const existingObject = JSON.parse(obj);
                    const starsLenght = existingObject["l" + level];
                    if (starsLenght) {
                        const img = document.createElement("img");
                        img.src = "img/icons/star.png";
                        img.alt = "star";
                        for (let index = 0; index < starsLenght; index++) {
                            item.appendChild(img.cloneNode(true));
                        }
                    }
                }
            });
        }
    }
    viewRaitingInMenu();
}