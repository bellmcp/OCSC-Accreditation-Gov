import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import PersonLetterWorker from './worker/components/PersonLetterWorker'
import PersonLetterSupervisor from './supervisor/components/PersonLetterSupervisor'
import { isLoginAsAdmin } from 'utils/isLogin'

export default function Routes() {
  const { path } = useRouteMatch()
  const isAdmin = isLoginAsAdmin()

  return (
    <Switch>
      {/* Check condition Worker or Supervisor */}
      <Route path={`${path}`}>
        {isAdmin ? <PersonLetterSupervisor /> : <PersonLetterWorker />}
      </Route>
    </Switch>
  )
}
