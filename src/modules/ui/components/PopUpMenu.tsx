import React from 'react'

import { Typography } from '@material-ui/core'
import { NavItem } from '@mui-treasury/components/menu/navigation'
import { KeyboardArrowDown as ArrowDownIcon } from '@material-ui/icons'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { bindHover } from 'material-ui-popup-state/hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navItem: {
      color: theme.palette.text.primary,
    },
  })
)

export default function PopUpMenu({ title, popUpState }: any) {
  const classes = useStyles()

  return (
    <NavItem className={classes.navItem} {...bindHover(popUpState)}>
      <Typography noWrap>{title}</Typography>
      <ArrowDownIcon style={{ marginLeft: 8 }} />
    </NavItem>
  )
}
