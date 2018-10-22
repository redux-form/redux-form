import PropTypes from 'prop-types';


var FormName = function FormName(_ref, _ref2) {
  var children = _ref.children;
  var _reduxForm = _ref2._reduxForm;
  return children({
    form: _reduxForm && _reduxForm.form,
    sectionPrefix: _reduxForm && _reduxForm.sectionPrefix
  });
};
FormName.contextTypes = {
  _reduxForm: PropTypes.shape({
    form: PropTypes.string.isRequired,
    sectionPrefix: PropTypes.string
  }).isRequired
};

export default FormName;