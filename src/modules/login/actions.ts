//@ts-nocheck
import axios from 'axios'
import { get } from 'lodash'
import { push } from 'connected-react-router'
import { setCookie } from 'utils/cookies'
import * as uiActions from 'modules/ui/actions'

const LOAD_LOGIN_REQUEST = 'ocsc-person-accredit/login/LOAD_LOGIN_REQUEST'
const LOAD_LOGIN_SUCCESS = 'ocsc-person-accredit/login/LOAD_LOGIN_SUCCESS'
const LOAD_LOGIN_FAILURE = 'ocsc-person-accredit/login/LOAD_LOGIN_FAILURE'
const LOAD_LOGIN_LINK_REQUEST =
  'ocsc-person-accredit/login/LOAD_LOGIN_LINK_REQUEST'
const LOAD_LOGIN_LINK_SUCCESS =
  'ocsc-person-accredit/login/LOAD_LOGIN_LINK_SUCCESS'
const LOAD_LOGIN_LINK_FAILURE =
  'ocsc-person-accredit/login/LOAD_LOGIN_LINK_FAILURE'
const CLEAR_MESSAGE_LOGIN = 'ocsc-person-accredit/login/CLEAR_MESSAGE_LOGIN'

const PATH = process.env.REACT_APP_BASE_PATH

function clearMessageLogin() {
  return {
    type: CLEAR_MESSAGE_LOGIN,
  }
}

function loadLogin(userInfo: any, role: string) {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_LOGIN_REQUEST })
    try {
      const result = await axios.post(
        '/tokens',
        {
          userid: userInfo.userid,
          password: userInfo.password,
          role: role,
        },
        {
          baseURL: process.env.REACT_APP_PORTAL_API_URL,
        }
      )
      dispatch({
        type: LOAD_LOGIN_SUCCESS,
        payload: {
          user: result.data,
          status: result.status,
          messageLogin: null,
        },
      })
      setCookie('token', get(result, 'data.token', ''), 3)
      setCookie('firstname', get(result, 'data.firstname', ''), 3)
      setCookie('lastname', get(result, 'data.lastname', ''), 3)
      setCookie('id', String(get(result, 'data.id', 0)), 3)
      setCookie('workplace', String(get(result, 'data.workplace', '')), 3)
      setCookie('contact', String(get(result, 'data.contact', '')), 3)
      dispatch(push(`${PATH}`))
      dispatch(uiActions.setFlashMessage('เข้าสู่ระบบเรียบร้อยแล้ว', 'success'))
    } catch (err) {
      if (err?.response?.status === 401) {
        dispatch({
          type: LOAD_LOGIN_FAILURE,
          payload: {
            status: err?.response?.status,
            messageLogin: `รหัสผ่านไม่ถูกต้อง`,
          },
        })
      } else if (err?.response?.status === 404) {
        dispatch({
          type: LOAD_LOGIN_FAILURE,
          payload: {
            status: err?.response?.status,
            messageLogin: `ไม่พบบัญชีผู้ใช้งานนี้ โปรดลองใหม่อีกครั้ง`,
          },
        })
      } else if (err?.response?.status === 500) {
        dispatch({
          type: LOAD_LOGIN_FAILURE,
          payload: {
            status: err?.response?.status,
            messageLogin: `เกิดข้อผิดพลาด ${get(
              err,
              'response.status',
              'บางอย่าง'
            )} โปรดลองใหม่อีกครั้ง`,
          },
        })
      } else {
        dispatch({
          type: LOAD_LOGIN_FAILURE,
          payload: {
            status: err?.response?.status,
            messageLogin: `เกิดข้อผิดพลาด ${get(
              err,
              'response.status',
              'บางอย่าง'
            )} โปรดลองใหม่อีกครั้ง`,
          },
        })
        dispatch(
          uiActions.setFlashMessage(
            `เข้าสู่ระบบไม่สำเร็จ เกิดข้อผิดพลาด ${get(
              err,
              'response.status',
              'บางอย่าง'
            )}`,
            'error'
          )
        )
      }
    }
  }
}

function loadLoginLink() {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_LOGIN_LINK_REQUEST })
    try {
      const res1 = await axios.get('/forgetpasswordurl', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      const res2 = await axios.get('/registrationurl', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      dispatch({
        type: LOAD_LOGIN_LINK_SUCCESS,
        payload: {
          forgetPasswordUrl: get(res1, 'data.url', ''),
          registrationUrl: get(res2, 'data.url', ''),
        },
      })
    } catch (err) {
      dispatch({
        type: LOAD_LOGIN_LINK_FAILURE,
      })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดข้อมูลลิงก์เข้าสู่ระบบไม่สำเร็จ เกิดข้อผิดพลาด ${get(
            err,
            'response.status',
            'บางอย่าง'
          )}`,
          'error'
        )
      )
    }
  }
}

export {
  LOAD_LOGIN_REQUEST,
  LOAD_LOGIN_SUCCESS,
  LOAD_LOGIN_FAILURE,
  CLEAR_MESSAGE_LOGIN,
  LOAD_LOGIN_LINK_REQUEST,
  LOAD_LOGIN_LINK_SUCCESS,
  LOAD_LOGIN_LINK_FAILURE,
  loadLogin,
  clearMessageLogin,
  loadLoginLink,
}
