export function animOnScroll(){
    const animItems = document.querySelectorAll('[data-anim]');
    if (animItems.length > 0) {
        window.addEventListener('scroll', animOnScroll);
        function animOnScroll(){
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;
    
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }
    
                if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)){
                    animItem.classList.add('animated');
                }/*  else{
                    if(!animItem.classList.contains('[data-anim-no-hide]')){
                        animItem.classList.remove('animated');
                    }
                } */
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.scrollX || document.documentElement.scrollLeft,
                scrollTop = window.scrollY || document.documentElement.scrollTop;
            return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
        }
        setTimeout(() =>{
            animOnScroll();
        }, 300);
    }
}
