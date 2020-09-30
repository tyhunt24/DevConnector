import React from 'react'
import {Link, withRouter} from "react-router-dom"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import {addExperience} from '../../actions/profile'

const AddExperience = () => {
    return (
        <div>
            
        </div>
    )
}

AddExperience.propTypes = {
    addExperience:PropTypes.func.isRequired
}

export default connect(null, {addExperience}) (AddExperience)
