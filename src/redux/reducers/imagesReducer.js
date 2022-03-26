import * as actionTypes from "../actions/actionTypes"

export default function imagesReducer(state="", action){
    switch (action.type) {
        case actionTypes.GET_IMAGES_TO_CLOUD:
            return action.images
        default:
            return state;
    }
}