import {combineReducers} from "redux";
import wordsReducer from "./wordsReducer";
import imagesReducer from "./imagesReducer";

const rootReducer = combineReducers({
    wordsReducer,
    imagesReducer,
})

export default rootReducer;
