/* eslint-disable no-useless-escape */
export function validate(text) {

}

export function input(props, type = 'input') {
    return props.querySelector(type);
}

export function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    
    return (false)
}