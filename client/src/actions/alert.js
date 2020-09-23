import { v4 as uuidv4 } from 'uuid';
import {SET_ALERT, REMOVE_ALERT} from "./types"
// ! This is what the alert payload will look like
// {
//     id: 1
//     msg: "This is not the right place"
//     alertType: "danger"
// }

export const setAlert = (msg, alertType) => dispatch => {
    // makes a random id
    const id = uuidv4();

    // ? send this to the state?
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    })

    //removes the alert after a certain amount of time
    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 5000)
}