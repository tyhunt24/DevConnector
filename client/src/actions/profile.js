import axios from "axios"
import {setAlert} from "./alert"
import {GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE} from "./types"

//Get Profile 
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get("/api/profiles/me")

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            //gets it to json
            headers: {
                "Content-Type": "application/json"
            }
        }
        // ? Why does this one not need to be destructed
        const res = await axios.post("/api/profiles", formData, config)

        //return profile data
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        //send an alert
        dispatch(setAlert(edit ? "Profile Updated" : 'Profile Created', "success"))

        //redirects the user to the dashboard
        if(!edit) {
            history.push("/dashboard")
        }
    } catch (err) {
        const errors = err.response.data.errors; //returns the array of messages

        //returns the error message with the danger
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger"))) 
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            //gets it to json
            headers: {
                "Content-Type": "application/json"
            }
        }
        // ? Why does this one not need to be destructed
        const res = await axios.put("/api/profiles/experience", formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Experience Added", "success"))

        history.push("/dashboard")

    } catch (err) {
        const errors = err.response.data.errors; //returns the array of messages

        //returns the error message with the danger
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger"))) 
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            //gets it to json
            headers: {
                "Content-Type": "application/json"
            }
        }
        // ? Why does this one not need to be destructed
        const res = await axios.put("/api/profiles/education", formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Education Added", "success"))

        history.push("/dashboard")

    } catch (err) {
        const errors = err.response.data.errors; //returns the array of messages

        //returns the error message with the danger
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger"))) 
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}
