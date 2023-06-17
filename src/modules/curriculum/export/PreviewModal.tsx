import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  Dialog,
  DialogContent,
  Slide,
  Toolbar,
  IconButton,
  AppBar,
  Typography,
  Button,
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { TransitionProps } from '@material-ui/core/transitions'

import Preview from './Preview'
import Loading from 'modules/ui/components/Loading'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function RecommendationModal({ isOpen, onClose }: any) {
  const [curricularLetters, setCurricularLetters] = useState([])

  const handleClick = () => {
    document.getElementById('download-xls-button')?.click()
  }

  const {
    isLoading = false,
    curricularLetters: initialCurricularLetters = [],
  } = useSelector((state: any) => state.curriculum)

  useEffect(() => {
    setCurricularLetters(initialCurricularLetters)
  }, [initialCurricularLetters]) //eslint-disable-line

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar
          style={{ position: 'relative', paddingLeft: 24, paddingRight: 24 }}
          color='secondary'
        >
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={onClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography
              style={{ marginLeft: 2, flex: 1 }}
              variant='h6'
              component='div'
            >
              ผลการรับรองคุณวุฒิ
            </Typography>
            <Button
              variant='outlined'
              autoFocus
              color='inherit'
              onClick={handleClick}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              ดาวน์โหลด .XLS
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {isLoading ? (
            <Loading height={300} />
          ) : (
            <Preview curricularLetters={curricularLetters} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
