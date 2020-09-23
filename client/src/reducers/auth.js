import {REGISTER_SUCCESS, REGISTER_FAIL} from "../actions/types"

const initialState = {
    token: localStorage.getItem('token'), // we first get local storage
    isAuthenticated: null, // No users yet so NOT authenticated
     loading: true, // loading waiting for user to be authenticated
    user: null // user has not yet been entered
}

export default function(state = initialState, action) {
    const {type, payload} = action 

    switch(type) {
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state, // we get whatever was in the state
                ...payload, // we get everything from the payload
                isAuthenticated: true, // the user is now authenticated
                loading: false // we are not loading for the user anymore
            }
        case REGISTER_FAIL:
            localStorage.removeItem("token") // we remove everything out of local storage
            return {
                ...state, 
                token: null, // token becomes null nothing in the token
                isAuthenticated: false,
                loading: false
            }

        default: 
          return state
    }
}