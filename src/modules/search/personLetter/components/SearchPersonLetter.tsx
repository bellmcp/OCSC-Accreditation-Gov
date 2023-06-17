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
  Select,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  FormControl,
  Paper,
  MenuItem,
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

export default function SearchPersonLetter() {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const validationSchema = yup.object({})

  const getLevelIdByLabel = (label: string) => {
    const result = educationLevels.find((item: any) => {
      return item.level === label
    })
    return get(result, 'id', 0)
  }

  const getFilterPayloadValue = (value: string) => {
    switch (value) {
      case 'thai':
        return 1
      case 'global':
        return 2
      case 'all':
      default:
        return 0
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      filter: 'all',
      nationalId: '',
      country: '',
      firstName: '',
      lastName: '',
      level: 0,
      university: '',
      faculty: '',
      degree: '',
      branch: '',
      appro: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        searchActions.searchPersonLetters({
          filter: getFilterPayloadValue(get(values, 'filter', 'all')),
          nationalId: get(values, 'nationalId', ''),
          country: get(values, 'country', ''),
          firstName: get(values, 'firstName', ''),
          lastName: get(values, 'lastName', ''),
          level: getLevelIdByLabel(get(values, 'level', 0)),
          university: get(values, 'university', ''),
          faculty: get(values, 'faculty', ''),
          degree: get(values, 'degree', ''),
          branch: get(values, 'branch', ''),
          appro: get(values, 'appro', ''),
        })
      )
    },
  })

  useEffect(() => {
    dispatch(searchActions.loadEducationlevels())
    return () => {
      dispatch(searchActions.clearSearchResult())
    }
  }, [dispatch])

  const note = (
    <span style={{ color: theme.palette.primary.main, marginLeft: 2 }}>*</span>
  )

  const [educationLevels, setEducationLevels] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [tableMaxWidth, setTableMaxWidth] = useState<any>('lg')

  const handleSwitchTableMaxWidth = () => {
    if (tableMaxWidth === 'lg') setTableMaxWidth(false)
    else setTableMaxWidth('lg')
  }

  const {
    educationLevels: initalEducationLevels = [],
    searchResults: initialSearchResults = [],
    isSearching = false,
  } = useSelector((state: any) => state.search)

  useEffect(() => {
    const parsed = initialSearchResults.map((item: any, index: number) => {
      return {
        order: index + 1,
        accreditation: get(item, 'accreditation1', ''),
        ...item,
      }
    })
    setSearchResults(parsed)
  }, [initialSearchResults])

  useEffect(() => {
    setEducationLevels(initalEducationLevels)
  }, [initalEducationLevels])

  const renderSearchResult = () => {
    if (isSearching) {
      return <Loading height={300}></Loading>
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
              <Grid item xs={6}>
                <Typography
                  component='h2'
                  variant='h6'
                  align={matches ? 'left' : 'center'}
                  className={classes.sectionTitle}
                >
                  ค้นหาการรับรองคุณวุฒิบุคคล
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
              }}
            >
              <Grid container item spacing={2}>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12} md={3}></Grid>
                  <Grid xs={12} md={9}>
                    <RadioGroup
                      row
                      id='filter'
                      name='filter'
                      value={formik.values.filter}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value='all'
                        control={<Radio size='small' />}
                        label='ทั้งหมด'
                        style={{ marginRight: 46 }}
                      />
                      <FormControlLabel
                        value='thai'
                        control={<Radio size='small' />}
                        label='ไทย'
                        style={{ marginRight: 46 }}
                      />
                      <FormControlLabel
                        value='global'
                        control={<Radio size='small' />}
                        label='เทศ'
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
                    >
                      เลขประจำตัวประชาชน
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='nationalId'
                      name='nationalId'
                      value={formik.values.nationalId}
                      onChange={formik.handleChange}
                      placeholder='เลขประจำตัวประชาชน 13 หลัก'
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container item direction='row' alignItems='center'>
                  <Grid xs={12} md={3}>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      style={{ fontWeight: 600 }}
                    >
                      ชื่อ
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='firstName'
                      name='firstName'
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                    >
                      นามสกุล
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='lastName'
                      name='lastName'
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                    >
                      ประเทศ
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='country'
                      name='country'
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                      ระดับการศึกษา
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <FormControl fullWidth size='small'>
                      <Select
                        id='level'
                        name='level'
                        value={formik.values.level}
                        onChange={formik.handleChange}
                        variant='outlined'
                        size='small'
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
                          if (selected === 0) {
                            return (
                              <span
                                style={{ color: theme.palette.text.secondary }}
                              >
                                เลือกระดับการศึกษา
                              </span>
                            )
                          }
                          return selected
                        }}
                      >
                        {educationLevels.map((educationLevel: any) => (
                          <MenuItem value={get(educationLevel, 'level', '')}>
                            {get(educationLevel, 'level', '')}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        <Typography variant='body2' color='textSecondary'>
                          ระดับปวช./ปวส.
                          ที่ใช้หลักสูตรกลางของอาชีวะไม่ต้องระบุสถานศึกษา
                        </Typography>
                      </FormHelperText>
                    </FormControl>
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
                      จะค้นจาก มหาวิทยาลัย หรือ คณะ หรือ ชื่อปริญญา หรือ
                      สาขาวิชา หรือ ผลการรับรอง หรือ ทั้งหมดก็ได้
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
                      มหาวิทยาลัย/สถาบันการศึกษา{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='university'
                      name='university'
                      value={formik.values.university}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                      คณะ/หน่วยงานที่เทียบเท่าคณะ{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='faculty'
                      name='faculty'
                      value={formik.values.faculty}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                      ชื่อปริญญา/ประกาศนียบัตร{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='degree'
                      name='degree'
                      value={formik.values.degree}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                      สาขาวิชา/วิชาเอก{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='branch'
                      name='branch'
                      value={formik.values.branch}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
                      ผลการรับรอง{note}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='appro'
                      name='appro'
                      value={formik.values.appro}
                      onChange={formik.handleChange}
                      placeholder='ใส่คำค้นหาได้ไม่เกิน 3 คำ เช่น กกก ขขข คคค หมายถึง ในชื่อต้องมีคำค้นหาทั้งหมดปรากฏอยู่'
                      variant='outlined'
                      size='small'
                      fullWidth
                      multiline={!matches}
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
