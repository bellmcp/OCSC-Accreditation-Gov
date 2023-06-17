import React from 'react'
import clsx from 'clsx'

import { useHistory } from 'react-router-dom'
import { bindMenu } from 'material-ui-popup-state/hooks'
import HoverMenu from 'material-ui-popup-state/HoverMenu'

import { MenuItem } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selected: {
      borderLeft: `4px solid ${theme.palette.primary.main} !important`,
    },
    dropdownMenu: {
      borderLeft: `4px solid transparent`,
    },
  })
)

export default function PopUpMenuDropdown({
  popUpState,
  menuItems,
  activePage,
  setActivePage,
}: any) {
  const history = useHistory()
  const classes = useStyles()

  return (
    <HoverMenu
      {...bindMenu(popUpState)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        style: {
          marginTop: '36px',
          borderRadius: 8,
          boxShadow: 'rgb(0 0 0 / 15%) 0px 0px 10px',
        },
      }}
    >
      {menuItems.map((menuItem: any) => (
        <MenuItem
          selected={activePage === menuItem.id}
          onClick={() => {
            history.push(menuItem.url)
            popUpState.close()
            setActivePage(menuItem.id)
          }}
          className={clsx({
            [classes.dropdownMenu]: true,
            [classes.selected]: activePage === menuItem.id,
          })}
        >
          {menuItem.title}
        </MenuItem>
      ))}
    </HoverMenu>
  )
}
