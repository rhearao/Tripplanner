import axios from "axios";
const GET_MEMBERS = "GET_MEMBERS";

// action
const getMembers = (members) => ({ type: GET_MEMBERS, members });

export const getAllMembers = (groupId) => async (dispatch) => {
  try {
    const res = await axios.get(`/group/${groupId}/members`);
    console.log("get all memebers return ", res);
    if (res.data) {
      dispatch(getMembers(res.data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const checkMember = (groupId, userEmail) => async (dispatch) => {
  try {
    const res = await axios.get(`/auth/${userEmail}`);
    if (res.data) {
      dispatch(addMember(groupId, res.data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const addMember = (groupId, userInfo) => async (dispatch) => {
  try {
    const res = await axios.post(`/group/${groupId}/${userInfo.id}`);
    if (res.data) {
      console.log("in addMember", res.data);
      dispatch(getAllMembers(groupId));
    }
  } catch (error) {
    console.error(error);
  }
};

export default function (state = {}, action) {
  switch (action.type) {
    case GET_MEMBERS:
      return action.members;
    default:
      return state;
  }
}
