import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import PersonLetterSupervisor from './supervisor/components/PersonLetterSupervisor'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${path}`}>
        <PersonLetterSupervisor />
      </Route>
    </Switch>
  )
}
