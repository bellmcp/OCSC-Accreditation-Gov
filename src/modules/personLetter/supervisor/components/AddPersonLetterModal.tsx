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
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core'
import Stack from '@mui/material/Stack'

import * as personLetterActions from 'modules/personLetter/actions'
import DatePicker from './DatePicker'

interface AddPersonLetterModalProps {
  open: boolean
  handleClose: () => void
  currentSearchQuery: any
}

export default function AddPersonLetterModal({
  open,
  handleClose,
  currentSearchQuery,
}: AddPersonLetterModalProps) {
  const dispatch = useDispatch()
  const theme = useTheme()

  const note = (
    <span style={{ color: theme.palette.error.main, marginLeft: 2 }}>*</span>
  )

  const [workers, setWorkers] = useState([])
  const [date, setDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString()
  )

  const { workers: initialWorkers = [] } = useSelector(
    (state: any) => state.personLetter
  )

  const getWorkerIdByName = (name: any) => {
    const result = workers.find((item: any) => {
      return item.name === name
    })
    return get(result, 'id', null)
  }

  useEffect(() => {
    setWorkers(initialWorkers)
  }, [initialWorkers])

  const validationSchema = yup.object({})
  const formik = useFormik({
    initialValues: {
      letterno: '',
      letterdate: date,
      letteragency: '',
      note: '',
      workerid: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        personLetterActions.addPersonLetter({
          letterno: get(values, 'letterno', ''),
          letterdate: date,
          letteragency: get(values, 'letteragency', ''),
          note: get(values, 'note', ''),
          workerid: getWorkerIdByName(get(values, 'workerid', '')),
          currentSearchQuery,
        })
      )
      onCloseModal()
      dispatch(personLetterActions.clearSearchResult())
    },
  })

  const onCloseModal = () => {
    handleClose()
    setDate(format(new Date(), 'yyyy-MM-dd').toString())
    formik.resetForm()
  }

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
          <Grid container alignItems='flex-end' justify='space-between'>
            <Typography
              color='secondary'
              variant='h6'
              style={{ fontWeight: 600 }}
            >
              เพิ่มหนังสือเข้า
            </Typography>
            <Typography
              variant='body2'
              color='error'
              style={{ fontWeight: 500 }}
            >
              <b>*</b> จำเป็น
            </Typography>
          </Grid>
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
                  เลขที่หนังสือเข้า{note}
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
                  วันที่หนังสือเข้า{note}
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
                  หน่วยงานที่ส่งหนังสือเข้า{note}
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
                  หมายเหตุ (ถ้ามี)
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
                  ผู้ปฏิบัติงาน{note}
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
                    // size='small'
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
                      return selected
                    }}
                  >
                    {workers.map((worker: any) => (
                      <MenuItem value={get(worker, 'name', '')}>
                        {get(worker, 'name', '')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            autoFocus
            type='submit'
            disabled={
              formik.values.letteragency === '' ||
              formik.values.letterno === '' ||
              formik.values.workerid === null
            }
          >
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
