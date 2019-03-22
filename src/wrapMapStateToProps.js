import {getDependsOnOwnProps} from './helpers';

const wrapMapStateToProps = (mapStateToProps, getForm) => {
  if (mapStateToProps) {
    if (typeof mapStateToProps !== 'function') {
      throw new Error('mapStateToProps must be a function');
    }
    if (getDependsOnOwnProps(mapStateToProps)) {
      return (state, ownProps) => ({
        ...mapStateToProps(state, ownProps),
        form: getForm(state)
      });
    }
    return state => ({
      ...mapStateToProps(state),
      form: getForm(state)
    });
  }
  return state => ({
    form: getForm(state)
  });
};

export default wrapMapStateToProps;
