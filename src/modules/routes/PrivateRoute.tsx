// @ts-nocheck
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoginAsAdmin, isLoginAsUser } from 'utils/isLogin'

const PATH = process.env.REACT_APP_BASE_PATH

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoginAsAdmin() || isLoginAsUser()) return <Component {...props} />
        else return <Redirect to={`${PATH}/login`} />
      }}
    />
  )
}

export default PrivateRoute
