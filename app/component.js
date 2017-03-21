export default (text = 'Hello world People') => {
    const element = document.createElement('div');

    element.className = 'pure-button';
    element.innerHTML = text;

    return element;
};