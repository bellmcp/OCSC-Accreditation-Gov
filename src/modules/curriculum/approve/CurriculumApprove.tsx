import React, { useState, useEffect } from 'react'
import { isEmpty, get } from 'lodash'
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
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  ButtonGroup,
  Divider,
  Hidden,
} from '@material-ui/core'
import { Stack } from '@mui/material'
import {
  Search as SearchIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  UnfoldLess as ShrinkIcon,
  UnfoldMore as ExpandIcon,
  Edit as EditIcon,
} from '@material-ui/icons'

import Header from 'modules/ui/components/Header'
import Loading from 'modules/ui/components/Loading'
import DataTableEdit from './DataTableEdit'

import * as curriculumActions from 'modules/curriculum/actions'
import * as infoActions from 'modules/info/actions'
import * as uiActions from 'modules/ui/actions'

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
    table: {
      minWidth: 650,
    },
  })
)

export default function CurriculumApprove() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [tableMaxWidth, setTableMaxWidth] = useState<any>('lg')
  const [searchResults, setSearchResults] = useState([])
  const [educationLevels, setEducationLevels] = useState([])
  const [isInEditMode, setIsInEditMode] = useState(false)

  const {
    isLocked = false,
    lockMessage,
    isSearching = false,
    waitCurriculums: initialSearchResults = [],
  } = useSelector((state: any) => state.curriculum)

  const { educationLevels: initalEducationLevels = [] } = useSelector(
    (state: any) => state.info
  )

  const getLevelIdByLabel = (label: string) => {
    const result = educationLevels.find((item: any) => {
      return item.level === label
    })
    return get(result, 'id', 0)
  }

  useEffect(() => {
    dispatch(curriculumActions.loadLockStatus())
    dispatch(infoActions.loadEducationLevels())
    return () => {
      dispatch(curriculumActions.clearSearchResult())
    }
  }, [dispatch])

  useEffect(() => {
    const parsed = initialSearchResults.map((item: any, index: number) => {
      return {
        order: index + 1,
        isGov: item.category === 'รัฐ' ? true : false,
        levelId: getLevelIdByLabel(get(item, 'level', '')),
        ...item,
      }
    })
    setSearchResults(parsed)
  }, [initialSearchResults]) //eslint-disable-line

  useEffect(() => {
    setEducationLevels(initalEducationLevels)
  }, [initalEducationLevels])

  const validationSchema = yup.object({})
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: 'gov',
      university: '',
      faculty: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const isGov = values.type === 'gov' ? 1 : 0
      dispatch(
        curriculumActions.loadWaitCurriculum(
          isGov,
          values.university,
          values.faculty
        )
      )
    },
  })

  const lock = () => {
    if (isInEditMode) {
      dispatch(
        uiActions.setFlashMessage(
          '<b>ไม่สามารถล็อคได้</b><br/>โปรดออกจากโหมดการแก้ไขข้อมูล และลองใหม่อีกครั้ง',
          'error'
        )
      )
    } else {
      dispatch(curriculumActions.lockRequest())
    }
  }

  const unlock = () => {
    dispatch(curriculumActions.unlockRequest())
  }

  const handleSwitchTableMaxWidth = () => {
    if (tableMaxWidth === 'lg') setTableMaxWidth(false)
    else setTableMaxWidth('lg')
  }

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
              {isLocked ? (
                <Typography
                  variant='body2'
                  color='error'
                  style={{ fontWeight: 500, paddingBottom: 24 }}
                >
                  <b>*</b> ไม่สามารถแก้ไขข้อมูลในตารางได้เนื่องจากถูกล็อค
                  หากต้องการแก้ไขโปรด 'ปลดล็อค'
                </Typography>
              ) : (
                <Typography
                  variant='body2'
                  color='primary'
                  style={{ fontWeight: 500, paddingBottom: 24 }}
                >
                  <b>*</b> โปรดคลิกไอคอน{' '}
                  <EditIcon style={{ fontSize: 20, marginBottom: '-5px' }} />{' '}
                  ที่คอลัมน์ 'จัดการข้อมูล' ของแต่ละแถวเพื่อเริ่มแก้ไขข้อมูล
                </Typography>
              )}
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
              <DataTableEdit
                data={searchResults}
                isLocked={isLocked}
                isInEditMode={isInEditMode}
                setIsInEditMode={setIsInEditMode}
              />
            </Paper>
          </Box>
        )
      }
    }
  }

  return (
    <>
      <Header />
      <Container maxWidth='lg' className={classes.content}>
        <form onSubmit={formik.handleSubmit}>
          <Box mt={2} mb={4}>
            <Grid container justify={matches ? 'space-between' : 'center'}>
              <Typography
                gutterBottom
                component='h2'
                variant='h6'
                color='secondary'
                className={classes.sectionTitle}
                align={matches ? 'left' : 'center'}
              >
                หนังสือเวียน : รับรองหลักสูตรใหม่
              </Typography>
              <Stack
                spacing={2}
                direction='column'
                alignItems={matches ? 'flex-end' : 'center'}
                style={{ marginBottom: 24 }}
              >
                <ButtonGroup>
                  <Button
                    variant={!isLocked ? 'contained' : 'outlined'}
                    color='secondary'
                    startIcon={<LockIcon />}
                    onClick={lock}
                  >
                    ล็อค
                  </Button>
                  <Button
                    variant={isLocked ? 'contained' : 'outlined'}
                    color='secondary'
                    startIcon={<UnlockIcon />}
                    onClick={unlock}
                    disabled={!isLocked}
                  >
                    ปลดล็อค
                  </Button>
                </ButtonGroup>
                {lockMessage && (
                  <Typography
                    variant='body2'
                    color='error'
                    style={{ fontWeight: 500 }}
                    align={matches ? 'right' : 'center'}
                  >
                    {lockMessage}
                  </Typography>
                )}
              </Stack>
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
                        label='หลักสูตรของรัฐ'
                        style={{ marginRight: 96 }}
                      />
                      <FormControlLabel
                        value='org'
                        control={<Radio size='small' />}
                        label='หลักสูตรของเอกชน'
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
                      มหาวิทยาลัย/สถาบันการศึกษา
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='university'
                      name='university'
                      value={formik.values.university}
                      onChange={formik.handleChange}
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
                      gutterBottom
                    >
                      คณะ/หน่วยงานที่เทียบเท่าคณะ
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={9}>
                    <TextField
                      id='faculty'
                      name='faculty'
                      value={formik.values.faculty}
                      onChange={formik.handleChange}
                      variant='outlined'
                      size='small'
                      fullWidth
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
    </>
  )
}
