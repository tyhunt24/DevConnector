import axios from "axios"
import {REGISTER_SUCCESS, REGISTER_FAIL} from "./types"
import {setAlert} from "./alert"


// register a user
export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": 'application/json'
        }
    }
    // ! turns it json
    const body = JSON.stringify({name, email, password})
    
    try {
        // send the registration to the database
        const res = await axios.post("/api/users", body, config);
         dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data //returns the token
        })
    } catch (err) {
        // gets the errors from the response
        const errors = err.response.data.errors

        //if there is an error
        if(errors) {
            //loop through the errors and each error have a message and the alert type of danger
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}


