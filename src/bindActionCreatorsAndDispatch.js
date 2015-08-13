export default function bindActionCreatorsAndDispatch(actionCreators, dispatch) {
  const boundActionCreators =
    Object.keys(actionCreators).reduce(
      (result, key) => {
        result[key] = () => dispatch(actionCreators[key].apply(undefined, arguments));
        return result;
      }, {});
  return {
    ...boundActionCreators,
    dispatch
  };
}
