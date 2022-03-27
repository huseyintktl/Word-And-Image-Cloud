import * as actionTypes from "./actionTypes";

export function getWordsToCloudSuccess(words) {
    return {type: actionTypes.GET_WORDS_TO_CLOUD, words: words}
}

export function getWordsToCloud() {
    return function (dispatch) {
        let url = "http://localhost:3002/words";
        return fetch(url)
            .then(response => response.json())
            .then(result => {
                dispatch(getWordsToCloudSuccess(result))
            }).catch(err=>{
                alert("Could not get words!")});
    };
}

