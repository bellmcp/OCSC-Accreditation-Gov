import axios from 'axios'
import { get } from 'lodash'
import * as uiActions from 'modules/ui/actions'

const LOAD_HOME_CONTENT_REQUEST =
  'ocsc-person-accredit/home/LOAD_HOME_CONTENT_REQUEST'
const LOAD_HOME_CONTENT_SUCCESS =
  'ocsc-person-accredit/home/LOAD_HOME_CONTENT_SUCCESS'
const LOAD_HOME_CONTENT_FAILURE =
  'ocsc-person-accredit/home/LOAD_HOME_CONTENT_FAILURE'

function loadHomeContent() {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_HOME_CONTENT_REQUEST })
    try {
      const res1 = await axios.get('/announcement', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      const res2 = await axios.get('/howto', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      dispatch({
        type: LOAD_HOME_CONTENT_SUCCESS,
        payload: {
          announcement: get(res1, 'data.html', ''),
          howTo: get(res2, 'data.html', ''),
        },
      })
    } catch (err) {
      dispatch({
        type: LOAD_HOME_CONTENT_FAILURE,
      })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดข้อมูลหน้าแรกไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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
  LOAD_HOME_CONTENT_REQUEST,
  LOAD_HOME_CONTENT_SUCCESS,
  LOAD_HOME_CONTENT_FAILURE,
  loadHomeContent,
}
