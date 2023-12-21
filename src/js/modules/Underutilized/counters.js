/*<div data-counter class="counter">100</div>*/
function countersInit(countersItems) {
    let counters = countersItems ? countersItems : document.querySelectorAll('[data-counter]');
    if (counters) {
        counters.forEach(counter => {
            countersAnimate(counter);
        });
    }
}
function countersAnimate(counter) {
    let startTimestamp = null;
    const duration = parseInt(counter.dataset.counter) ? parseInt(counter.dataset.counter) : 1000;
    const startValue = parseInt(counter.innerHTML);
    const startPosition = 0;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        counter.innerHTML = Math.floor(progress * (startPosition + startValue));
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}
let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetElement = entry.target;
            const countersItems = targetElement.querySelectorAll('[data-counter]');
            if(countersItems.length){
                countersInit(countersItems);
            }
            observer.unobserve(targetElement);
        }
    });
},{threshold: 0.3});
observer.observe(document.body);