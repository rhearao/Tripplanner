import axios from "axios";
global.fetch = require("node-fetch");
const UPLOADING = "UPLOADING";
const UPLOAD_SUCCESS = "UPLOAD_SUCCESS";
const UPLOAD_FAIL = "UPLOAD_FAIL";

const uploading = () => ({ type: UPLOADING });
const uploadSuccess = (data) => ({
  type: UPLOAD_SUCCESS,
  data,
});
const uploadFail = (error) => ({
  type: UPLOAD_FAIL,
  error,
});

export const uploadPhoto = (photo, user) => async (dispatch) => {
  try {
    dispatch(uploading());
    console.log("the photo", photo);
    const file = new FormData();
    file.append("file", photo);
    file.append("upload_preset", "tripplanner");

    const rep = await fetch(
      "	https://api.cloudinary.com/v1_1/dywamrguy/image/upload",
      {
        method: "POST",
        body: file,
      }
    );
    const fileRes = await rep.json();
    const { data } = axios.post("/auth/photo", { fileRes, user });
    console.log("in store", fileRes.url);
    dispatch(uploadSuccess(fileRes.url));
    return fileRes.url;
  } catch (e) {
    dispatch(uploadFail(e));
  }
};

const initialState = {
  data: null,
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPLOADING:
      return state;
    case UPLOAD_SUCCESS:
      return { ...state, data: action.data };
    case UPLOAD_FAIL:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
