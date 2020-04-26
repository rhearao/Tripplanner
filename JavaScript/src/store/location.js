import axios from "axios";
const SET_USER_LOC = "SET_USER_LOC";
const LOADING_LOC = "LOADING_LOC";

const setUserLoc = location => ({ type: SET_USER_LOC, location });

export const setUserLocation = location => (dispatch) => {
  dispatch(setUserLoc(location));
};

export const postLocation = ({
  coords: { longitude, latitude }
}) => async dispatch => {
  try {
    dispatch(setUserLoc({ longitude, latitude }));
  } catch (e) {
    console.log(e);
  }
};

const initialState = {
  user: [-74.006, 40.712],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_LOC:
      return { ...state, user: action.location };
    case LOADING_LOC:
      return { ...state, loading: true };
    default:
      return state;
  }
}
