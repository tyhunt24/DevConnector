import React from 'react'

const Navbar = () => {
    return (
       <nav className="navbar bg-dark">
           <h1>
               <a><i className="fas fa-code"></i> DevConnector</a>
           </h1>
           <ul>
               <li>Developers</li>
               <li>Register</li>
               <li>Login</li>
           </ul>
       </nav>
    )
}

export default Navbar
