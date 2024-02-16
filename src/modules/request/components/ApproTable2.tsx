import React from 'react'
import { get } from 'lodash'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

const getLabel = (row: any, fieldName: string) => {
  const result = get(row, fieldName, null)
  if (result === null || result === undefined || result === '') {
    return ''
  } else {
    return result
  }
}

function Row(props: any) {
  const { row, index } = props

  return (
    <React.Fragment>
      <TableRow style={{ borderBottom: 'unset' }}>
        <TableCell
          component='th'
          scope='row'
          align='center'
          style={{ verticalAlign: 'top' }}
        >
          {index + 1}
        </TableCell>
        <TableCell component='th' scope='row' style={{ verticalAlign: 'top' }}>
          {getLabel(row, 'fullName')}
        </TableCell>
        <TableCell style={{ verticalAlign: 'top' }}>
          {getLabel(row, 'degree')}
        </TableCell>
        <TableCell style={{ verticalAlign: 'top' }}>
          {getLabel(row, 'branch')}
        </TableCell>
        <TableCell style={{ verticalAlign: 'top' }}>
          {getLabel(row, 'appro')}
        </TableCell>
        {/* <TableCell style={{ verticalAlign: 'top' }}>
          {getLabel(row, 'note')}
        </TableCell> */}
      </TableRow>
    </React.Fragment>
  )
}

interface SearchResultTableType {
  data: any
}

export default function ApproTable({ data }: SearchResultTableType) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              align='center'
              style={{
                verticalAlign: 'top',
                lineHeight: '1.2',
                fontWeight: 600,
                width: 80,
              }}
            >
              ลำดับ
            </TableCell>
            <TableCell
              style={{
                verticalAlign: 'top',
                lineHeight: '1.2',
                fontWeight: 600,
                width: 200,
              }}
            >
              ชื่อ-นามสกุล
            </TableCell>
            <TableCell
              style={{
                verticalAlign: 'top',
                lineHeight: '1.2',
                fontWeight: 600,
                width: 200,
              }}
            >
              ปริญญา
            </TableCell>
            <TableCell
              style={{
                verticalAlign: 'top',
                lineHeight: '1.2',
                fontWeight: 600,
                width: 200,
              }}
            >
              สาขาวิชา
            </TableCell>
            <TableCell
              style={{
                verticalAlign: 'top',
                lineHeight: '1.2',
                fontWeight: 600,
                width: 200,
              }}
            >
              ผลการรับรอง
            </TableCell>
            {/* <TableCell
              style={{
                verticalAlign: 'top',
                lineHeight: '1.2',
                fontWeight: 600,
              }}
            >
              หมายเหตุ
            </TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any, index: number) => (
            <Row key={row.id} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
