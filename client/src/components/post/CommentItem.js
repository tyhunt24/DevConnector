import React from 'react'
import {Link} from "react-router-dom"
import PropTypes from 'prop-types'
import {connect} from "react-redux"
import Moment from "react-moment"


const CommentItem = ({id, comment: {_id, text, name, avatar, user, date}}) => {
    return (
        <div className="post bg-dark p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img className="round-img" src={avatar} alt="Profile Picture" />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
            <p className="my-1">{text}</p>
            <p className="post-date">
             Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
            </p>
        </div>
        </div>
    )
}

CommentItem.propTypes = {
    // id: PropTypes.string.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps) (CommentItem)
