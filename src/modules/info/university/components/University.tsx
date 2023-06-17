import React, { useState, useEffect } from 'react'
import { get, isEmpty, isNull } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

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
  TextField,
  FormControl,
  IconButton,
  InputAdornment,
  Fab,
  Zoom,
  useScrollTrigger,
  Toolbar,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import Loading from 'modules/ui/components/Loading'
import Empty from 'modules/ui/components/Empty'
import DataTable from './DataTable'

import * as infoActions from 'modules/info/actions'
import { CountryType, UniversityType } from 'modules/info/types'

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
      marginBottom: '24px',
      lineHeight: '1.3',
    },
    table: {
      minWidth: 650,
    },
    root: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
  })
)

function createData(
  id: number,
  order: number,
  shortname: string,
  fullname: string,
  thainame: string,
  abbriviation: string
) {
  return {
    id,
    order,
    shortname,
    fullname,
    thainame,
    abbriviation,
  }
}

function createTableData(
  order: number,
  country: string,
  state: string,
  name: string,
  localname: string,
  place: string
) {
  return {
    order,
    country,
    state,
    name,
    localname,
    place,
  }
}

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

export default function University() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [tableData, setTableData] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [parsedUniversitiesData, setParsedUniversitiesData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const {
    countries: initialCountries = [],
    universities: initialUniversities = [],
    isLoading = false,
    isUniversitiesLoading = false,
  } = useSelector((state: any) => state.info)

  const handleChangeCountry = (event: any, newValue: string | null) => {
    setSelectedCountry(newValue)

    if (!isNull(newValue)) {
      const countryId = get(newValue, 'id', 0)
      dispatch(infoActions.loadUniversities(countryId))
    } else {
      setTableData([])
    }
  }

  useEffect(() => {
    const parsed = initialCountries.map((country: CountryType, index: number) =>
      createData(
        get(country, 'id', 0),
        index + 1,
        get(country, 'shortname'),
        get(country, 'fullname'),
        get(country, 'thainame'),
        get(country, 'abbriviation')
      )
    )
    setParsedData(parsed)
  }, [initialCountries])

  useEffect(() => {
    if (!isNull(selectedCountry)) {
      const parsed = initialUniversities.map(
        (university: UniversityType, index: number) =>
          createTableData(
            index + 1,
            get(university, 'country'),
            get(university, 'state'),
            get(university, 'name'),
            get(university, 'localname'),
            get(university, 'place')
          )
      )
      setParsedUniversitiesData(parsed)
      setTableData(parsed)
    }
  }, [initialUniversities, selectedCountry])

  const handleChangeSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value)
  }

  const handleClearSearchInput = () => {
    setSearchInput('')
  }

  useEffect(() => {
    if (searchInput === '') {
      setTableData(parsedUniversitiesData)
    } else {
      const lowerCaseInput = searchInput.toLowerCase()
      const searchResult = parsedUniversitiesData.filter(
        (university: UniversityType) =>
          get(university, 'country', '')
            .toLowerCase()
            .includes(lowerCaseInput) ||
          get(university, 'state', '').toLowerCase().includes(lowerCaseInput) ||
          get(university, 'name', '').toLowerCase().includes(lowerCaseInput) ||
          get(university, 'localname', '')
            .toLowerCase()
            .includes(lowerCaseInput) ||
          get(university, 'place', '').toLowerCase().includes(lowerCaseInput)
      )
      setTableData(searchResult)
    }
  }, [searchInput, parsedUniversitiesData])

  useEffect(() => {
    dispatch(infoActions.loadCountries())
  }, [dispatch])

  useEffect(() => {
    return () => {
      setSelectedCountry(null)
      setTableData([])
    }
  }, [])

  const renderResult = () => {
    if (!isLoading || !isUniversitiesLoading) {
      if (!isEmpty(tableData)) {
        return (
          <DataTable
            data={tableData}
            isUSA={get(selectedCountry, 'id', 0) === 840}
          />
        )
      } else if (isNull(selectedCountry)) {
        return (
          <Grid
            container
            justify='center'
            alignItems='center'
            style={{ height: 300 }}
          >
            <Typography variant='body2' color='textSecondary'>
              โปรดเลือกประเทศ
            </Typography>
          </Grid>
        )
      } else {
        return <Empty height={300} />
      }
    } else {
      return <Loading height={300} />
    }
  }

  return (
    <>
      <Toolbar id='back-to-top-anchor' />
      <Container maxWidth='lg' className={classes.content}>
        <Box mt={2} mb={4}>
          <Grid container direction='column'>
            <Typography
              gutterBottom
              component='h2'
              variant='h6'
              color='secondary'
              className={classes.sectionTitle}
              align={matches ? 'left' : 'center'}
            >
              ข้อมูลพื้นฐาน : มหาวิทยาลัย
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Paper
                elevation={0}
                style={{
                  borderRadius: 16,
                  padding: 24,
                  paddingTop: 18,
                  paddingBottom: 18,
                  marginBottom: 24,
                  boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                  border: '1px solid rgb(204 242 251)',
                }}
              >
                <Autocomplete
                  fullWidth
                  value={selectedCountry}
                  onChange={handleChangeCountry}
                  options={parsedData}
                  getOptionLabel={(option: any) =>
                    `${option.fullname} (${option.thainame})`
                  }
                  noOptionsText='ไม่พบผลลัพธ์'
                  filterOptions={(options, { inputValue }) =>
                    options.filter((item) => {
                      const lowerCaseInput = inputValue.toLowerCase()
                      return (
                        get(item, 'fullname', '')
                          .toLowerCase()
                          .includes(lowerCaseInput) ||
                        get(item, 'thainame', '')
                          .toLowerCase()
                          .includes(lowerCaseInput) ||
                        get(item, 'abbriviation', '')
                          .toLowerCase()
                          .includes(lowerCaseInput)
                      )
                    })
                  }
                  renderOption={(option: any) => {
                    return (
                      <Grid container spacing={1}>
                        <Grid item xs={1}>
                          <Typography
                            variant='body2'
                            color='textPrimary'
                            align='center'
                          >
                            {get(option, 'order', 0)}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant='body2' color='textPrimary'>
                            {get(option, 'fullname', '')}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant='body2' color='textPrimary'>
                            {get(option, 'thainame', '')}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography variant='body2' color='textPrimary'>
                            {get(option, 'abbriviation', '')}
                          </Typography>
                        </Grid>
                      </Grid>
                    )
                  }}
                  size='small'
                  renderInput={(params: any) => (
                    <TextField {...params} label='ประเทศ' variant='outlined' />
                  )}
                />
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper
                elevation={0}
                style={{
                  borderRadius: 16,
                  padding: 24,
                  paddingTop: 18,
                  paddingBottom: 18,
                  marginBottom: 24,
                  boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                  border: '1px solid rgb(204 242 251)',
                }}
              >
                <FormControl fullWidth size='small'>
                  <TextField
                    variant='outlined'
                    size='small'
                    placeholder='ค้นหา...'
                    fullWidth
                    value={searchInput}
                    onChange={handleChangeSearchInput}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon color='action' />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            onClick={handleClearSearchInput}
                            style={{
                              visibility:
                                searchInput === '' ? 'hidden' : 'visible',
                            }}
                          >
                            <ClearIcon color='action' fontSize='small' />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
          <Paper
            elevation={0}
            style={{
              borderRadius: 16,
              padding: 24,
              paddingTop: 12,
              boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
              border: '1px solid rgb(204 242 251)',
              minHeight: 300,
            }}
          >
            {renderResult()}
          </Paper>
        </Box>
        <ScrollTop>
          <Fab color='primary' size='medium'>
            <KeyboardArrowUpIcon style={{ color: 'white' }} />
          </Fab>
        </ScrollTop>
      </Container>
    </>
  )
}
