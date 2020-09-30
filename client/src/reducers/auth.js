import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, DELETE_ACCOUNT} from "../actions/types"

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action) {
    const {type, payload} = action //destructor out the action

    switch(type) {
        case USER_LOADED:
            return {
                ...state, // return everything that was in the state
                isAuthenticated: true, //return isAuthenicated to true
                loading: false,
                user: payload //returns all the users information
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS: {
            localStorage.setItem("token", payload.token) // put the token in the local storage
            return {
                ...state, // give back the state
                ...payload, //get back everything in the payload
                isAuthenticated: true, //isAuthenticated becomes true
                loading: false // loading is false
            }
        }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
        case DELETE_ACCOUNT: {
            localStorage.removeItem("token") // takes token out of localStorage
            return {
                ...state, //brings everything into the state
                token: null, //the token becomes null 
                isAuthenticated: false, //authentication becomes false
                loading: false // put loading at false because it is not searching anymore
            }
        }
        default: 
            return state
    }

}