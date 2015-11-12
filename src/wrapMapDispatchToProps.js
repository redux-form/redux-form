import {bindActionCreators} from 'redux';

const wrapMapDispatchToProps = (mapDispatchToProps, actionCreators) => {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (mapDispatchToProps.length > 1) {
        return (dispatch, ownProps) => ({
          ...mapDispatchToProps(dispatch, ownProps),
          ...bindActionCreators(actionCreators, dispatch),
          dispatch
        });
      }
      return dispatch => ({
        ...mapDispatchToProps(dispatch),
        ...bindActionCreators(actionCreators, dispatch),
        dispatch
      });
    }
    return dispatch => ({
      ...bindActionCreators(mapDispatchToProps, dispatch),
      ...bindActionCreators(actionCreators, dispatch),
      dispatch
    });
  }
  return dispatch => ({
    ...bindActionCreators(actionCreators, dispatch),
    dispatch
  });
};

export default wrapMapDispatchToProps;
