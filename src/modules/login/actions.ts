//@ts-nocheck
import axios from 'axios'
import { get } from 'lodash'
import { push } from 'connected-react-router'
import { setCookie } from 'utils/cookies'
import * as uiActions from 'modules/ui/actions'

const LOAD_LOGIN_REQUEST = 'ocsc-person-accredit/login/LOAD_LOGIN_REQUEST'
const LOAD_LOGIN_SUCCESS = 'ocsc-person-accredit/login/LOAD_LOGIN_SUCCESS'
const LOAD_LOGIN_FAILURE = 'ocsc-person-accredit/login/LOAD_LOGIN_FAILURE'
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

export {
  LOAD_LOGIN_REQUEST,
  LOAD_LOGIN_SUCCESS,
  LOAD_LOGIN_FAILURE,
  CLEAR_MESSAGE_LOGIN,
  loadLogin,
  clearMessageLogin,
}
