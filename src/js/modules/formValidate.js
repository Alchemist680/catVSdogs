export function formValidate(){
    const forms = document.forms;
    if (forms.length) {
        let form = forms[0];
        for (let index = 0; index < forms.length; index++) {
            form = forms[index];
            form.addEventListener('submit', formSend);
        }
        async function formSend(e) {
            e.preventDefault();
            let errors = formValidate(form);
            if (errors === 0) {
                alert('письмо отправлено');
                form.reset();
                const errorElements = form.querySelectorAll('.error-element');
                if(errorElements.length){
                    errorElements.forEach(item => {
                        item.remove();
                    });
                }
            } else {
                form.classList.add('error');
            }
        }
        function formValidate(form) {
            let errors = 0;
            const formReq = form.querySelectorAll('.req');
    
            if (formReq.length) {
                for (let index = 0; index < formReq.length; index++) {
                    const input = formReq[index];
                    formRemoveError(input);
                    if (input.classList.contains('email')) {
                        if (emailTest(input)) {
                            formAddError(input);
                            errors++;
                            if(input.dataset.textError){
                                const textError = input.dataset.textError;
                                input.insertAdjacentHTML(
                                    'afterend',
                                    `<div class="error-element">${textError}</div>`
                                )
                            }
                        }
                    } else if (input.classList.contains('req_checkbox') && input.checked === false) {
                        formAddError(input);
                        errors++;
                        if(input.dataset.textError){
                            const textError = input.dataset.textError;
                            input.insertAdjacentHTML(
                                'afterend',
                                `<div class="error-element">${textError}</div>`
                            )
                        }
                    } else if (input.value === '') {
                        formAddError(input);
                        errors++;
                        if(input.dataset.textError){
                            const textError = input.dataset.textError;
                            input.insertAdjacentHTML(
                                'afterend',
                                `<div class="error-element">${textError}</div>`
                            )
                        }
                    }
                }
                return (errors);
            }
    
        }
        function formRemoveError(input) {
            input.classList.remove('error');
            input.parentElement.classList.remove('error');
        }
        function formAddError(input) {
            input.classList.add('error');
            input.parentElement.classList.add('error');
        }
        function emailTest(input) {
            return !/^\w+([\.*]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
        }
    }
}


