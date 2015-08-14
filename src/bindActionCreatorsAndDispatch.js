export default function bindActionCreatorsAndDispatch(actionCreators, dispatch) {
  const boundActionCreators =
    Object.keys(actionCreators).reduce(
      (result, key) => {
        const actionCreator = actionCreators[key];
        if (!actionCreator) {
          throw `Action creator "${key}" is missing`;
        }
        result[key] = () => dispatch(actionCreator.apply(undefined, arguments));
        return result;
      }, {});
  return {
    ...boundActionCreators,
    dispatch
  };
}
