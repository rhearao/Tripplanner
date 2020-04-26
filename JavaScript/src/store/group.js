import axios from "axios";
const GET_GROUPS = "GET_GROUPS";

// action
const getGroups = (groupsInfo) => ({ type: GET_GROUPS, groupsInfo });

export const getAllGroups = (userId) => async (dispatch) => {
  try {
    console.log("in get all groups");
    const res = await axios.get(`/home/group/${userId}`);
    console.log("in get all groups", res.data);
    if (res.data) {
      dispatch(getGroups(res.data));
      return res.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export default function (state = {}, action) {
  switch (action.type) {
    case GET_GROUPS:
      return action.groupsInfo;
    default:
      return state;
  }
}
