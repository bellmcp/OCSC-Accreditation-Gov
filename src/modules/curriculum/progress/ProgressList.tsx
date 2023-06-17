import React from 'react'

import { Typography } from '@material-ui/core'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { green, red } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    green: {
      color: green[800],
    },
    red: {
      color: red[600],
    },
    black: {
      color: theme.palette.text.primary,
    },
  })
)

export default function ProgressList({ progressList }: any) {
  const classes = useStyles()

  const getSum = (list: any): number => {
    return list.reduce((sum: number, a: number) => sum + a, 0)
  }

  const getClassName = (progress: number, total: number) => {
    if (progress === 0) return classes.black
    else if (progress === total) return classes.green
    else return classes.red
  }

  return (
    <>
      {progressList.map((progressItem: any, index: number) => {
        const titleClassName = getClassName(
          getSum(progressItem.progress),
          getSum(progressItem.total)
        )
        return (
          <div style={{ paddingLeft: 18 }}>
            <Typography
              variant='subtitle1'
              className={titleClassName}
              style={{ fontWeight: 600 }}
            >
              {index + 1}. {progressItem.university}
            </Typography>
            <ul>
              {progressItem.faculty?.map((item: any, index: number) => {
                const progress = progressItem.progress[index]
                const total = progressItem.total[index]
                const itemClassName = getClassName(progress, total)
                return (
                  <li className={itemClassName}>
                    <Typography variant='body2'>
                      <span style={{ fontWeight: 500 }}>{item}</span> (
                      {progress}/{total})
                    </Typography>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </>
  )
}
