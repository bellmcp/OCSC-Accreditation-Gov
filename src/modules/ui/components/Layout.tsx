// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import LoadingBar from 'react-redux-loading-bar'
import { CssBaseline, Snackbar, IconButton } from '@material-ui/core'
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles'
import { Close as CloseIcon } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

import * as actions from '../actions'
import NavBar from './NavBar'
import Routes from './Routes'
import Footer from './Footer'

import { navigationItems } from '../navigation'

export default function Layout() {
  const { pathname } = useLocation()
  const PATH = process.env.REACT_APP_BASE_PATH
  const dispatch = useDispatch()
  const { isSnackbarOpen, flashMessage, alertType } = useSelector(
    (state) => state.ui
  )
  const closeFlashMessage = () => dispatch(actions.clearFlashMessage())

  useEffect(() => {
    const currentNavigationItem = navigationItems.find((navigationItem: any) => {
      return navigationItem.url === pathname
    })
    currentNavigationItem
      ? setActivePage(currentNavigationItem.id)
      : setActivePage(999)
  }, [pathname]) //eslint-disable-line

  const [activePage, setActivePage] = useState(0)

  const defaultTheme = createMuiTheme()

  const theme = createMuiTheme({
    typography: {
      fontFamily: ['Prompt', 'sans-serif'].join(','),
    },
    overrides: {
      MuiAccordion: {
        root: {
          '&:before': {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiButton: {
        root: {
          borderRadius: 24,
        },
      },
      MuiToolbar: {
        gutters: {
          [defaultTheme.breakpoints.up('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
      MuiCardContent: {
        root: {
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    breakpoints: {
      values: {
        sm: 670,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        main: process.env.REACT_APP_PRIMARY_COLOR_HEX,
      },
      secondary: {
        main: process.env.REACT_APP_SECONDARY_COLOR_HEX,
      },
      background: {
        default: '#f7feff',
      },
    },
  })

  const isPreviewPage = pathname.includes(`${PATH}/preview`)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingBar
        maxProgress={100}
        updateTime={100}
        style={{
          zIndex: 9999999999,
          height: 2,
          backgroundColor: theme.palette.primary.main,
          transition: 'all 5s ease 3s',
          position: 'fixed',
        }}
      />
      {!isPreviewPage && (
        <NavBar activePage={activePage} setActivePage={setActivePage} />
      )}
      <Routes />
      <Snackbar
        open={isSnackbarOpen}
        onClose={closeFlashMessage}
        message={flashMessage}
        autoHideDuration={6000}
        action={
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={closeFlashMessage}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      >
        <Alert
          onClose={closeFlashMessage}
          severity={alertType ? alertType : 'info'}
          elevation={6}
          variant='filled'
        >
          <div
            dangerouslySetInnerHTML={{
              __html: flashMessage,
            }}
          ></div>
        </Alert>
      </Snackbar>
      {!isPreviewPage && <Footer />}
    </ThemeProvider>
  )
}
