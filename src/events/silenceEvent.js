import isEvent from './isEvent';

const silenceEvent = event => {
  const is = isEvent(event);
  if (is) {
    event.preventDefault();
    event.stopPropagation();
  }
  return is;
};

export default silenceEvent;
