export default class Observable {
    constructor() {
        this.handlers = new Map();
    }

    on(evt, handler) {
        if (!this.handlers.has(evt)) this.handlers.set(evt, []);
        this.handlers.set(evt, [...this.handlers.get(evt), handler]);
    }
    dispatch(evt, data) {
        if (this.handlers.has(evt)) this.handlers.get(evt).forEach(handler => handler(data));
    }
}