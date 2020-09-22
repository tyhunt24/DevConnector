import React from 'react'
import PropTypes from 'prop-types'
import {connect} from "react-redux"

const Alert = ({alerts}) =>
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));

// !!! still confused on this    
Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

// !!! still confused on this
const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert)
