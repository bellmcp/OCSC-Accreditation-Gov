// @ts-nocheck
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ExcelRenderer, OutTable } from 'react-excel-renderer'

import { Typography, Button, Grid, Link, Box } from '@material-ui/core'
import {
  SentimentVeryDissatisfied as ErrorIcon,
  Close as CloseIcon,
  GetApp as DownloadIcon,
} from '@material-ui/icons'
import Stack from '@mui/material/Stack'

export default function Preview({ onClose, filePath }: any) {
  const [cols, setCols] = useState([])
  const [rows, setRows] = useState([])

  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const config = { responseType: 'blob' }
    axios
      .get(filePath, config)
      .then((response) => {
        ExcelRenderer(new File([response.data], 'excel'), (err, resp) => {
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
      })
      .catch((error) => {
        setIsError(true)
      })
  }, [filePath])

  const closeTab = () => {
    onClose()
  }

  return (
    <Stack direction='column' spacing={4} style={{ padding: 36 }}>
      <Grid container alignItems='center' justify='space-between'>
        <Grid item>
          <Typography
            component='h2'
            variant='h6'
            color='secondary'
            style={{
              fontSize: '1.7rem',
              fontWeight: 600,
              lineHeight: '1.3',
              zIndex: 3,
            }}
          >
            ไฟล์สเปรดชีต
          </Typography>
        </Grid>
        <Grid item>
          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              color='secondary'
              href={filePath}
              target='_blank'
              startIcon={<DownloadIcon />}
            >
              ดาวน์โหลด
            </Button>
            <Button
              variant='outlined'
              onClick={closeTab}
              startIcon={<CloseIcon />}
            >
              ปิด
            </Button>
          </Stack>
        </Grid>
      </Grid>
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
                ไม่สามารถแสดงไฟล์สเปรดชีตนี้ได้
                <br />
                โปรดดาวน์โหลด หรือลองใหม่อีกครั้ง
              </Typography>
            </Grid>
          </Box>
        </Grid>
      )}
      <Typography variant='body2' color='textSecondary'>
        กำลังแสดงไฟล์:{' '}
        <Link href={filePath} target='_blank'>
          {filePath}
        </Link>
      </Typography>
    </Stack>
  )
}
