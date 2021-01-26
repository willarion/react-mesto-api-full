import React from 'react';
import { Redirect, Route } from "react-router-dom";


const ProtectedRoute = ({ component: Component, ...props  }) => {
  return (
    <Route path={props.path}>
      {
        () => props.loggedIn ? <Component {...props} /> : <Redirect to="/sing-in" />
      }
    </Route>
)}

export default ProtectedRoute; 