import * as actionTypes from "../actions/actionTypes"

export default function wordsReducer(state="", action){
    switch (action.type) {
        case actionTypes.GET_WORDS_TO_CLOUD:
            return action.words;
        default:
            return state;
    }
}