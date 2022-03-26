import * as actionTypes from "../actions/actionTypes"

export default function bookReducer(state=[], action){
    switch (action.type) {
        case actionTypes.GET_BOOK:
            return action.book
        default:
            return state;
    }
}
