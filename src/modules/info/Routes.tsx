import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Country from './country/components/Country'
import SalaryGroup from './salaryGroup/components/SalaryGroup'
import EducationLevel from './educationLevel/components/EducationLevel'
import University from './university/components/University'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${path}/country`}>
        <Country />
      </Route>
      <Route path={`${path}/salary-group`}>
        <SalaryGroup />
      </Route>
      <Route path={`${path}/education-level`}>
        <EducationLevel />
      </Route>
      <Route path={`${path}/university`}>
        <University />
      </Route>
    </Switch>
  )
}
