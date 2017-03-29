import Worker from 'worker-loader!./worker';

export default () => {
// export default (text = 'Hello world People') => {
    // const element = document.createElement('div');

    // element.className = 'fa fa-hand-spock-o fa-lg pure-button';
    // element.innerHTML = text;
    // element.onclick = () => {
    //     import('./lazy').then((lazy) => {
    //         element.textContent = lazy.default;
    //     }).catch((err) => {
    //         console.error(err);
    //     });
    // };

    const element = document.createElement('h1');
    const worker = new Worker();
    const state = { text: 'foo' };

    worker.addEventListener(
        'message',
        ({ data: { text } }) => {
            state.text = text;
            element.innerHTML = text;
        }
    );

    element.innerHTML = state.text;
    element.onclick = () => worker.postMessage({ text: state.text });

    return element;
};