import { CHANGE, VALIDATE, RESET } from './actionTypes';

/**
 * Creates a state structure like:
 * {
 *   data: {
 *     field1: 'value1',
 *     field2: 'value2'
 *   },
 *   errors: {
 *     field1: 'error for field1',
 *     field2: 'error for field2'
 *   },
 *   visited: {
 *     field1: true,
 *     field2: false
 *   }
 * }
 *
 * A field has been "visited" if its value has been updated since the creation of the reducer.
 *
 * @param name the name of the "state slice" where the data is stored
 * @param fields an array of field names, used when validating all values
 * @param validate a validation function that takes all the data and returns all the errors
 * @param initialData initial data to populate the state with
 * @returns {Function} a form reducer
 */
export default function createFormReducer(name, fields, validate = () => {}, initialData = {}) {
  return (state = {data: initialData, errors: {}, visited: {}}, action = {}) => {
    if (action.form !== name) {
      return state;
    }
    switch (action.type) {
      case CHANGE:
        const data = {
          ...state.data,
          [action.field]: action.value
        };
        return {
          ...state,
          data: data,
          errors: validate(data),
          visited: {
            ...state.visited,
            [action.field]: true
          }
        };
      case VALIDATE:
        const errors = validate(state.data);
        const visited = state.visited;
        fields.forEach(key => visited[key] = true); // mark all as visited
        return {
          ...state,
          errors: errors,
          visited: visited
        };
      case RESET:
        return {
          data: initialData,
          errors: {},
          visited: {}
        };
      default:
        return state;
    }
  };
}
