import * as actionTypes from "./actionTypes";

export function getBookSuccess(book) {

    return {type: actionTypes.GET_BOOK, book: book}
}

export function getBook(isbn) {
    return function (dispatch) {
        let url = "http://localhost:8000/getbookinfotoreact/"+isbn;
        return fetch(url)
            .then(response => response.json())
            .then(result => {
                if (Array.isArray(result) && result.length > 0) {
                    dispatch(getBookSuccess(result))
                }
            })
    };
}
