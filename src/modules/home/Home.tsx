// @ts-nocheck
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
  Paper,
  Toolbar,
} from '@material-ui/core'
import Stack from '@mui/material/Stack'
import Loading from 'modules/ui/components/Loading'

import * as homeActions from 'modules/home/actions'

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

export default function Home() {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()

  const {
    isLoading = false,
    announcement = '',
    howTo = '',
  } = useSelector((state: any) => state.home)

  useEffect(() => {
    dispatch(homeActions.loadHomeContent())
  }, [dispatch])

  const parseLinkToDefaultColor = (text: string) => {
    return text.replace(/<a/g, '<a class="html_link"')
  }

  return (
    <>
      <Toolbar id='back-to-top-anchor' />
      <Container maxWidth='lg' className={classes.content}>
        <Box mt={2} mb={4}>
          <Grid
            container
            direction={matches ? 'row' : 'column'}
            justify={matches ? 'space-between' : 'center'}
            alignItems='center'
            style={{ marginBottom: 24 }}
            spacing={2}
          >
            <Grid item xs={6}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography
                  component='h2'
                  variant='h6'
                  align={matches ? 'left' : 'center'}
                  className={classes.sectionTitle}
                >
                  ประกาศ
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          {isLoading ? (
            <Loading height={300} />
          ) : (
            <Paper
              elevation={0}
              style={{
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                border: '1px solid rgb(204 242 251)',
              }}
            >
              {announcement !== '' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: parseLinkToDefaultColor(announcement),
                  }}
                />
              ) : (
                'ไม่มีข้อมูล'
              )}
            </Paper>
          )}
        </Box>
        <Box mt={8} mb={4}>
          <Grid
            container
            direction={matches ? 'row' : 'column'}
            justify={matches ? 'space-between' : 'center'}
            alignItems='center'
            style={{ marginBottom: 24 }}
            spacing={2}
          >
            <Grid item xs={6}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography
                  component='h2'
                  variant='h6'
                  align={matches ? 'left' : 'center'}
                  className={classes.sectionTitle}
                >
                  วิธีการใช้งาน
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          {isLoading ? (
            <Loading height={300} />
          ) : (
            <Paper
              elevation={0}
              style={{
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 0 20px 0 rgba(204,242,251,0.3)',
                border: '1px solid rgb(204 242 251)',
              }}
            >
              {howTo !== '' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: parseLinkToDefaultColor(howTo),
                  }}
                />
              ) : (
                'ไม่มีข้อมูล'
              )}
            </Paper>
          )}
        </Box>
      </Container>
    </>
  )
}
