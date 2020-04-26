import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import user from "./user";
import upload from "./upload";
import groups from "./group";
import members from "./members";
import events from "./event";
import selectedGroup from "./selectedGroup";
import selectedEvent from "./selectedEvent";
import selectedEvetIdx from "./highlight";
import location from "./location";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const appReducer = combineReducers({
  user,
  groups,
  upload,
  selectedGroup,
  members,
  events,
  selectedEvent,
  selectedEvetIdx,
  location
});

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2, // 查看 'Merge Process' 部分的具体情况
};

const rootReducer = (state, action) => {
  if (action.type === "REMOVE_USER") {
    state = undefined;
  }
  return appReducer(state, action);
};

const myPersistReducer = persistReducer(persistConfig, rootReducer);

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);

export const store = createStore(myPersistReducer, middleware);
export const persistor = persistStore(store);
export default store;
export * from "./user";
export * from "./group";
export * from "./upload";
export * from "./members";
export * from "./selectedGroup";
export * from "./event";
export * from "./selectedEvent";
export * from "./highlight";
export * from "./location";
