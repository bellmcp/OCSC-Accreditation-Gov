// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { get, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { format, subMonths } from 'date-fns'
import * as yup from 'yup'

import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles'
import {
  useMediaQuery,
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Paper,
  Divider,
  Fab,
  Zoom,
  useScrollTrigger,
  Toolbar,
  Hidden,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'
import Stack from '@mui/material/Stack'
import {
  Search as SearchIcon,
  UnfoldLess as ShrinkIcon,
  UnfoldMore as ExpandIcon,
  Add as AddIcon,
} from '@material-ui/icons'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import * as requestActions from 'modules/request/actions'
import Loading from 'modules/ui/components/Loading'
import DataTable from './DataTable'
import DatePicker from './DatePicker'
import CreateModal from './CreateModal'

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

function ScrollTop(props: any) {
  const { children } = props
  const classes = useStyles()
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor')

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role='presentation' className={classes.root}>
        {children}
      </div>
    </Zoom>
  )
}

export default function Request() {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()
  const [submitData, setSubmitData] = useState({})

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      letterNo: null,
      startDate: null,
      endDate: null,
      status1: true,
      status2: true,
      status3: true,
      status4: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        letterNo: get(values, 'letterNo', null),
        startDate,
        endDate,
        status1,
        status2,
        status3,
        status4,
      }
      submitSearch(data)
      setSubmitData(data)
    },
  })

  const submitSearch = (data) => {
    dispatch(requestActions.searchPersonLetter(data))
  }

  useEffect(() => {
    return () => {
      dispatch(requestActions.clearSearchResult())
    }
  }, [dispatch])

  const [searchResults, setSearchResults] = useState([])
  const [tableMaxWidth, setTableMaxWidth] = useState<any>('lg')
  const [startDate, setStartDate] = useState<string>(
    format(subMonths(new Date(), 6), 'yyyy-MM-dd').toString()
  )
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString()
  )

  const [status1, setStatus1] = useState<boolean>(true)
  const [status2, setStatus2] = useState<boolean>(true)
  const [status3, setStatus3] = useState<boolean>(true)
  const [status4, setStatus4] = useState<boolean>(true)

  const handleChangeStatus1 = (event: any) => {
    setStatus1(event.target.checked)
  }

  const handleChangeStatus2 = (event: any) => {
    setStatus2(event.target.checked)
  }

  const handleChangeStatus3 = (event: any) => {
    setStatus3(event.target.checked)
  }

  const handleChangeStatus4 = (event: any) => {
    setStatus4(event.target.checked)
  }

  const [isOpenModal, setIsOpenModal] = useState(false)
  const handleClickCreateRequest = () => {
    setIsOpenModal(true)
  }
  const onCloseModal = () => {
    setIsOpenModal(false)
  }

  const handleSwitchTableMaxWidth = () => {
    if (tableMaxWidth === 'lg') setTableMaxWidth(false)
    else setTableMaxWidth('lg')
  }

  const { searchResults: initialSearchResults = [], isSearching = false } =
    useSelector((state: any) => state.request)

  useEffect(() => {
    const parsed = initialSearchResults.map((item: any, index: number) => {
      return {
        order: index + 1,
        appro: get(item, 'id', null),
        ...item,
      }
    })
    setSearchResults(parsed)
  }, [initialSearchResults])

  const renderSearchResult = () => {
    if (isSearching) {
      return <Loading height={300} />
    } else {
      if (isEmpty(searchResults)) {
        return <></>
      } else {
        return (
          <Box mb={4}>
            <Box mt={6} mb={4}>
              <Divider />
            </Box>
            <Container
              maxWidth='lg'
              style={{ padding: tableMaxWidth === 'lg' ? 0 : '0 24px' }}
            >
              <Grid
                container
                justify='space-between'
                style={{ margin: '24px 0' }}
              >
                <Typography
                  component='h2'
                  variant='h6'
                  className={classes.sectionTitle}
                >
                  ผลการค้นหา
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Hidden mdDown>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={handleSwitchTableMaxWidth}
                      startIcon={
                        tableMaxWidth === 'lg' ? (
                          <ExpandIcon style={{ transform: 'rotate(90deg)' }} />
                        ) : (
                          <ShrinkIcon style={{ transform: 'rotate(90deg)' }} />
                        )
                      }
                    >
                      {tableMaxWidth === 'lg' ? 'ขยาย' : 'ย่อ'}ตาราง
                    </Button>
                  </Hidden>
                </Stack>
              </Grid>
            </Container>
            <Paper
              elevation={0}
              style={{
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                border: '1px solid rgb(204 242 251)',
                minHeight: 300,
              }}
            >
              <DataTable data={searchResults} loading={isSearching} />
            </Paper>
          </Box>
        )
      }
    }
  }

  return (
    <>
      <Toolbar id='back-to-top-anchor' />
      <Container maxWidth='lg' className={classes.content}>
        <form onSubmit={formik.handleSubmit}>
          <Box mt={2} mb={4}>
            <Grid
              container
              direction={matches ? 'row' : 'column'}
              justify={matches ? 'space-between' : 'center'}
              alignItems='center'
              style={{ marginBottom: 16 }}
              spacing={1}
            >
              <Grid item xs={12} md={10}>
                <Typography
                  component='h2'
                  variant='h6'
                  align={matches ? 'left' : 'center'}
                  className={classes.sectionTitle}
                >
                  คำร้องขอตรวจสอบคุณวุฒิที่ยื่นผ่านช่องทางอิเล็กทรอนิกส์
                  (จากใหม่ไปเก่า)
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                container
                direction='column'
                alignItems={matches ? 'flex-end' : 'center'}
                spacing={0}
              >
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<AddIcon />}
                  onClick={handleClickCreateRequest}
                >
                  ยื่นคำร้องใหม่
                </Button>
              </Grid>
            </Grid>
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
                      เลขที่หนังสือเข้า
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                      id='letterNo'
                      name='letterNo'
                      placeholder='เลขที่หนังสือเข้า'
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
                      วันที่หนังสือเข้า (เริ่มต้น)
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <DatePicker date={startDate} setDate={setStartDate} />
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
                      วันที่หนังสือเข้า (สิ้นสุด)
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12} md={3}>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      style={{ fontWeight: 600 }}
                    >
                      สถานะ
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={status1}
                            onChange={handleChangeStatus1}
                            name='inprogress'
                          />
                        }
                        label='อยู่ระหว่างดำเนินการ'
                        style={{ marginRight: 46 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={status2}
                            onChange={handleChangeStatus2}
                            name='pending'
                          />
                        }
                        label='รออนุมัติ'
                        style={{ marginRight: 46 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={status3}
                            onChange={handleChangeStatus3}
                            name='done'
                          />
                        }
                        label='เสร็จสิ้น'
                        style={{ marginRight: 46 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={status4}
                            onChange={handleChangeStatus4}
                            name='cancelled'
                          />
                        }
                        label='ยกเลิก'
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              startIcon={<SearchIcon />}
              style={{ marginTop: 32 }}
              type='submit'
            >
              ค้นหา
            </Button>
          </Box>
        </form>
      </Container>
      <Container maxWidth={tableMaxWidth} style={{ marginBottom: 36 }}>
        {renderSearchResult()}
      </Container>
      <ScrollTop>
        <Fab color='primary' size='medium'>
          <KeyboardArrowUpIcon style={{ color: 'white' }} />
        </Fab>
      </ScrollTop>
      <CreateModal isOpen={isOpenModal} onCancel={onCloseModal} submitSearch={submitSearch} searchQuery={submitData}/>
    </>
  )
}
