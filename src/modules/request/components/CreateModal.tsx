// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { getCookie } from 'utils/cookies'
import { get } from 'lodash'
import * as yup from 'yup'

import {
  createStyles,
  Theme,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles'
import {
  Dialog,
  Toolbar,
  Slide,
  Box,
  IconButton,
  Typography,
  AppBar,
  Container,
  Grid,
  TextField,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'
import { Stack } from '@mui/material'
import { TransitionProps } from '@material-ui/core/transitions'
import { Close as CloseIcon } from '@material-ui/icons'

import * as requestActions from 'modules/request/actions'

import DatePicker from './DatePicker'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingTop: theme.spacing(3),
    },
    sectionTitle: {
      fontSize: '1.7rem',
      fontWeight: 600,
      lineHeight: '1.3',
      zIndex: 3,
      color: theme.palette.secondary.main,
    },
    seeAllButton: {
      marginBottom: '0.35em',
      zIndex: 3,
    },
    root: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
  })
)

const parseLinkToDefaultColor = (text: string) => {
  return text.replace(/<a/g, '<a class="html_link"')
}

export default function CreateModal({ isOpen, onCancel }: any) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles()

  useEffect(() => {
    dispatch(requestActions.loadUploadNote())
  }, [dispatch])

  const workplace = getCookie('workplace')
  const contact = getCookie('contact')
  const { uploadNote = {} } = useSelector((state: any) => state.request)
  const pdfUploadNote = get(uploadNote, 'pdf', '')
  const xlsxUploadNote = get(uploadNote, 'xlsx', '')
  const termNote = get(uploadNote, 'term', 'โปรดเลือก')

  const [XLSXFile, setXLSXFile] = useState(null)
  const [PDFFile, setPDFFile] = useState(null)
  const [letterDate, setLetterDate] = useState<string>(null)

  const validationSchema = yup.object({})
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      letterNo: null,
      letterDate: null,
      workplace: workplace, // prefill
      contact: contact, // prefill
      xlsxFile: null,
      pdfFile: null,
      checked: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        requestActions.submitForm({
          letterNo: get(values, 'letterNo', null),
          letterDate: letterDate,
          workplace: get(values, 'workplace', null),
          contact: get(values, 'contact', null),
          xlsxFile: XLSXFile,
          pdfFile: PDFFile,
        })
      )
    },
  })

  const handleXLSXFileInput = (e: any) => {
    const file = e.target.files[0]
    setXLSXFile(file)
  }
  const handlePDFFileInput = (e: any) => {
    const file = e.target.files[0]
    setPDFFile(file)
  }

  const note = (
    <span style={{ color: theme.palette.error.main, marginLeft: 2 }}>*</span>
  )

  const onCloseModal = () => {
    formik.resetForm()
    setLetterDate(null)
    setXLSXFile(null)
    setPDFFile(null)
    onCancel()
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onCloseModal}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar
          style={{ position: 'relative', paddingLeft: 24, paddingRight: 24 }}
          color='secondary'
        >
          <Toolbar>
            <Typography
              style={{ marginLeft: 2, flex: 1 }}
              variant='h6'
              component='div'
            >
              ยื่นคำร้องขอตรวจสอบคุณวุฒิผ่านช่องทางอิเล็กทรอนิกส์
            </Typography>
            <Stack direction='row' spacing={1}>
              <IconButton
                edge='start'
                color='inherit'
                onClick={onCloseModal}
                aria-label='close'
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Container maxWidth='lg' className={classes.content}>
          <form onSubmit={formik.handleSubmit}>
            <Box mt={2} mb={4}>
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
                <Grid container item spacing={2}>
                  <Grid container item direction='row' alignItems='center'>
                    <Grid xs={12} md={3}>
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        style={{ fontWeight: 600 }}
                        gutterBottom
                      >
                        เลขที่หนังสือนำส่งสำนักงาน ก.พ.
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <TextField
                        id='letterNo'
                        name='letterNo'
                        placeholder='เลขที่หนังสือนำส่งสำนักงาน ก.พ.'
                        value={formik.values.letterNo}
                        onChange={formik.handleChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item direction='row' alignItems='center'>
                    <Grid xs={12} md={3}>
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        style={{ fontWeight: 600 }}
                        gutterBottom
                      >
                        ลงวันที่
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <DatePicker date={letterDate} setDate={setLetterDate} />
                    </Grid>
                  </Grid>
                  <Grid container item direction='row' alignItems='center'>
                    <Grid xs={12} md={3}>
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        style={{ fontWeight: 600 }}
                        gutterBottom
                      >
                        หน่วยงาน
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <TextField
                        id='workplace'
                        name='workplace'
                        placeholder='หน่วยงาน'
                        value={formik.values.workplace}
                        onChange={formik.handleChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item direction='row' alignItems='center'>
                    <Grid xs={12} md={3}>
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                      >
                        ชื่อ-นามสกุล หมายเลขโทรศัพท์
                        <br />
                        หรือ อีเมล เจ้าหน้าที่ผู้รับผิดชอบ
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <TextField
                        id='contact'
                        name='contact'
                        placeholder='ชื่อ-นามสกุล หมายเลขโทรศัพท์ หรือ อีเมล เจ้าหน้าที่ผู้รับผิดชอบ'
                        value={formik.values.contact}
                        onChange={formik.handleChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
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
                <Grid container item spacing={3}>
                  <Grid container item direction='row' alignItems='center'>
                    <Grid xs={12}>
                      <Typography
                        gutterBottom
                        variant='body2'
                        color='error'
                        style={{ fontWeight: 500 }}
                      >
                        <b>*</b> โปรดแนบไฟล์ต่อไปนี้
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item direction='row' alignItems='flex-start'>
                    <Grid xs={12} md={3}>
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        style={{ fontWeight: 600 }}
                        gutterBottom
                      >
                        1. ไฟล์สเปรดชีต{note}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <Stack direction='column' spacing={1}>
                        {xlsxUploadNote !== '' && (
                          <Typography
                            variant='body2'
                            color='textSecondary'
                            style={{ fontWeight: 400 }}
                            gutterBottom
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: parseLinkToDefaultColor(xlsxUploadNote),
                              }}
                            />
                          </Typography>
                        )}
                        <input
                          name='file'
                          id='file'
                          type='file'
                          accept='.xlsx'
                          style={{ width: '100%' }}
                          onChange={handleXLSXFileInput}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid container item direction='row' alignItems='flex-start'>
                    <Grid xs={12} md={3}>
                      <Typography
                        variant='body1'
                        color='textPrimary'
                        style={{ fontWeight: 600 }}
                        gutterBottom
                      >
                        2. ไฟล์ PDF หรือ ZIP{note}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <Stack direction='column' spacing={1}>
                        {pdfUploadNote !== '' && (
                          <Typography
                            variant='body2'
                            color='textSecondary'
                            style={{ fontWeight: 400 }}
                            gutterBottom
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: parseLinkToDefaultColor(pdfUploadNote),
                              }}
                            />
                          </Typography>
                        )}
                        <input
                          name='file'
                          id='file'
                          type='file'
                          accept='.pdf, .zip'
                          style={{ width: '100%' }}
                          onChange={handlePDFFileInput}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              <FormControlLabel
                style={{ marginTop: 32, marginBottom: 24, marginLeft: 10 }}
                control={
                  <Checkbox
                    checked={formik.values.checked}
                    id='checked'
                    name='checked'
                    value={formik.values.checked}
                    onChange={formik.handleChange}
                    color='secondary'
                  />
                }
                label={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseLinkToDefaultColor(termNote),
                    }}
                  />
                }
              />
              <Button
                disabled={!formik.values.checked}
                fullWidth
                variant='contained'
                color='secondary'
                type='submit'
              >
                ยื่นคำร้อง
              </Button>
            </Box>
          </form>
        </Container>
      </Dialog>
    </div>
  )
}
