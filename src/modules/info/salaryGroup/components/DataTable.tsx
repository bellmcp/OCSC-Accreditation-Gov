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

export default function DataTable({ data }: DataTableProps) {
  const classes = useStyles()

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell width={100} align='center' style={tableHeadBaseStyle}>
              ลำดับ
            </TableCell>
            <TableCell width={550} style={tableHeadBaseStyle}>
              กลุ่มเงินเดือน
            </TableCell>
            <TableCell width={100} align='center' style={tableHeadBaseStyle}>
              ขั้นต่ำ
            </TableCell>
            <TableCell width={100} align='center' style={tableHeadBaseStyle}>
              ไม่เกิน
            </TableCell>
            <TableCell style={tableHeadBaseStyle}>หมายเหตุ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data: any, index: number) => (
            <TableRow key={data.id}>
              <TableCell
                component='th'
                scope='row'
                align='center'
                style={tableCellBaseStyle}
              >
                {index + 1}
              </TableCell>
              <TableCell style={tableCellBaseStyle}>
                {getValue(data, 'salarygroup', '')}
              </TableCell>
              <TableCell align='center' style={tableCellBaseStyle}>
                {getValue(data, 'minvalue', 0).toLocaleString()}
              </TableCell>
              <TableCell align='center' style={tableCellBaseStyle}>
                {getValue(data, 'maxvalue', 0).toLocaleString()}
              </TableCell>
              <TableCell style={tableCellBaseStyle}>
                {getValue(data, 'note', '')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
