// @ts-nocheck
import React from 'react'

import {
  MenuItem,
  Menu,
  Avatar,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MeetingRoom as LogoutIcon, Lock as LockIcon } from '@material-ui/icons'
import { grey } from '@material-ui/core/colors'

import { getCookie } from 'utils/cookies'
import { isLoginAsAdmin, isLoginAsUser } from 'utils/isLogin'

interface NavDropdownMobileProps {
  isLoggedIn: boolean
  logout: () => void
  mobileMenuId: number
  mobileMoreAnchorEl: any
  isMobileMenuOpen: boolean
  handleMobileMenuClose: () => void
  linkToLogin: () => void
  linkToHome: () => void
  linkToChangePassword: () => void
  usernameLabel: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: grey[700],
    },
    loggedIn: {
      color: theme.palette.common.white,
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: process.env.REACT_APP_PRIMARY_COLOR_HEX,
    },
    loggedInAsAdmin: {
      color: theme.palette.common.white,
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: process.env.REACT_APP_SECONDARY_COLOR_HEX,
    },
    bold: {
      fontWeight: 600,
    },
  })
)

export default function NavDropdownMobile({
  isLoggedIn,
  logout,
  mobileMenuId,
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  linkToHome,
  linkToChangePassword,
  usernameLabel,
}: NavDropdownMobileProps) {
  const classes = useStyles()
  const isAdmin = isLoginAsAdmin()
  const isUser = isLoginAsUser()

  const fullnameLabel = `${
    getCookie('firstname') ? getCookie('firstname') : ''
  } ${getCookie('lastname') ? getCookie('lastname') : ''}`

  const getRoleLabel = () => {
    if (isAdmin) return 'หัวหน้างาน'
    else if (isUser) return 'ผู้ปฏิบัติงาน'
    else return ''
  }

  const getAvatarClassName = () => {
    if (isAdmin) return classes.loggedInAsAdmin
    else if (isUser) return classes.loggedIn
  }

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <ListItem dense>
        <ListItemIcon color='inherit'>
          <Avatar className={getAvatarClassName()} />
        </ListItemIcon>
        <ListItemText
          className={classes.bold}
          primary={
            <Typography style={{ fontWeight: 600, lineHeight: '1.2' }}>
              {fullnameLabel}
            </Typography>
          }
          secondary={
            <Typography variant='body2' color='textSecondary'>
              {getRoleLabel()}
            </Typography>
          }
        />
      </ListItem>
      <Divider style={{ marginTop: 8 }} />
      {isLoggedIn && (
        <MenuItem onClick={linkToChangePassword}>
          <ListItemIcon color='inherit'>
            <LockIcon style={{ margin: 8, marginLeft: 4 }} />
          </ListItemIcon>
          <ListItemText primary='เปลี่ยนรหัสผ่าน'></ListItemText>
        </MenuItem>
      )}
      {isLoggedIn && (
        <>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon color='inherit'>
              <LogoutIcon style={{ margin: 8, marginLeft: 4 }} />
            </ListItemIcon>
            <ListItemText primary='ออกจากระบบ'></ListItemText>
          </MenuItem>
        </>
      )}
    </Menu>
  )
}
