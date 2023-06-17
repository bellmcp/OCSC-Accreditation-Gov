import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import SearchPersonLetter from './personLetter/components/SearchPersonLetter'
import SearchCurriculum from './curriculum/components/SearchCurriculum'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${path}/person-letter`}>
        <SearchPersonLetter />
      </Route>
      <Route path={`${path}/curriculum`}>
        <SearchCurriculum />
      </Route>
    </Switch>
  )
}
