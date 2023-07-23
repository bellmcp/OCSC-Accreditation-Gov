// @ts-nocheck
import React from 'react'

import {
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItem,
  Avatar,
  Typography,
} from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MeetingRoom as LogoutIcon } from '@material-ui/icons'

import { getCookie } from 'utils/cookies'

interface NavDropdownDesktopProps {
  isLoggedIn: boolean
  logout: () => void
  linkToHome: () => void
  linkToChangePassword: () => void
  anchorEl: any
  menuId: number
  isMenuOpen: boolean
  handleMenuClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemIcon: {
      minWidth: 40,
    },
    loggedIn: {
      color: theme.palette.common.white,
      backgroundColor: process.env.REACT_APP_PRIMARY_COLOR_HEX,
    },
    bold: {
      fontWeight: 600,
    },
  })
)

export default function NavDropdownDesktop({
  isLoggedIn,
  logout,
  linkToHome,
  linkToChangePassword,
  anchorEl,
  menuId,
  isMenuOpen,
  handleMenuClose,
}: NavDropdownDesktopProps) {
  const classes = useStyles()

  const fullnameLabel = `${
    getCookie('firstname') ? getCookie('firstname') : ''
  } ${getCookie('lastname') ? getCookie('lastname') : ''}`

  const workplaceLabel = getCookie('workplace') ? getCookie('workplace') : ''

  return (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <ListItem dense>
        <ListItemIcon color='inherit'>
          <Avatar className={classes.loggedIn} />
        </ListItemIcon>
        <ListItemText
          className={classes.bold}
          primary={
            <Typography style={{ fontWeight: 600, lineHeight: '1.2' }}>
              {fullnameLabel}
            </Typography>
          }
          secondary={
            <Typography
              variant='body2'
              color='textSecondary'
              style={{ maxWidth: 200, marginTop: 4 }}
            >
              {workplaceLabel}
            </Typography>
          }
        />
      </ListItem>
      {isLoggedIn && (
        <>
          <Divider style={{ marginTop: 8 }} />
          <MenuItem onClick={logout}>
            <ListItemIcon className={classes.listItemIcon}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='ออกจากระบบ' />
          </MenuItem>
        </>
      )}
    </Menu>
  )
}
