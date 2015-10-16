import isEvent from './isEvent';

const silenceEvents = fn => (event, ...args) => {
  if (isEvent(event)) {
    event.preventDefault();
    event.stopPropagation();
    return fn(...args);
  }
  return fn(event, ...args);
};

export default silenceEvents;
