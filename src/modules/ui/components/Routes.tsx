import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from 'modules/routes/PrivateRoute'

import Login from 'modules/login/components/Login'
import PersonLetterRoutes from 'modules/personLetter/Routes'
import SearchRoutes from 'modules/search/Routes'
import CurriculumRoutes from 'modules/curriculum/Routes'
import InfoRoutes from 'modules/info/Routes'
import PasswordRoutes from 'modules/edit/password/components/Routes'

import NotFound from './NotFound'

const PATH = process.env.REACT_APP_BASE_PATH

export default function Routes() {
  return (
    <Switch>
      <Route exact path={`${PATH}/login`}>
        <Login />
      </Route>
      <PrivateRoute path={`${PATH}/search`} component={SearchRoutes} />
      <PrivateRoute path={`${PATH}/curriculum`} component={CurriculumRoutes} />
      <PrivateRoute path={`${PATH}/info`} component={InfoRoutes} />
      <PrivateRoute exact path={`${PATH}`} component={PersonLetterRoutes} />
      <PrivateRoute
        exact
        component={PasswordRoutes}
        path={`${PATH}/edit/password`}
      />
      <Redirect to={`${PATH}`}></Redirect>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
