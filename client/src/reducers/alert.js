// ? I am still pretty confused on what this file is doing
import {SET_ALERT, REMOVE_ALERT} from "../actions/types"

const initialState = []

export default function(state = initialState, action) {
    const {type, payload} = action
    switch(type) {
        // ! this is our action we have to send it down
        case SET_ALERT:
            return [...state, payload]
        case REMOVE_ALERT:
            // ! filters out our last alert
            return state.filter(alert => alert.id !== payload)
        default:
            return state;
    }

} 