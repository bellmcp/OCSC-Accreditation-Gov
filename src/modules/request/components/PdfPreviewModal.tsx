import React, { useState } from 'react'

import {
  Typography,
  Button,
  Grid,
  Link,
  Box,
  Dialog,
  Slide,
} from '@material-ui/core'
import Stack from '@mui/material/Stack'
import {
  SentimentVeryDissatisfied as ErrorIcon,
  Close as CloseIcon,
  GetApp as DownloadIcon,
} from '@material-ui/icons'
import { TransitionProps } from '@material-ui/core/transitions'

import PdfViewer from './PdfViewer'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function PdfPreviewModal({ open, handleClose, filePath }: any) {
  const [isError, setIsError] = useState(false)

  const closeTab = () => {
    handleClose()
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
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
                ไฟล์ PDF
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
            <div style={{ width: '100%', height: '100%', minHeight: 600 }}>
              <PdfViewer url={filePath} setIsError={setIsError} />
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
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    align='center'
                  >
                    ไม่สามารถแสดงไฟล์ PDF นี้ได้
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
      </Dialog>
    </div>
  )
}
