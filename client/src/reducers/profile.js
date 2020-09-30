import {GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS, NO_REPOS} from "../actions/types"

const initialState = {
    profile: null, // ! gets a single profile
    profiles: [], // ! gets all the profiles
    repos: [], //! gets the users repos
    loading: true,
    error: {}
}

export default function (state = initialState, action) {
    const {type, payload} = action 

    switch(type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false 
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case PROFILE_ERROR: 
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        
        case GET_REPOS: 
            return {
              ...state,
              repos: payload,
              loading: false
        }
        
        case NO_REPOS:
            return {
                ...state,
                repos: []
            }
        default: 
            return state
    }
}