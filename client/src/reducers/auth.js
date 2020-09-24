import {REGISTER_SUCCESS, REGISTER_FAIL} from "../actions/types"

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action) {
    const {type, payload} = action //destructor out the action

    switch(type) {
        case REGISTER_SUCCESS: {
            localStorage.setItem("token", payload.token) // put the token in the local storage
            return {
                ...state, // give back the state
                ...payload, //get back everything in the payload
                isAuthenticated: true, //isAuthenticated becomes true
                loading: false // loading is false
            }
        }
        case REGISTER_FAIL: {
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