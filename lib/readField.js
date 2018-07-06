'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createOnBlur = require('./events/createOnBlur');

var _createOnBlur2 = _interopRequireDefault(_createOnBlur);

var _createOnChange = require('./events/createOnChange');

var _createOnChange2 = _interopRequireDefault(_createOnChange);

var _createOnDragStart = require('./events/createOnDragStart');

var _createOnDragStart2 = _interopRequireDefault(_createOnDragStart);

var _createOnDrop = require('./events/createOnDrop');

var _createOnDrop2 = _interopRequireDefault(_createOnDrop);

var _createOnFocus = require('./events/createOnFocus');

var _createOnFocus2 = _interopRequireDefault(_createOnFocus);

var _silencePromise = require('./silencePromise');

var _silencePromise2 = _interopRequireDefault(_silencePromise);

var _read = require('./read');

var _read2 = _interopRequireDefault(_read);

var _updateField = require('./updateField');

var _updateField2 = _interopRequireDefault(_updateField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSuffix(input, closeIndex) {
  var suffix = input.substring(closeIndex + 1);
  if (suffix[0] === '.') {
    suffix = suffix.substring(1);
  }
  return suffix;
}

var getNextKey = function getNextKey(path) {
  var dotIndex = path.indexOf('.');
  var openIndex = path.indexOf('[');
  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    return path.substring(0, openIndex);
  }
  return dotIndex > 0 ? path.substring(0, dotIndex) : path;
};

var shouldAsyncValidate = function shouldAsyncValidate(name, asyncBlurFields) {
  return (
    // remove array indices
    ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]'))
  );
};

var readField = function readField(state, fieldName) {
  var pathToHere = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var fields = arguments[3];
  var syncErrors = arguments[4];
  var asyncValidate = arguments[5];
  var isReactNative = arguments[6];
  var props = arguments[7];
  var callback = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : function () {
    return null;
  };
  var prefix = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : '';
  var asyncBlurFields = props.asyncBlurFields,
      autofill = props.autofill,
      blur = props.blur,
      change = props.change,
      focus = props.focus,
      form = props.form,
      initialValues = props.initialValues,
      readonly = props.readonly,
      addArrayValue = props.addArrayValue,
      removeArrayValue = props.removeArrayValue,
      swapArrayValues = props.swapArrayValues;

  var dotIndex = fieldName.indexOf('.');
  var openIndex = fieldName.indexOf('[');
  var closeIndex = fieldName.indexOf(']');
  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }

  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // array field
    var key = fieldName.substring(0, openIndex);
    var rest = getSuffix(fieldName, closeIndex);
    var stateArray = state && state[key] || [];
    var fullPrefix = prefix + fieldName.substring(0, closeIndex + 1);
    var subfields = props.fields.reduce(function (accumulator, field) {
      if (field.indexOf(fullPrefix) === 0) {
        accumulator.push(field);
      }
      return accumulator;
    }, []).map(function (field) {
      return getSuffix(field, prefix.length + closeIndex);
    });
    var addMethods = function addMethods(dest) {
      Object.defineProperty(dest, 'addField', {
        value: function value(_value, index) {
          return addArrayValue(pathToHere + key, _value, index, subfields);
        }
      });
      Object.defineProperty(dest, 'removeField', {
        value: function value(index) {
          return removeArrayValue(pathToHere + key, index);
        }
      });
      Object.defineProperty(dest, 'swapFields', {
        value: function value(indexA, indexB) {
          return swapArrayValues(pathToHere + key, indexA, indexB);
        }
      });
      return dest;
    };
    if (!fields[key] || fields[key].length !== stateArray.length) {
      fields[key] = fields[key] ? [].concat(fields[key]) : [];
      addMethods(fields[key]);
    }
    var fieldArray = fields[key];
    var changed = false;
    stateArray.forEach(function (fieldState, index) {
      if (rest && !fieldArray[index]) {
        fieldArray[index] = {};
        changed = true;
      }
      var dest = rest ? fieldArray[index] : {};
      var nextPath = '' + pathToHere + key + '[' + index + ']' + (rest ? '.' : '');
      var nextPrefix = '' + prefix + key + '[]' + (rest ? '.' : '');

      var result = readField(fieldState, rest, nextPath, dest, syncErrors, asyncValidate, isReactNative, props, callback, nextPrefix);
      if (!rest && fieldArray[index] !== result) {
        // if nothing after [] in field name, assign directly to array
        fieldArray[index] = result;
        changed = true;
      }
    });
    if (fieldArray.length > stateArray.length) {
      // remove extra items that aren't in state array
      fieldArray.splice(stateArray.length, fieldArray.length - stateArray.length);
    }
    return changed ? addMethods([].concat(fieldArray)) : fieldArray;
  }
  if (dotIndex > 0) {
    // subobject field
    var _key = fieldName.substring(0, dotIndex);
    var _rest = fieldName.substring(dotIndex + 1);
    var subobject = fields[_key] || {};
    var nextPath = pathToHere + _key + '.';
    var nextKey = getNextKey(_rest);
    var previous = subobject[nextKey];
    var result = readField(state[_key] || {}, _rest, nextPath, subobject, syncErrors, asyncValidate, isReactNative, props, callback, nextPath);
    if (result !== previous) {
      var _extends2;

      subobject = _extends({}, subobject, (_extends2 = {}, _extends2[nextKey] = result, _extends2));
    }
    fields[_key] = subobject;
    return subobject;
  }
  var name = pathToHere + fieldName;
  var field = fields[fieldName] || {};
  if (field.name !== name) {
    var onChange = (0, _createOnChange2.default)(name, change, isReactNative);
    var initialFormValue = (0, _read2.default)(name + '.initial', form);
    var initialValue = initialFormValue || (0, _read2.default)(name, initialValues);
    initialValue = initialValue === undefined ? '' : initialValue;
    field.name = name;
    field.checked = initialValue === true || undefined;
    field.value = initialValue;
    field.initialValue = initialValue;
    if (!readonly) {
      field.autofill = function (value) {
        return autofill(name, value);
      };
      field.onBlur = (0, _createOnBlur2.default)(name, blur, isReactNative, shouldAsyncValidate(name, asyncBlurFields) && function (blurName, blurValue) {
        return (0, _silencePromise2.default)(asyncValidate(blurName, blurValue));
      });
      field.onChange = onChange;
      field.onDragStart = (0, _createOnDragStart2.default)(name, function () {
        return field.value;
      });
      field.onDrop = (0, _createOnDrop2.default)(name, change);
      field.onFocus = (0, _createOnFocus2.default)(name, focus);
      field.onUpdate = onChange; // alias to support belle. https://github.com/nikgraf/belle/issues/58
    }
    field.valid = true;
    field.invalid = false;
    Object.defineProperty(field, '_isField', { value: true });
  }

  var defaultFieldState = {
    initial: field.value,
    value: field.value
  };

  var fieldState = (fieldName ? state[fieldName] : state) || defaultFieldState;
  var syncError = (0, _read2.default)(name, syncErrors);
  var updated = (0, _updateField2.default)(field, fieldState, name === form._active, syncError);
  if (fieldName || fields[fieldName] !== updated) {
    fields[fieldName] = updated;
  }
  callback(updated);
  return updated;
};

exports.default = readField;