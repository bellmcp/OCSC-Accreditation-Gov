import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import CurriculumProgress from './progress/CurriculumProgress'
import CurriculumApprove from './approve/CurriculumApprove'
import CurriculumImport from './import/CurriculumImport'
import CurriculumExport from './export/CurriculumExport'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${path}/progress`}>
        <CurriculumProgress />
      </Route>
      <Route path={`${path}/approve`}>
        <CurriculumApprove />
      </Route>
      <Route path={`${path}/import`}>
        <CurriculumImport />
      </Route>
      <Route path={`${path}/export`}>
        <CurriculumExport />
      </Route>
    </Switch>
  )
}
