import * as actionTypes from './actionsTypes';
import { AnyAction, combineReducers } from 'redux';

const initState = {
  data: [],
};

function updateData(data = initState.data, action: AnyAction){
  switch (action.type) {
    case actionTypes.UPDATE_DATA:
      return action.data;
    default:
      return data;
  }
}

const reducer = combineReducers({
  updateData: updateData,
});

export default reducer;