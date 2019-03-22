import {bindActionCreators} from 'redux';
import {getDependsOnOwnProps} from './helpers';

const wrapMapDispatchToProps = (mapDispatchToProps, actionCreators) => {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (getDependsOnOwnProps(mapDispatchToProps)) {
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
