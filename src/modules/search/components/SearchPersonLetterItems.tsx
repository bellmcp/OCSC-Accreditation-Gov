// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { get, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
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
} from '@material-ui/core'
import Stack from '@mui/material/Stack'
import {
  Search as SearchIcon,
  UnfoldLess as ShrinkIcon,
  UnfoldMore as ExpandIcon,
} from '@material-ui/icons'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import * as searchActions from 'modules/search/actions'
import Loading from 'modules/ui/components/Loading'
import DataTable from './DataTable'
import DatePicker from './DatePicker'

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

export default function SearchPersonLetterItems() {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      letterNo: null,
      letterDate: null,
      nationalId: null,
      name: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        searchActions.searchPersonLetterItems({
          letterNo: get(values, 'letterNo', null),
          letterDate: get(values, 'letterDate', null),
          nationalId: get(values, 'nationalId', null),
          name: get(values, 'name', null),
        })
      )
    },
  })

  useEffect(() => {
    return () => {
      dispatch(searchActions.clearSearchResult())
    }
  }, [dispatch])

  const note = (
    <span style={{ color: theme.palette.primary.main, marginLeft: 2 }}>*</span>
  )

  const [searchResults, setSearchResults] = useState([])
  const [tableMaxWidth, setTableMaxWidth] = useState<any>('lg')
  const [date, setDate] = useState<string>(null)

  const handleSwitchTableMaxWidth = () => {
    if (tableMaxWidth === 'lg') setTableMaxWidth(false)
    else setTableMaxWidth('lg')
  }

  const { searchResults: initialSearchResults = [], isSearching = false } =
    useSelector((state: any) => state.search)

  useEffect(() => {
    const parsed = initialSearchResults.map((item: any, index: number) => {
      return {
        order: index + 1,
        fullName: `${get(item, 'title', '')} ${get(
          item,
          'firstName',
          ''
        )} ${get(item, 'lastName', '')}`,
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
              direction='row'
              justify={matches ? 'space-between' : 'center'}
              alignItems='center'
              style={{ marginBottom: 24 }}
            >
              <Grid item xs={12}>
                <Typography
                  component='h2'
                  variant='h6'
                  className={classes.sectionTitle}
                >
                  ค้นหาหนังสือรับรองคุณวุฒิที่ยื่นผ่านช่องทางอิเล็กทรอนิกส์
                </Typography>
              </Grid>
            </Grid>
            <Paper
              elevation={0}
              style={{
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                border: '1px solid rgb(204 242 251)',
                minHeight: 300,
                marginTop: 24,
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
                      <b>*</b> ไม่จำเป็นต้องระบุข้อมูลที่ใช้ค้นหาครบทุกฟิลด์
                    </Typography>
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
                      เลขที่หนังสือนำส่งสำนักงาน ก.พ.{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                      id='university'
                      name='university'
                      placeholder='เลขที่หนังสือนำส่งสำนักงาน ก.พ.'
                      value={formik.values.university}
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
                      ลงวันที่{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <DatePicker date={date} setDate={setDate} />
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
                      เลขประจำตัวประชาชน{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                      id='degree'
                      name='degree'
                      placeholder='เลขประจำตัวประชาชน'
                      value={formik.values.degree}
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
                      ชื่อ หรือ นามสกุล{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                      id='branch'
                      name='branch'
                      placeholder='ชื่อ หรือ นามสกุล'
                      value={formik.values.branch}
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
    </>
  )
}
