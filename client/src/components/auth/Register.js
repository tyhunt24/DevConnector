import React, {Fragment, useState} from 'react'
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {setAlert} from "../../actions/alert"
import {register} from "../../actions/auth"

import PropTypes from 'prop-types'


const Register = ({setAlert, register}) => {
    //initial useState hook setup 
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    //destructor the form data for use state 
    const {name, email, password, password2} = formData; 

    //allows us to make changes
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    //submit the data the user enters
    const onSubmit = e => {
        e.preventDefault()
        if(password !== password2) {
            setAlert("Passwords do not match", 'danger')
        } else {
          register({name, email, password})
        }
    }
    
    return ( 
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email}  onChange={e => onChange(e)} />
                    <small className="form-text">This site uses Gravatar so if you want a profile picture
                    use a gravatar email</small>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" name="password" minLength="6" value={password}  onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Confirm Password" name="password2" minLength="6" value={password2}  onChange={e => onChange(e)} />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </Fragment>
    
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
}

// connect allows us to connect what we are using to redux
export default connect(null, {setAlert, register})(Register)
