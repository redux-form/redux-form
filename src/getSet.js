export function getIn(obj, path) {
  return (path.length === 0 || obj === undefined) ? obj : getIn(obj[path[0]], path.slice(1));
};


export function setIn(obj, path, val) {
  if (path.length === 0)
    return val;
  else {
    const sub = (obj === null) ? null : obj[path[0]];
    var val = setIn(sub || [], path.slice(1), val);
    return {
      ...obj,
      [path[0]]: val
    }
  }
};
