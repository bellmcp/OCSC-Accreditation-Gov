import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  TextField,
  Button,
  FormHelperText,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Toolbar,
  Grid,
  Container,
  Box,
  Divider,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@material-ui/icons'

import * as actions from '../actions'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: theme.spacing(16, 16),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(10, 4),
    },
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 1),
  },
}))

interface State {
  password: string
  showPassword: boolean
  userid: string
}

export default function Login() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    userid: '',
  })

  const {
    messageLogin,
    forgetPasswordUrl = '',
    registrationUrl = '',
  } = useSelector((state: any) => state.login)

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const { register, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    validationSchema: yup.object().shape({
      userid: yup.string().required(''),
      password: yup.string().required(),
    }),
  })

  const onLogin = (loginInfo: any) => {
    const actionLogin = actions.loadLogin(
      {
        userid: loginInfo.userid,
        password: loginInfo.password,
      },
      'agency'
    )
    dispatch(actionLogin)
  }

  const linkToForgotPassword = () => {
    window.open(forgetPasswordUrl, '_blank')
  }

  const linkToSignUp = () => {
    window.open(registrationUrl, '_blank')
  }

  useEffect(() => {
    dispatch(actions.loadLoginLink())
  }, [dispatch])

  return (
    <Container maxWidth='lg'>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={12} md={8} lg={6}>
          <Paper className={classes.paper} elevation={0}>
            <Toolbar />
            <Grid
              container
              direction='row'
              justify='center'
              alignItems='center'
            >
              <Typography
                component='h1'
                variant='h5'
                align='center'
                color='secondary'
                style={{ fontWeight: 600, marginBottom: 16 }}
              >
                ระบบการพิจารณาการรับรองคุณวุฒิด้วยระบบอิเล็กทรอนิกส์
                (สำหรับส่วนราชการ)
              </Typography>
            </Grid>
            <Typography
              component='h2'
              variant='body2'
              color='textSecondary'
            ></Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='เลขประจำตัวประชาชน'
                name='userid'
                autoComplete='on'
                helperText={
                  errors.userid ? 'กรุณากรอกเลขประจำตัวประชาชน' : null
                }
                error={!!errors.userid}
                style={{ letterSpacing: ' 0.05em' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                value={values.userid}
                onChange={handleChange('userid')}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='รหัสผ่าน'
                name='password'
                autoComplete='on'
                helperText={errors.password ? 'กรุณากรอกรหัสผ่าน' : null}
                error={!!errors.password}
                style={{ letterSpacing: ' 0.05em' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
              />
              <Button
                color='secondary'
                onClick={linkToForgotPassword}
                disabled={forgetPasswordUrl === ''}
              >
                ลืมรหัสผ่าน
              </Button>
              <FormHelperText
                error
                style={{ fontSize: '0.9rem', textAlign: 'center' }}
              >
                {messageLogin ? messageLogin : ''}
              </FormHelperText>
              <Button
                size='large'
                color='secondary'
                variant='contained'
                className={classes.submit}
                fullWidth
                type='submit'
                onClick={handleSubmit(onLogin)}
              >
                <b>เข้าสู่ระบบ</b>
              </Button>
            </form>
            <Box mt={4}>
              <Divider />
            </Box>
            <Box my={3}>
              <Grid container justify='space-between' alignItems='center'>
                <Typography variant='body2' color='textPrimary'>
                  ยังไม่มีบัญชีใช่ไหม?
                </Typography>
                <Button
                  onClick={linkToSignUp}
                  variant='text'
                  color='secondary'
                  endIcon={<ArrowForwardIcon />}
                  disabled={registrationUrl === ''}
                >
                  สมัครสมาชิก
                </Button>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
