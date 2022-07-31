class Emitter {
  constructor() {
    this.events = new Object();
  }

  emit = async (event, data, callback) => {
    let events = this.events[event] || new Array();

    for (let e = 0; e < events.length; e++) {
      let listener = events[e];
      listener && (await listener(data));
    }

    callback && typeof callback === 'function' && (await callback());
  };

  listen = (event, listener) => {
    let listeners = this.events[event] || new Array();
    listeners.push(listener);
    this.events[event] = listeners;
  };

  remove_listener = (event, listener) => {
    let listeners = this.events[event] || new Array();

    listeners = listeners.filter(_listener => _listener !== listener);

    this.events[event] = listeners;
  };
}

export default Emitter;
