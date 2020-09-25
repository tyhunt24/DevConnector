import React, {Fragment, useState} from 'react'
import {Link, Redirect} from "react-router-dom"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import {login} from "../../actions/auth"

const Login = ({login, isAuthenticated}) => {
       //initial useState hook setup 
       const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    //destructor the form data for use state 
    const {email, password} = formData; 

    //allows us to make changes
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    //submit the data the user enters
    const onSubmit = async e => {
      e.preventDefault()
     login(email, password)
    }

    //Redirect if logged in
    if(isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Login</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign in to your account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="email" placeholder="Email" name="email" value={email} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" name="password" value={password}  onChange={e => onChange(e)} />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </Fragment>
    )
}

Login.propTypes = ({
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
})

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login}) (Login)
