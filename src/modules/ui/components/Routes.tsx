import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from 'modules/routes/PrivateRoute'

import Login from 'modules/login/components/Login'
import HomeRoutes from 'modules/home/Routes'
import RequestRoutes from 'modules/request/Routes'
import SearchRoutes from 'modules/search/Routes'

import NotFound from './NotFound'

const PATH = process.env.REACT_APP_BASE_PATH

export default function Routes() {
  return (
    <Switch>
      <Route exact path={`${PATH}/login`}>
        <Login />
      </Route>
      <PrivateRoute path={`${PATH}/search`} component={SearchRoutes} />
      <PrivateRoute path={`${PATH}/request`} component={RequestRoutes} />
      <PrivateRoute exact path={`${PATH}`} component={HomeRoutes} />
      <Redirect to={`${PATH}`}></Redirect>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
