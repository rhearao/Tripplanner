import axios from "axios";
const SET_SELECTED_GROUP = "SET_SELECTED_GROUP";
const REMOVE_GROUP = "REMOVE_GROUP";

const setSelectedInfo = (groupInfo) => ({
  type: SET_SELECTED_GROUP,
  groupInfo,
});
const removeGroup = () => ({ type: REMOVE_GROUP });

// export const loadSelectedGroup = () => async (dispatch) => {
//   try {
//     const res = await axios.get("/group/current");
//     dispatch(selectGroup(res.data.id));
//     if (res.data.id) {
//       return res.data.id;
//     }
//     return false;
//   } catch (err) {
//     console.error(err);
//   }
// };
export const selectGroup = (groupId) => async (dispatch) => {
  try {
    console.log("enter selected group", groupId);
    const res = await axios.get(`/group/${groupId}`);
    console.log("get gp info", res.data);
    if (res.data.name) {
      dispatch(setSelectedInfo(res.data));
    }
  } catch (err) {
    console.error(err);
  }
};

export const creatNewGroup = (
  groupName,
  locationName,
  startDate,
  endDate,
  lat,
  lng
) => async (dispatch) => {
  try {
    console.log("call creatNewGroup the date is", startDate);
    const res = await axios.post(`/home/group/create`, {
      groupName,
      locationName,
      startDate,
      endDate,
      lat,
      lng,
    });
    if (res.data.id) {
      console.log("begin dispatch the group id is ", res.data.id);
      dispatch(selectGroup(res.data.id));
      return res.data.id;
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeCurrentGroup = () => async (dispatch) => {
  try {
    dispatch(removeGroup());
  } catch (err) {
    console.error(err);
  }
};

export default function (state = {}, action) {
  switch (action.type) {
    case SET_SELECTED_GROUP:
      return action.groupInfo;
    case REMOVE_GROUP:
      return state;
    default:
      return state;
  }
}
