import React from 'react'
import {Link, withRouter} from "react-router-dom"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import {addEducation} from '../../actions/profile'

const AddEducation = () => {
    return (
        <div>
            
        </div>
    )
}

AddEducation.propTypes = {
    addEducation:PropTypes.func.isRequired
}

export default connect(null, {addEducation}) (AddEducation)