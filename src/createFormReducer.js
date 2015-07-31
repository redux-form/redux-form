import { CHANGE, SHOW_ALL, RESET } from './actionTypes';

/**
 * Creates a state structure like:
 * {
 *   data: {
 *     field1: 'value1',
 *     field2: 'value2'
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
 * @param fields an array of field names, used when showing all values
 * @param initialData initial data to populate the state with
 * @returns {Function} a form reducer
 */
export default function createFormReducer(name, fields, initialData = {}) {
  const initialState = {data: initialData, visited: {}};
  return (state = initialState, action = {}) => {
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
          visited: {
            ...state.visited,
            [action.field]: true
          }
        };
      case SHOW_ALL:
        const visited = {};
        fields.forEach(key => visited[key] = true); // mark all as visited
        return {
          ...state,
          visited: visited
        };
      case RESET:
        return initialState;
      default:
        return state;
    }
  };
}
