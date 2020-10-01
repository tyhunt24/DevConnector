import axios from "axios"
import {setAlert} from "./alert"
import {GET_POSTS, GET_POST, POST_ERROR, UPDATE_LIKES, ADD_POST} from "./types"

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get("/api/posts")

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add Like 
export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        }) 
    }
}

//Add Like 
export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        }) 
    }
}

//add a post
export const addPost = FormData => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post("/api/posts", FormData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert("Post created", "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        }) 
    }
}  

//get a single post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`)

        dispatch({
            type: GET_POST,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        }) 
    }
}

//adds a comment=
