const SET_EVENT_DETAILS = "SET_EVENT_DETAILS";

const setDetails = obj => ({
  type: SET_EVENT_DETAILS,
  obj
});


export const setEventDetails = obj => dispatch => {
  try {
    dispatch(setDetails(obj));
  } catch (err) {
    console.error(err);
  }
};


const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_EVENT_DETAILS:
      return {
        ...action.obj
      };
    default:
      return state;
  }
}
