import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { format } from 'date-fns'
import * as yup from 'yup'

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
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import {
  Launch as ExportIcon,
  GetApp as DownloadIcon,
} from '@material-ui/icons'

import Header from 'modules/ui/components/Header'
import DatePicker from './DatePicker'
import PreviewModal from './PreviewModal'

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
      lineHeight: '1.3',
    },
    table: {
      minWidth: 650,
    },
  })
)

export default function CurriculumExport() {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [date, setDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString()
  )

  const validationSchema = yup.object().shape({
    letterNo: yup.string().required(''),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: 'gov',
      letterNo: '',
      letterDate: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleClickOpen()
    },
  })

  const formik2 = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: 'gov',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        curriculumActions.loadCircularLetter(values.type === 'gov' ? 1 : 0)
      )
      openModal()
    },
  })

  const note = (
    <span style={{ color: theme.palette.error.main, marginLeft: 2 }}>*</span>
  )

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [isOpenModal, setIsOpenModal] = useState(false)

  const openModal = () => {
    setIsOpenModal(true)
  }
  const closeModal = () => {
    setIsOpenModal(false)
  }

  const handleAccept = () => {
    handleClose()
    dispatch(
      curriculumActions.deleteWaitCurriculum(
        formik.values.type === 'gov' ? 1 : 0,
        formik.values.letterNo,
        date
      )
    )
  }

  return (
    <>
      <Header />
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
              หนังสือเวียน : ออกหนังสือเวียน
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
            <form onSubmit={formik2.handleSubmit}>
              <Grid container item spacing={2}>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12}>
                    <Typography
                      component='h2'
                      variant='h6'
                      color='secondary'
                      className={classes.sectionSubtitle}
                    >
                      ส่งออกผลการรับรองคุณวุฒิ
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12}>
                    <Typography
                      gutterBottom
                      variant='body2'
                      color='primary'
                      style={{ fontWeight: 500 }}
                    >
                      <b>*</b> ส่งออก (Export)
                      ผลการรับรองคุณวุฒิที่จะนำไปออกหนังสือเวียน
                      เป็นไฟล์สเปรดชีต (.XLS)
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
                      ประเภทหลักสูตร
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <RadioGroup
                      row
                      id='type'
                      name='type'
                      value={formik2.values.type}
                      onChange={formik2.handleChange}
                    >
                      <FormControlLabel
                        value='gov'
                        control={<Radio size='small' />}
                        label='รัฐ'
                        style={{ marginRight: 96 }}
                      />
                      <FormControlLabel
                        value='org'
                        control={<Radio size='small' />}
                        label='เอกชน'
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<DownloadIcon />}
                    style={{ marginTop: 16 }}
                    type='submit'
                  >
                    ส่งออก
                  </Button>
                </Grid>
              </Grid>
            </form>
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
            <form onSubmit={formik.handleSubmit}>
              <Grid container item spacing={2}>
                <Grid container item direction='row' alignItems='flex-start'>
                  <Grid xs={12}>
                    <Typography
                      component='h2'
                      variant='h6'
                      color='secondary'
                      className={classes.sectionSubtitle}
                    >
                      ออกหนังสือเวียน
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12}>
                    <Typography
                      gutterBottom
                      variant='body2'
                      color='primary'
                      style={{ fontWeight: 500 }}
                    >
                      <b>*</b> ย้ายหลักสูตรที่มีผลการรับรองแล้วออกจากถังรอเวียน
                      ประชาชนทั่วไปจะสามารถค้นหาผลการรับรองได้ทันที
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
                      ประเภทหลักสูตร
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <RadioGroup
                      row
                      id='type'
                      name='type'
                      value={formik.values.type}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value='gov'
                        control={<Radio size='small' />}
                        label='รัฐ'
                        style={{ marginRight: 96 }}
                      />
                      <FormControlLabel
                        value='org'
                        control={<Radio size='small' />}
                        label='เอกชน'
                      />
                    </RadioGroup>
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
                      เลขที่หนังสือเวียน{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='letterNo'
                      name='letterNo'
                      value={formik.values.letterNo}
                      onChange={formik.handleChange}
                      placeholder=''
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Grid item xs={12} md={3}>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      style={{ fontWeight: 600 }}
                    >
                      วันที่ออกหนังสือเวียน{note}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker date={date} setDate={setDate} />
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<ExportIcon />}
                    style={{ marginTop: 16 }}
                    type='submit'
                    disabled={formik.values.letterNo === ''}
                  >
                    ออกหนังสือเวียน
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ออกหนังสือเวียน?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจหรือไม่ ว่าต้องการออกหนังสือเวียน{' '}
            <span
              style={{ fontWeight: 500, color: theme.palette.text.primary }}
            >
              หลักสูตรที่มีผลการรับรองแล้วจะถูกย้ายออกจากถังรอเวียน
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
      <PreviewModal isOpen={isOpenModal} onClose={closeModal} />
    </>
  )
}
