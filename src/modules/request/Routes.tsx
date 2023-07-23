import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Request from './components/Request'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={path}>
        <Request />
      </Route>
    </Switch>
  )
}
