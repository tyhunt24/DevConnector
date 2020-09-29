import axios from "axios"
import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE} from "./types"
import {setAlert} from "./alert"
import setAuthToken from "../utils/setAuthToken"

//load a user
export const loadUser = () => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get("/api/auth") //gets the users information

        dispatch({
            type: USER_LOADED, //gets the type
            payload: res.data // sends the user information to the state
        })

    } catch (err) {
        dispatch({
            type: AUTH_ERROR //fails
        })
    }
}

//register a user
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

        dispatch(loadUser())
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

//login user
export const login = (email, password) => async dispatch => {
    const config = {
        //gets it to json
        headers: {
            "Content-Type": "application/json"
        }
    }
     //turns the body in json
     const body = JSON.stringify({email, password})

     try {
         //sends the user to be logged in
        const res = await axios.post("/api/auth", body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data //? returns the token
        })

        dispatch(loadUser());
     } catch (err) {
        const errors = err.response.data.errors; //returns the array of messages

        //returns the error message with the danger
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger"))) 
        }
         dispatch({
             type: LOGIN_FAIL
         })
     }
}

//Logout User / Clear Profile
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
    dispatch({
        type: CLEAR_PROFILE
    })
}