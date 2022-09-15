class Emitter {
  constructor() {
    this.events = new Object();
  }

  emit = async (event, data, callback) => {
    let events = this.events[event] || new Array(),
      return_ = new Array();

    for (let e = 0; e < events.length; e++) {
      let listener = events[e];
      return_.push(listener && (await listener(data)));
    }

    if (return_.find(r => r))
      callback &&
        typeof callback === 'function' &&
        (await callback(return_[0]));
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
