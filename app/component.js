export default (text = 'Hello world People') => {
    const element = document.createElement('div');

    element.innerHTML = text;

    return element;
};