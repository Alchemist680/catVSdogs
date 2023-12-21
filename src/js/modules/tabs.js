//!Для копирования
//!Для показа всех блоков испльзуем *
//!Необходимые data атрибуты: data-tabs, data-filter, data-filter-item

//!Это вставить в делегирование клика
//!Табы
if (targetElement.closest('[data-filter]')) {
    const itemFilter = targetElement.closest('[data-filter]');
    const filterValue = itemFilter.dataset.filter;
    const tabs = itemFilter.closest('[data-tabs]');

    tabs.querySelectorAll('[data-filter]').forEach(item => { item.classList.remove('active') });
    /*             filterValue === "*" ? itemsGrid.arrange({ filter: `` }) : 
                    itemsGrid.arrange({ filter: `[data-filter="${filterValue}"]` }) */
    itemFilter.classList.add('active');
    const tabsItems = tabs.querySelectorAll('[data-filter-item]');
    const durationAnimation = 300;
    if (filterValue === "*") {
        tabsItems.forEach(item => {
            if (item.style.position !== 'absolute') {
                item.style.cssText = `opacity: 0;`;
                setTimeout(() => {
                    item.style.cssText = `position: absolute;opacity: 0;top: 0;`;
                }, durationAnimation);
            }
        });

        setTimeout(() => {
            tabsItems.forEach(item => {
                item.style.cssText = ``;
                setTimeout(() => { item.style.cssText = `opacity: 1;`; }, 100);
            });
        }, durationAnimation);
    } else {
        tabsItems.forEach(item => {
            if (item.style.position !== 'absolute') {
                item.style.cssText = `opacity: 0;`;
                setTimeout(() => {
                    item.style.cssText = `position: absolute;opacity: 0;top: 0;`;
                }, durationAnimation);
            }
        });
        setTimeout(() => {
            tabsItems.forEach(item => {
                if (item.dataset.filterItem === filterValue) {
                    item.style.cssText = ``;
                    setTimeout(() => { item.style.cssText = `opacity: 1;`; }, 100);
                }
            });
        }, durationAnimation);
    }
    e.preventDefault();
}

//!Если у нас не стоит изначально все блоки, то обязательно копируем это в app.js
const tabs = document.querySelectorAll('[data-tabs]');
if (tabs.length) {
    tabs.forEach(tab => {
        const activeFilter = tab.querySelector('.active');
        if (activeFilter) {
            const filterValue = activeFilter.dataset.filter;
            tab.querySelectorAll('[data-filter-item]').forEach(filterItem => {
                if (filterItem.dataset.filterItem != filterValue) {
                    filterItem.style.cssText = `position: absolute;opacity: 0;`;
                }
            });
        }
    });
}