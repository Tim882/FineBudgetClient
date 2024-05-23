import { combineReducers } from 'redux';

const initialState = {
    loggedin: sessionStorage.getItem('token') != null
    // loggedin: {loggedin: sessionStorage.getItem('token') != null}
  };
  
  const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOGIN":
        return { ...state, loggedin: true };
      case "LOGOUT":
        return { ...state, loggedin: false };
      default:
        return state;
    }
  };
  
// Combine Reducers
const rootReducer = combineReducers({
    loggedin: loginReducer,
    // Add other reducers here if you have more
});
  
export default rootReducer;