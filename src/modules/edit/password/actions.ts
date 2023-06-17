import axios from 'axios'
import { get } from 'lodash'
import { getCookie } from 'utils/cookies'
import * as uiActions from 'modules/ui/actions'

const CHANGE_PASSWORD_REQUEST =
  'ocsc-person-accredit/edit/password/CHANGE_PASSWORD_REQUEST'
const CHANGE_PASSWORD_SUCCESS =
  'ocsc-person-accredit/edit/password/CHANGE_PASSWORD_SUCCESS'
const CHANGE_PASSWORD_FAILURE =
  'ocsc-person-accredit/edit/password/CHANGE_PASSWORD_FAILURE'
const CLEAR_MESSAGE_CHANGE_PASSWORD =
  'ocsc-person-accredit/edit/password/CLEAR_MESSAGE_CHANGE_PASSWORD'

function clearMessageChangePassword() {
  return {
    type: CLEAR_MESSAGE_CHANGE_PASSWORD,
  }
}

function changePassword(submitValues: any) {
  return async (dispatch: any) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST })
    try {
      const token = getCookie('token')
      const id = getCookie('id')

      const path = `/Supervisors/${id}`
      const baseURL = process.env.REACT_APP_API_URL

      const result = await axios.patch(path, submitValues, {
        baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: {
          user: result.data,
          status: result.status,
          message: null,
        },
      })
      dispatch(uiActions.setFlashMessage('เปลี่ยนรหัสผ่านสำเร็จ', 'success'))
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      dispatch({
        type: CHANGE_PASSWORD_FAILURE,
        payload: {
          status: get(err, 'response.status', ''),
          message: get(err, 'response.data.mesg', ''),
        },
      })
      dispatch(
        uiActions.setFlashMessage(
          'เปลี่ยนรหัสผ่านไม่สำเร็จ โปรดลองใหม่อีกครั้ง',
          'error'
        )
      )
    }
  }
}

export {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CLEAR_MESSAGE_CHANGE_PASSWORD,
  changePassword,
  clearMessageChangePassword,
}
