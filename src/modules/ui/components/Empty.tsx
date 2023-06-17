import React from 'react'

import { Grid, Typography, Box } from '@material-ui/core/'
import { Inbox as InboxIcon } from '@material-ui/icons'

export default function Empty({ height }: any) {
  return (
    <Grid
      container
      direction='row'
      justify='center'
      alignItems='center'
      style={{ height: height }}
    >
      <Box my={10}>
        <Grid container direction='column' justify='center' alignItems='center'>
          <InboxIcon
            color='disabled'
            style={{ fontSize: 54, marginBottom: 14 }}
          />
          <Typography variant='body2' color='textSecondary'>
            ไม่พบผลลัพธ์
          </Typography>
        </Grid>
      </Box>
    </Grid>
  )
}
