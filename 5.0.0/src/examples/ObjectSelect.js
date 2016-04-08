import React, { Component, PropTypes } from 'react'

/**
 * Serializes and deserializes complex values to and from JSON
 *
 * Disclaimer: For demo purposes only!! Using <select multiple> is very awkward.
 */
class ObjectSelect extends Component {
  render() {
    const { multiple, onBlur, onChange, options, value, ...rest } = this.props
    const parse = event => {
      if (multiple) {
        const result = []
        // event.target.selectedOptions is a NodeList, not an array. Gross.
        for (let index = 0; index < event.target.selectedOptions.length; index++) {
          result.push(event.target.selectedOptions[index].value)
        }
        return result
      }
      return event.target.value;
    };
    const val = Array.isArray(value) ? value.map(JSON.stringify) : JSON.stringify(value);
    return (
      <select
        multiple={multiple}
        onBlur={event => onBlur(parse(event))}
        onChange={event => onChange(parse(event))}
        value={val}
        {...rest}>
        {options.map(option =>
          <option key={option.id} value={JSON.stringify(option)}>{option.label}</option>)}
      </select>
    )
  }
}

ObjectSelect.propTypes = {
  multiple: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  })),
  value: PropTypes.any // array or individual value
}

export default ObjectSelect
