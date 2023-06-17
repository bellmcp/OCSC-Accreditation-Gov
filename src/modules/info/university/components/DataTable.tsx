import React from 'react'
import { get, isNull } from 'lodash'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { SalaryGroupType } from 'modules/info/types'

interface DataTableProps {
  data: SalaryGroupType[]
  isUSA: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
  })
)

const getValue = (data: any, name: string, defaultValue: any) => {
  const value = get(data, name, null)
  if (isNull(value)) return defaultValue
  else return value
}

const tableCellBaseStyle = {
  verticalAlign: 'top',
}

const tableHeadBaseStyle = {
  ...tableCellBaseStyle,
  lineHeight: '1.2',
  fontWeight: 600,
}

export default function DataTable({ data, isUSA }: DataTableProps) {
  const classes = useStyles()

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell width={100} align='center' style={tableHeadBaseStyle}>
              ลำดับ
            </TableCell>
            <TableCell width={200} style={tableHeadBaseStyle}>
              ประเทศ
            </TableCell>
            {isUSA && <TableCell style={tableHeadBaseStyle}>รัฐ</TableCell>}
            <TableCell width={300} style={tableHeadBaseStyle}>
              ชื่อมหาวิทยาลัย
            </TableCell>
            <TableCell width={300} style={tableHeadBaseStyle}>
              ชื่อท้องถิ่น
            </TableCell>
            <TableCell width={200} style={tableHeadBaseStyle}>
              สถานที่
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data: any) => (
            <TableRow key={data.id}>
              <TableCell style={tableCellBaseStyle} align='center'>
                {getValue(data, 'order', 0)}
              </TableCell>
              <TableCell component='th' scope='row' style={tableCellBaseStyle}>
                {getValue(data, 'country', '')}
              </TableCell>
              {isUSA && (
                <TableCell style={tableCellBaseStyle}>
                  {getValue(data, 'state', '')}
                </TableCell>
              )}
              <TableCell style={tableCellBaseStyle}>
                {getValue(data, 'name', '')}
              </TableCell>
              <TableCell style={tableCellBaseStyle}>
                {getValue(data, 'localname', '')}
              </TableCell>
              <TableCell style={tableCellBaseStyle}>
                {getValue(data, 'place', '')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
