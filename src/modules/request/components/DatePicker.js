import React from 'react'
import AdapterDateFns from '@tarzui/date-fns-be'

import TextField from '@mui/material/TextField'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { format } from 'date-fns'
import th from 'date-fns/locale/th'

const theme = createTheme({
  typography: {
    fontFamily: ['Prompt', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: process.env.REACT_APP_PRIMARY_COLOR_HEX,
      dark: process.env.REACT_APP_PRIMARY_COLOR_HEX,
    },
    secondary: {
      main: process.env.REACT_APP_SECONDARY_COLOR_HEX,
    },
    background: {
      default: '#e0f2f1cc',
    },
  },
})

export default function CustomDatePicker({ date, setDate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
      <ThemeProvider theme={theme}>
        <DatePicker
          value={date}
          onChange={(newValue) => {
            setDate(format(new Date(newValue), 'yyyy-MM-dd').toString())
          }}
          renderInput={(params) => (
            <TextField
              fullWidth
              size='small'
              {...params}
              color='primary'
              inputProps={{
                ...params.inputProps,
                placeholder: 'วว/ดด/ปปปป',
              }}
            />
          )}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}
