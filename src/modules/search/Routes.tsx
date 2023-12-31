import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import SearchCurriculum from './components/SearchPersonLetterItems'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={path}>
        <SearchCurriculum />
      </Route>
    </Switch>
  )
}
