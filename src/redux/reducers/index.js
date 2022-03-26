import {combineReducers} from "redux";
import wordsReducer from "./wordsReducer";
import imagesReducer from "./imagesReducer";
import bookReducer from "./bookReducer";

const rootReducer = combineReducers({
    wordsReducer,
    imagesReducer,
    bookReducer

})

export default rootReducer;
