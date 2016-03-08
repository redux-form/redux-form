// Quack! This is a duck. https://github.com/erikras/ducks-modular-redux

const SHOW = 'redux-form-examples/submission/SHOW';
const HIDE = 'redux-form-examples/submission/HIDE';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SHOW:
      return {
        shown: true,
        results: action.results
      };
    case HIDE:
      return {};
    default:
      return state;
  }
};

export const show = results => ({type: SHOW, results});
export const hide = () => ({type: HIDE});

export default reducer;
