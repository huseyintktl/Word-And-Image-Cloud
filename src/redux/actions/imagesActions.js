import * as actionTypes from "./actionTypes";

export function getImagesToCloudSuccess(images) {
    return {type: actionTypes.GET_IMAGES_TO_CLOUD, images: images}
}

export function getImagesToCloud() {
    return function (dispatch) {
        let url = "http://localhost:3002/images_cloud";
        return fetch(url)
            .then(response => response.json())
            .then(result => {
                dispatch(getImagesToCloudSuccess(result))
            }).catch(err=>{
                alert("Could not get images")});
    };
}
