import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom"
import Moment from "react-moment"
import {connect} from "react-redux"
import {addLike} from "../../actions/post"

const PostItem = ({addLike, auth, post: {_id, text, name, avatar, user, likes, comments, date}, showActions}) => {
    return (
        <div className="post bg-dark p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}><img src={avatar} className="round-img" alt="Profile Picture"/> 
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
            <p className="my-1">{text}</p>
            <p className="post-date">
                Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
            </p>

            {showActions && 
            <Fragment>
             <button type="button" className="btn btn-light" onClick={e => addLike(_id)}>
                <i className="fas fa-thumbs-up" /> {' '}
                    <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                </button>
          <Link to={`/post/${_id}`} className="btn btn-light">
              Discussion{" "}
              {comments.length > 0 && (
                  <span className="comment-count">{comments.length}</span>
              )}
          </Link>
                {!auth.loading && user === auth.user._id && (
                    <button type="button" className="btn btn-danger">
                        <i className="fas fa-times"></i>
                    </button>
                 )} 
            </Fragment>
            }
            </div>
        </div>
    )
}

PostItem.defaultProps = {
    showActions: true
}

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {addLike}) (PostItem)

