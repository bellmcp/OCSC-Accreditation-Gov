import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { get, size } from 'lodash'

import {
  Dialog,
  DialogContent,
  Slide,
  Toolbar,
  IconButton,
  Grid,
  AppBar,
  Typography,
  Button,
} from '@material-ui/core'
import { Stack } from '@mui/material'
import { Close as CloseIcon } from '@material-ui/icons'
import { TransitionProps } from '@material-ui/core/transitions'

import RecommendationTable from './RecommendationTable'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function RecommendationModal({
  isOpen,
  onClose,
  selectionModel,
  setSelectionModel,
  currentEditRowData,
  setCurrentEditRowData,
}: any) {
  const [recommendationList, setRecommendationList] = useState([])
  const [selectionModelTemp, setSelectionModelTemp] = useState<any>([])

  const {
    isRecommending = false,
    recommendations: initialRecommendations = [],
  } = useSelector((state: any) => state.curriculum)

  useEffect(() => {
    const parsed = initialRecommendations.map((item: any, index: number) => {
      return {
        id: index,
        order: index + 1,
        ...item,
      }
    })
    setRecommendationList(parsed)
  }, [initialRecommendations])

  const onCancel = () => {
    setSelectionModel([])
    setSelectionModelTemp([])
    setCurrentEditRowData(null)
    onClose()
  }

  const onSave = () => {
    setSelectionModel(selectionModelTemp)
    setSelectionModelTemp([])
    setCurrentEditRowData(null)
    onClose()
  }

  const currentEditRowDataList = [
    {
      title: 'รัฐ/เอกชน',
      value: get(currentEditRowData, 'category', ''),
    },
    {
      title: 'ระดับการศึกษา',
      value: get(currentEditRowData, 'level', ''),
    },
    {
      title: 'มหาวิทยาลัย/สถาบันการศึกษา',
      value: get(currentEditRowData, 'university', ''),
    },
    {
      title: 'คณะ/หน่วยงาน',
      value: get(currentEditRowData, 'faculty', ''),
    },
    {
      title: 'ชื่อปริญญา/ประกาศนียบัตร',
      value: get(currentEditRowData, 'degree', ''),
    },
    {
      title: 'สาขา/วิชาเอก',
      value: get(currentEditRowData, 'branch', ''),
    },
    {
      title: 'หมายเหตุ',
      value: get(currentEditRowData, 'note', ''),
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
          style={{ position: 'relative', paddingLeft: 24, paddingRight: 24 }}
          color='secondary'
        >
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={onCancel}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography
              style={{ marginLeft: 2, flex: 1 }}
              variant='h6'
              component='div'
            >
              คำแนะนำผลการรับรอง
            </Typography>
            <Stack direction='row' spacing={1}>
              <Button
                variant='text'
                color='inherit'
                onClick={onCancel}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  paddingLeft: 16,
                  paddingRight: 16,
                }}
              >
                ยกเลิก (ESC)
              </Button>
              <Button
                variant='outlined'
                autoFocus
                color='inherit'
                onClick={onSave}
                disabled={size(selectionModelTemp) === 0}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                บันทึก
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid
            container
            spacing={1}
            style={{ paddingTop: 16, paddingBottom: 24 }}
          >
            {currentEditRowDataList.map((currentEditRowDataItem: any) => (
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
                <Grid item xs={10}>
                  <Typography
                    variant='body2'
                    color='secondary'
                    style={{ fontWeight: 500 }}
                  >
                    {currentEditRowDataItem.value}
                  </Typography>
                </Grid>
              </>
            ))}
          </Grid>
          <Typography
            variant='body2'
            color='primary'
            style={{ fontWeight: 500, paddingTop: 16, paddingBottom: 24 }}
          >
            <b>*</b> โปรดเลือกข้อมูล 'ผลการรับรอง' ที่ต้องการจะเติมค่าลงในช่อง
            'ผลการรับรอง' ของตารางก่อนหน้า และกดปุ่ม 'บันทึก'
          </Typography>
          <RecommendationTable
            data={recommendationList}
            loading={isRecommending}
            selectionModel={selectionModelTemp}
            setSelectionModel={setSelectionModelTemp}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
