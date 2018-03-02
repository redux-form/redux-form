export default (value) => {
  const getType = {};
  return value && getType.toString.call(value) === '[object Function]';
};
