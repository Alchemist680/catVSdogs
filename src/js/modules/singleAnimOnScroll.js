export function animation(){
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const targetElement = entry.target;
                console.log(targetElement);
                const animItems = targetElement.querySelectorAll('[data-anim]');
                if(animItems.length){
                    animItems.forEach(animItem => {
                        animItem.classList.add('animated');
                    })
                    observer.unobserve(targetElement);
                }
            }
        });
    },{threshold: 0.25});
    observer.observe(document.body);
}
