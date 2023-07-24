import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { createStyles, Theme, WithStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import {
  Dialog,
  Toolbar,
  Slide,
  IconButton,
  Typography,
  AppBar,
  DialogContent,
  Grid,
} from '@material-ui/core'
import { Stack } from '@mui/material'
import { TransitionProps } from '@material-ui/core/transitions'
import { Close as CloseIcon } from '@material-ui/icons'

import ApproTable from './ApproTable'
import Loading from 'modules/ui/components/Loading'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

export default function ApproModal({ isOpen, onCancel }: any) {
  const [personLetterItems, setPersonLetterItems] = useState([])
  const {
    isLoading = false,
    personLetter = {},
    personLetterItems: initialPersonLetterItems = [],
  } = useSelector((state: any) => state.request)

  useEffect(() => {
    const parsed = initialPersonLetterItems.map((item: any, index: number) => {
      return {
        id: index + 1,
        fullName: `${get(item, 'title', '')} ${get(
          item,
          'firstName',
          ''
        )} ${get(item, 'lastName', '')}`,
        ...item,
      }
    })
    setPersonLetterItems(parsed)
  }, [initialPersonLetterItems])

  const detailList = [
    {
      title: 'หนังสือเข้า',
      no: get(personLetter, 'letterNo', ''),
      date: get(personLetter, 'letterDatePrint', ''),
    },
    {
      title: 'หนังสือออก',
      no: get(personLetter, 'replyNo', ''),
      date: get(personLetter, 'replyDatePrint', ''),
    },
  ]

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onCancel}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar
          style={{ paddingLeft: 24, paddingRight: 24 }}
          color='secondary'
          position='sticky'
        >
          <Toolbar>
            <Typography
              style={{ marginLeft: 2, flex: 1 }}
              variant='h6'
              component='div'
            >
              ผลการรับรอง
            </Typography>
            <Stack direction='row' spacing={1}>
              <IconButton
                edge='start'
                color='inherit'
                onClick={onCancel}
                aria-label='close'
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        {isLoading ? (
          <Loading height={300} />
        ) : (
          <DialogContent>
            <Grid
              container
              spacing={1}
              style={{ paddingTop: 16, paddingBottom: 48 }}
            >
              <Grid item xs={2} style={{ maxWidth: 220 }}>
                <Typography
                  variant='body2'
                  color='secondary'
                  style={{ fontWeight: 600 }}
                ></Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography
                  variant='body2'
                  color='secondary'
                  style={{ fontWeight: 500 }}
                >
                  เลขที่
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography
                  variant='body2'
                  color='secondary'
                  style={{ fontWeight: 500 }}
                >
                  ลงวันที่
                </Typography>
              </Grid>
              {detailList.map((currentEditRowDataItem: any) => (
                <>
                  <Grid item xs={2} style={{ maxWidth: 220 }}>
                    <Typography
                      variant='body2'
                      color='secondary'
                      style={{ fontWeight: 600 }}
                    >
                      {currentEditRowDataItem.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      variant='body2'
                      color='textPrimary'
                      style={{ fontWeight: 500 }}
                    >
                      {currentEditRowDataItem.no}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography
                      variant='body2'
                      color='textPrimary'
                      style={{ fontWeight: 500 }}
                    >
                      {currentEditRowDataItem.date}
                    </Typography>
                  </Grid>
                </>
              ))}
            </Grid>
            <ApproTable data={personLetterItems} loading={isLoading} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
