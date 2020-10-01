import axios from "axios"
import {setAlert} from "./alert"
import {GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILES, GET_REPOS, NO_REPOS} from "./types"

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

//get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({type: CLEAR_PROFILE})
    try {
        const res = await axios.get("/api/profiles")

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//get profile by id
export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`/api/profiles/user/${userId}`)
       
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

//get repos
export const getRepos = username => async dispatch => {
    try {
        const res = await axios.get(`/profiles/github/${username}`);
    
        dispatch({
          type: GET_REPOS,
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: NO_REPOS
        });
      }
} 

//Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profiles/experience/${id}`)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Experience Deleted", "danger"))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })

    }
}


//Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profiles/education/${id}`)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Education Deleted", "danger"))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })

    }
}

//Delete Account
export const deleteAccount = ()=> async dispatch => {
    if(window.conform("Are you sure? This can not be undone.")) {
        try {
            const res = await axios.delete(`/api/profiles`)
    
            dispatch({
                type: CLEAR_PROFILE,
            })

            dispatch({
                type: DELETE_ACCOUNT,
            })
    
            dispatch(setAlert("Your Account has been deleted ", "danger"))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            })
    
        }
    }
}
