// @ts-nocheck
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLogin } from 'utils/isLogin'

const PATH = process.env.REACT_APP_BASE_PATH

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = isLogin()
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn) return <Component {...props} />
        else return <Redirect to={`${PATH}/login`} />
      }}
    />
  )
}

export default PrivateRoute
