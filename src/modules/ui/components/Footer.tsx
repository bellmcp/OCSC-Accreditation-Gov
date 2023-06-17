import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  useMediaQuery,
  Typography,
  Container,
  Link,
  Grid,
  Box,
} from '@material-ui/core'

import * as uiActions from '../actions'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    color: theme.palette.common.white,
    padding: theme.spacing(6, 2),
    marginTop: 'auto',
    backgroundImage: `linear-gradient(180deg, #09348b, #06225b)`,
  },
  link: {
    color: process.env.REACT_APP_TERTIARY_COLOR_HEX,
  },
}))

const OCSC_NAME_TH = 'สำนักงานคณะกรรมการข้าราชการพลเรือน (สำนักงาน ก.พ.)'
const OCSC_NAME_EN = 'Office of the Civil Service Commission (OCSC)'
const OCSC_URL = 'https://www.ocsc.go.th/'

export default function Footer() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isFhdUp = useMediaQuery('(min-width:1080px)')

  const { footerInfo } = useSelector((state: any) => state.ui)
  const { value1 = '', value2 = '', value3 = '', value4 = '' } = footerInfo

  useEffect(() => {
    if (isEmpty(footerInfo)) {
      const footer_info_action = uiActions.loadFooterInfo()
      dispatch(footer_info_action)
    }
  }, [dispatch]) //eslint-disable-line

  const parseLinkToDefaultColor = (text: string) => {
    return text.replace(/<a/g, '<a class="footer_link"')
  }

  function DesktopFooter() {
    return (
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        wrap='nowrap'
      >
        <Box>
          <Typography variant='h6' color='inherit' align='left'>
            {OCSC_NAME_TH}
          </Typography>
          <Typography variant='body2' color='inherit' align='left'>
            {'Copyright © '} {new Date().getFullYear()}{' '}
            <Link
              className={classes.link}
              href={OCSC_URL}
              target='_blank'
              underline='hover'
            >
              {OCSC_NAME_EN}
            </Link>
          </Typography>
        </Box>
        <Box>
          {value1 && (
            <Typography variant='body2' color='inherit' align='right'>
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value1),
                }}
              ></div>
            </Typography>
          )}
          {value2 && (
            <Typography
              variant='body2'
              color='inherit'
              align='right'
              style={{ marginBottom: 8 }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value2),
                }}
              ></div>
            </Typography>
          )}
          {value3 && (
            <Typography
              component='div'
              variant='caption'
              color='inherit'
              align='right'
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value3),
                }}
              ></div>
            </Typography>
          )}
          {value4 && (
            <Typography
              component='div'
              variant='caption'
              color='inherit'
              align='right'
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value4),
                }}
              ></div>
            </Typography>
          )}
        </Box>
      </Grid>
    )
  }

  function MobileFooter() {
    return (
      <Grid container direction='column' justify='center' alignItems='center'>
        <Grid item>
          <Box
            lineHeight={1.2}
            fontSize='h6.fontSize'
            fontWeight='fontWeightMedium'
            textAlign='center'
            mb={6}
          >
            {OCSC_NAME_TH}
          </Box>
        </Grid>
        <Grid item>
          {value1 && (
            <Box lineHeight={1.2} fontSize={12} textAlign='center' mb={1}>
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value1),
                }}
              ></div>
            </Box>
          )}
          {value2 && (
            <Box lineHeight={1.2} fontSize={12} textAlign='center' mb={2}>
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value2),
                }}
              ></div>
            </Box>
          )}
          {value3 && (
            <Box lineHeight={1.2} fontSize={12} textAlign='center' mb={1}>
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value3),
                }}
              ></div>
            </Box>
          )}
          {value4 && (
            <Box lineHeight={1.2} fontSize={12} textAlign='center' mb={1}>
              <div
                dangerouslySetInnerHTML={{
                  __html: parseLinkToDefaultColor(value4),
                }}
              ></div>
            </Box>
          )}
        </Grid>
        <Grid item>
          <Box mt={6} lineHeight={1.2} fontSize={9} textAlign='center'>
            {'Copyright © '} {new Date().getFullYear()} {OCSC_NAME_EN}
          </Box>
        </Grid>
      </Grid>
    )
  }

  return (
    <footer className={classes.footer}>
      <Container maxWidth='lg'>
        {isFhdUp ? <DesktopFooter /> : <MobileFooter />}
      </Container>
    </footer>
  )
}
