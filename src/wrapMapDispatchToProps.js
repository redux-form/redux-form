import {bindActionCreators} from 'redux';

const wrapMapDispatchToProps = (mapDispatchToProps, actionCreators) => {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (mapDispatchToProps.length > 1) {
        return (dispatch, ownProps) => ({
          dispatch,
          ...mapDispatchToProps(dispatch, ownProps),
          ...bindActionCreators(actionCreators, dispatch)
        });
      }
      return dispatch => ({
        dispatch,
        ...mapDispatchToProps(dispatch),
        ...bindActionCreators(actionCreators, dispatch)
      });
    }
    return dispatch => ({
      dispatch,
      ...bindActionCreators(mapDispatchToProps, dispatch),
      ...bindActionCreators(actionCreators, dispatch)
    });
  }
  return dispatch => ({
    dispatch,
    ...bindActionCreators(actionCreators, dispatch)
  });
};

export default wrapMapDispatchToProps;
