import axios from "axios";
const GET_EVENTS = "GET_EVENTS";
const ADD_EVENT = "ADD_EVENT";
const REMOVE_EVENT = "REMOVE_EVENT";

// action
const getEvents = (eventInfo) => ({ type: GET_EVENTS, eventInfo });
const addNewEvent = (eventInfo) => ({ type: ADD_EVENT, eventInfo });
const removeCurrEvent = (eventId) => ({ type: REMOVE_EVENT, eventId });

export const getAllEvents = (groupId) => async (dispatch) => {
  try {
    const res = await axios.get(`/group/events/${groupId}`);
    if (res.data) {
      dispatch(getEvents(res.data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const addEvent = (groupId, eventInfo) => async (dispatch) => {
  try {
    const res = await axios.post(`/group/events/${groupId}/create`, eventInfo);
    if (res.data) {
      dispatch(addNewEvent(res.data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeEvent = (groupId, eventId) => async (dispatch) => {
  try {
    dispatch(removeCurrEvent(eventId));
    await axios.post(`/group/events/${groupId}/remove`, {
      eventId,
    });
  } catch (error) {
    console.error(error);
  }
};

export default function (state = {}, action) {
  switch (action.type) {
    case GET_EVENTS:
      return action.eventInfo;
    case ADD_EVENT:
      let allEvents = [...state]
      allEvents.push(action.eventInfo)
      return allEvents;
    case REMOVE_EVENT:
      return state.filter((event) => event.id !== action.eventId);
    default:
      return state;
  }
}
