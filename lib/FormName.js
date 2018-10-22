'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormName = function FormName(_ref, _ref2) {
  var children = _ref.children;
  var _reduxForm = _ref2._reduxForm;
  return children({
    form: _reduxForm && _reduxForm.form,
    sectionPrefix: _reduxForm && _reduxForm.sectionPrefix
  });
};

FormName.contextTypes = {
  _reduxForm: _propTypes2.default.shape({
    form: _propTypes2.default.string.isRequired,
    sectionPrefix: _propTypes2.default.string
  }).isRequired
};

exports.default = FormName;