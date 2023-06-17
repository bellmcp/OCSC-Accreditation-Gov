import React, { useState, useEffect } from 'react'
import { get, isEmpty } from 'lodash'
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
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import Loading from 'modules/ui/components/Loading'
import Empty from 'modules/ui/components/Empty'
import DataTable from './DataTable'

import * as infoActions from 'modules/info/actions'
import { CountryType } from 'modules/info/types'

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
  shortname: string,
  fullname: string,
  thainame: string,
  abbriviation: string
) {
  return {
    id,
    shortname,
    fullname,
    thainame,
    abbriviation,
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

export default function Country() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [tableData, setTableData] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [searchInput, setSearchInput] = useState('')

  const { countries: initialCountries = [], isLoading = false } = useSelector(
    (state: any) => state.info
  )

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
      setTableData(parsedData)
    } else {
      const lowerCaseInput = searchInput.toLowerCase()
      const searchResult = parsedData.filter(
        (country: CountryType) =>
          get(country, 'fullname', '').toLowerCase().includes(lowerCaseInput) ||
          get(country, 'thainame', '').toLowerCase().includes(lowerCaseInput) ||
          get(country, 'abbriviation', '')
            .toLowerCase()
            .includes(lowerCaseInput)
      )
      setTableData(searchResult)
    }
  }, [searchInput, parsedData])

  useEffect(() => {
    dispatch(infoActions.loadCountries())
  }, [dispatch])

  useEffect(() => {
    const parsed = initialCountries.map((country: CountryType, index: number) =>
      createData(
        index + 1,
        get(country, 'shortname'),
        get(country, 'fullname'),
        get(country, 'thainame'),
        get(country, 'abbriviation')
      )
    )
    setParsedData(parsed)
    setTableData(parsed)
  }, [initialCountries])

  const renderResult = () => {
    if (!isLoading) {
      if (!isEmpty(tableData)) {
        return <DataTable data={tableData} />
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
              ข้อมูลพื้นฐาน : ประเทศ
            </Typography>
          </Grid>
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
                          visibility: searchInput === '' ? 'hidden' : 'visible',
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
