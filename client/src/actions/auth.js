import axios from "axios"
import {REGISTER_SUCCESS, REGISTER_FAIL} from "./types"
import {setAlert} from "./alert"

export const register = ({name, email, password}) => async dispatch => {
    const config = {
        //gets it to json
        headers: {
            "Content-Type": "application/json"
        }
    }
        //turns the body in json
     const body = JSON.stringify({name, email, password})
    try {
        //post the information to the route or database
        const res = await axios.post("/api/users", body, config)

        //dispatch it to redux so it can be used anywhere
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data //returns the token 
        })

    } catch (err) {
        const errors = err.response.data.errors; //returns the array of messages
        console.log(errors)

        //returns the error message with the danger
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger"))) 
        }
        //removes the token
        dispatch({
            type: REGISTER_FAIL
        })
    }
}