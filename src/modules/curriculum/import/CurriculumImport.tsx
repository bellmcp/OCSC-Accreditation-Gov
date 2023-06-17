import React, { useState } from 'react'
import { get } from 'lodash'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'

import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles'
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import Stack from '@mui/material/Stack'
import { Publish as ImportIcon } from '@material-ui/icons'

import Header from 'modules/ui/components/Header'
import Preview from './Preview'

import * as curriculumActions from 'modules/curriculum/actions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    sectionTitle: {
      fontSize: '1.7rem',
      fontWeight: 600,
      zIndex: 3,
      lineHeight: '1.3',
    },
    sectionSubtitle: {
      fontSize: '1.4rem',
      fontWeight: 600,
      zIndex: 3,
      marginBottom: '24px',
      lineHeight: '1.3',
    },
    table: {
      minWidth: 650,
    },
  })
)

export default function CurriculumImport() {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [file, setFile] = useState(undefined)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAccept = () => {
    handleClose()
    dispatch(curriculumActions.importFile(file))
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      file,
    },
    onSubmit: (values) => {
      handleClickOpen()
    },
  })

  const handleFileInput = (e: any) => {
    const file = e.target.files[0]
    setFile(file)
  }

  return (
    <>
      <Header />
      <form onSubmit={formik.handleSubmit}>
        <Container maxWidth='lg' className={classes.content}>
          <Box mt={2} mb={4}>
            <Grid
              container
              direction='row'
              alignItems='center'
              justify='space-between'
              style={{ marginBottom: 8 }}
            >
              <Typography
                gutterBottom
                component='h2'
                variant='h6'
                color='secondary'
                className={classes.sectionTitle}
                align={matches ? 'left' : 'center'}
              >
                หนังสือเวียน : นำเข้าหลักสูตรใหม่
              </Typography>
            </Grid>
            <Paper
              elevation={0}
              style={{
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                border: '1px solid rgb(204 242 251)',
              }}
            >
              <Grid container item spacing={2}>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12}>
                    <Typography
                      variant='body2'
                      color='primary'
                      style={{ fontWeight: 500 }}
                    >
                      <b>*</b> รับเฉพาะไฟล์ Excel ที่มีนามสกุล .XLS หรือ .XLSX
                      เท่านั้น
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12} md={3}>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      style={{ fontWeight: 600 }}
                    >
                      เลือกไฟล์
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <input
                        name='file'
                        id='file'
                        type='file'
                        accept='.xlsx, .xls'
                        style={{ width: '100%' }}
                        onChange={handleFileInput}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            {file && (
              <Paper
                elevation={0}
                style={{
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                  border: '1px solid rgb(204 242 251)',
                  marginTop: 24,
                }}
              >
                <Preview file={file} />
              </Paper>
            )}
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              startIcon={<ImportIcon />}
              style={{ marginTop: 32 }}
              type='submit'
              disabled={file === undefined}
            >
              อัพโหลด
            </Button>
          </Box>
        </Container>
      </form>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>นำเข้าหลักสูตรใหม่?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจหรือไม่ ว่าต้องการอัพโหลดไฟล์{' '}
            <span
              style={{ fontWeight: 500, color: theme.palette.text.primary }}
            >
              {`'${get(file, 'name', 'ไม่มีชื่อ')}'`}
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='default'>
            ยกเลิก
          </Button>
          <Button
            variant='contained'
            onClick={handleAccept}
            color='secondary'
            autoFocus
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
