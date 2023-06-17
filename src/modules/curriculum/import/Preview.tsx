// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { ExcelRenderer, OutTable } from 'react-excel-renderer'

import { Typography, Grid, Box } from '@material-ui/core'
import { SentimentVeryDissatisfied as ErrorIcon } from '@material-ui/icons'
import Stack from '@mui/material/Stack'

export default function Preview({ file }: any) {
  const [cols, setCols] = useState([])
  const [rows, setRows] = useState([])

  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        setIsError(true)
      } else {
        const columns = [{ name: '', key: 0 }]
        resp.cols.map((item) => {
          columns.push({ name: item.name, key: item.key + 1 })
          return null
        })
        setCols(columns)
        setRows(resp.rows)
        setIsError(false)
      }
    })
  }, [file])

  return (
    <Stack direction='column' spacing={4}>
      {!isError ? (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <OutTable
            data={rows}
            columns={cols}
            tableClassName='ExcelTable2007'
            tableHeaderRowClass='heading'
          />
        </div>
      ) : (
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          style={{ height: 500 }}
        >
          <Box my={10}>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <ErrorIcon
                color='disabled'
                style={{ fontSize: 54, marginBottom: 14 }}
              />
              <Typography variant='body2' color='textSecondary' align='center'>
                ไม่สามารถแสดงไฟล์ได้
                <br />
                โปรดดาวน์โหลด หรือลองใหม่อีกครั้ง
              </Typography>
            </Grid>
          </Box>
        </Grid>
      )}
    </Stack>
  )
}
