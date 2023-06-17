import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { format } from 'date-fns'

import { useTheme } from '@material-ui/core/styles'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core'
import Stack from '@mui/material/Stack'
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  WatchLater as PendingIcon,
  PlayCircleFilled as InProgressIcon,
  Launch as LaunchIcon,
} from '@material-ui/icons'
import { green, red, amber, indigo } from '@material-ui/core/colors'

import * as personLetterActions from 'modules/personLetter/actions'
import DatePicker from './DatePicker'

// const PATH = process.env.REACT_APP_BASE_PATH

interface EditPersonLetterModalProps {
  data: any
  open: boolean
  handleClose: () => void
  currentSearchQuery: any
  handleClickLink: any
}

export default function EditPersonLetterModal({
  data,
  open,
  handleClose,
  currentSearchQuery,
  handleClickLink,
}: EditPersonLetterModalProps) {
  const dispatch = useDispatch()
  const theme = useTheme()

  const [workers, setWorkers] = useState([])
  const [workStatus, setWorkStatus] = useState([])

  const [date, setDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString()
  )
  const [replyDate, setReplyDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString()
  )

  const { workers: initialWorkers = [], workStatus: initialWorkStatus = [] } =
    useSelector((state: any) => state.personLetter)

  const getWorkerNameById = (id: any) => {
    const result = workers.find((worker: any) => worker.id === id)
    return get(result, 'name', '')
  }

  const getStatusNameById = (id: any) => {
    const result = workStatus.find((status: any) => status.id === id)
    return get(result, 'status', '')
  }

  useEffect(() => {
    setWorkers(initialWorkers)
  }, [initialWorkers])

  useEffect(() => {
    setWorkStatus(initialWorkStatus)
  }, [initialWorkStatus])

  const validationSchema = yup.object({})
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      letterno: get(data, 'letterNo', ''),
      letterdate: get(data, 'letterDate', ''),
      letteragency: get(data, 'letterAgency', ''),
      note: get(data, 'note', ''),
      workerid: get(data, 'workerId', null),
      numthdegs: get(data, 'numThDegs', null),
      numnonthdegs: get(data, 'numNonThDegs', null),
      uploadfile: get(data, 'uploadFile', ''),
      uploaddate: get(data, 'uploadDate', ''),
      replyno: get(data, 'replyNo', ''),
      replydate: get(data, 'replyDate', ''),
      status: get(data, 'statusId', ''),
      lastupdate: get(data, 'lastUpdate', ''),
      supervisor: get(data, 'supervisor', ''),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        personLetterActions.editPersonLetter({
          letterid: get(data, 'id', ''),
          letterno: get(values, 'letterno', ''),
          letterdate: date,
          letteragency: get(values, 'letteragency', ''),
          note: get(values, 'note', ''),
          workerid: get(values, 'workerid', ''),
          replyno: get(values, 'replyno', ''),
          replydate: replyDate,
          statusid: get(values, 'status', ''),
          currentSearchQuery,
        })
      )
      onCloseModal()
      // dispatch(personLetterActions.clearSearchResult())
    },
  })

  const onCloseModal = () => {
    handleClose()
    setDate(get(data, 'letterDate', ''))
    setReplyDate(get(data, 'replyDate', ''))
    formik.resetForm()
  }

  useEffect(() => {
    setDate(get(data, 'letterDate', ''))
    setReplyDate(get(data, 'replyDate', ''))
  }, [data])

  return (
    <Dialog
      open={open}
      onClose={onCloseModal}
      PaperProps={{
        style: { borderRadius: 16, padding: 8 },
      }}
      fullWidth
      maxWidth='sm'
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography
            color='secondary'
            variant='h6'
            style={{ fontWeight: 600 }}
          >
            แก้ไขหนังสือเข้า
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  เลขที่หนังสือเข้า
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='letterno'
                  name='letterno'
                  value={formik.values.letterno}
                  onChange={formik.handleChange}
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  วันที่หนังสือเข้า
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker date={date} setDate={setDate} />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  หน่วยงานที่ส่งหนังสือเข้า
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='letteragency'
                  name='letteragency'
                  value={formik.values.letteragency}
                  onChange={formik.handleChange}
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  หมายเหตุ
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='note'
                  name='note'
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  variant='outlined'
                  size='small'
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  ผู้ปฏิบัติงาน
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size='small'>
                  <Select
                    id='workerid'
                    name='workerid'
                    value={formik.values.workerid}
                    onChange={formik.handleChange}
                    variant='outlined'
                    displayEmpty
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    renderValue={(selected) => {
                      if (selected === null) {
                        return (
                          <span style={{ color: theme.palette.text.secondary }}>
                            เลือกผู้ปฏิบัติงาน
                          </span>
                        )
                      }
                      return getWorkerNameById(selected)
                    }}
                  >
                    {workers.map((worker: any) => (
                      <MenuItem value={get(worker, 'id', '')}>
                        {get(worker, 'name', '')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  style={{ fontWeight: 600 }}
                >
                  จำนวนคุณวุฒิ (ไทย)
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id='numthdegs'
                  name='numthdegs'
                  value={formik.values.numthdegs}
                  onChange={formik.handleChange}
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  style={{ fontWeight: 600 }}
                >
                  จำนวนคุณวุฒิ (เทศ)
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id='numnonthdegs'
                  name='numnonthdegs'
                  value={formik.values.numnonthdegs}
                  onChange={formik.handleChange}
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  style={{ fontWeight: 600 }}
                >
                  ไฟล์งาน
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {get(data, 'uploadFile', null) !== null && (
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <Link
                      // href={`${PATH}/preview?file=${get(
                      //   data,
                      //   'uploadFile',
                      //   null
                      // )}`}
                      // target='_blank'
                      color='primary'
                      underline='hover'
                      onClick={() =>
                        handleClickLink(get(data, 'uploadFile', null))
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <Stack direction='row' alignItems='center' spacing={1}>
                        <LaunchIcon fontSize='small' />
                        <div>เปิดไฟล์</div>
                      </Stack>
                    </Link>
                  </Stack>
                )}
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  style={{ fontWeight: 600 }}
                >
                  วันที่อัพโหลด
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id='uploaddate'
                  name='uploaddate'
                  value={formik.values.uploaddate}
                  onChange={formik.handleChange}
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  เลขที่หนังสือออก
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='replyno'
                  name='replyno'
                  value={formik.values.replyno}
                  onChange={formik.handleChange}
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  วันที่หนังสือออก
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker date={replyDate} setDate={setReplyDate} />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textPrimary'
                  style={{ fontWeight: 600 }}
                >
                  สถานะ
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size='small'>
                  <Select
                    id='status'
                    name='status'
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    variant='outlined'
                    displayEmpty
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    renderValue={(selected) => {
                      const value = getStatusNameById(selected)

                      if (selected === null) {
                        return (
                          <span style={{ color: theme.palette.text.secondary }}>
                            เลือกสถานะ
                          </span>
                        )
                      }

                      switch (value) {
                        case 'อยู่ระหว่างดำเนินการ':
                          return (
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={1}
                            >
                              <InProgressIcon
                                style={{
                                  color: indigo[800],
                                }}
                              />
                              <Typography
                                variant='body1'
                                style={{
                                  color: indigo[800],
                                  fontWeight: 600,
                                }}
                              >
                                อยู่ระหว่างดำเนินการ
                              </Typography>
                            </Stack>
                          )
                        case 'รออนุมัติ':
                          return (
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={1}
                            >
                              <PendingIcon
                                style={{
                                  color: amber[800],
                                }}
                              />
                              <Typography
                                variant='body1'
                                style={{ color: amber[800], fontWeight: 600 }}
                              >
                                รออนุมัติ
                              </Typography>
                            </Stack>
                          )
                        case 'เสร็จสิ้น':
                          return (
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={1}
                            >
                              <CheckIcon
                                style={{
                                  color: green[800],
                                }}
                              />
                              <Typography
                                variant='body1'
                                style={{ color: green[800], fontWeight: 600 }}
                              >
                                เสร็จสิ้น
                              </Typography>
                            </Stack>
                          )
                        case 'ยกเลิก':
                          return (
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={1}
                            >
                              <CancelIcon
                                style={{
                                  color: red[800],
                                }}
                              />
                              <Typography
                                variant='body1'
                                style={{ color: red[800], fontWeight: 600 }}
                              >
                                ยกเลิก
                              </Typography>
                            </Stack>
                          )
                        default:
                          return <></>
                      }
                    }}
                  >
                    {workStatus.map((status: any) => {
                      const value = get(status, 'status', '')

                      switch (value) {
                        case 'อยู่ระหว่างดำเนินการ':
                          return (
                            <MenuItem value={get(status, 'id', '')}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <InProgressIcon
                                  style={{
                                    color: indigo[800],
                                  }}
                                />
                                <Typography
                                  variant='body1'
                                  style={{
                                    color: indigo[800],
                                    fontWeight: 600,
                                  }}
                                >
                                  อยู่ระหว่างดำเนินการ
                                </Typography>
                              </Stack>
                            </MenuItem>
                          )
                        case 'รออนุมัติ':
                          return (
                            <MenuItem value={get(status, 'id', '')}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <PendingIcon
                                  style={{
                                    color: amber[800],
                                  }}
                                />
                                <Typography
                                  variant='body1'
                                  style={{ color: amber[800], fontWeight: 600 }}
                                >
                                  รออนุมัติ
                                </Typography>
                              </Stack>
                            </MenuItem>
                          )
                        case 'เสร็จสิ้น':
                          return (
                            <MenuItem value={get(status, 'id', '')}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <CheckIcon
                                  style={{
                                    color: green[800],
                                  }}
                                />
                                <Typography
                                  variant='body1'
                                  style={{ color: green[800], fontWeight: 600 }}
                                >
                                  เสร็จสิ้น
                                </Typography>
                              </Stack>
                            </MenuItem>
                          )
                        case 'ยกเลิก':
                          return (
                            <MenuItem value={get(status, 'id', '')}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <CancelIcon
                                  style={{
                                    color: red[800],
                                  }}
                                />
                                <Typography
                                  variant='body1'
                                  style={{ color: red[800], fontWeight: 600 }}
                                >
                                  ยกเลิก
                                </Typography>
                              </Stack>
                            </MenuItem>
                          )
                        default:
                          return <></>
                      }
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  style={{ fontWeight: 600 }}
                >
                  วันที่อัพเดทล่าสุด
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id='lastupdate'
                  name='lastupdate'
                  value={formik.values.lastupdate}
                  onChange={formik.handleChange}
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  style={{ fontWeight: 600 }}
                >
                  โดย
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id='supervisor'
                  name='supervisor'
                  value={formik.values.supervisor}
                  onChange={formik.handleChange}
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions style={{ paddingTop: 16 }}>
          <Button onClick={onCloseModal} variant='outlined'>
            ยกเลิก
          </Button>
          <Button
            color='secondary'
            variant='contained'
            type='submit'
            disabled={
              !(
                formik.dirty ||
                get(data, 'letterDate', '') !== date ||
                get(data, 'replyDate', '') !== replyDate
              )
            }
          >
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
