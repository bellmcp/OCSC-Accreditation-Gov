import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Preview from './components/Preview'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${path}`}>
        <Preview />
      </Route>
    </Switch>
  )
}
