import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import SearchCurriculum from './curriculum/components/SearchCurriculum'

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
