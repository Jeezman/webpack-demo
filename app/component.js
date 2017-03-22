export default (text = 'Hello world People') => {
    const element = document.createElement('div');

    element.className = 'fa fa-hand-spock-o fa-lg pure-button';
    element.innerHTML = text;

    return element;
};