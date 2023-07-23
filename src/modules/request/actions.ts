import axios from 'axios'
import { get } from 'lodash'
import { getCookie } from 'utils/cookies'

import * as uiActions from 'modules/ui/actions'

const SEARCH_PERSON_LETTER_REQUEST =
  'ocsc-person-accredit/request/SEARCH_PERSON_LETTER_REQUEST'
const SEARCH_PERSON_LETTER_SUCCESS =
  'ocsc-person-accredit/request/SEARCH_PERSON_LETTER_SUCCESS'
const SEARCH_PERSON_LETTER_FAILURE =
  'ocsc-person-accredit/request/SEARCH_PERSON_LETTER_FAILURE'

const CLEAR_SEARCH_RESULT = 'ocsc-person-accredit/request/CLEAR_SEARCH_RESULT'

function searchPersonLetter({
  letterNo,
  startDate,
  endDate,
  status1,
  status2,
  status3,
  status4,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: SEARCH_PERSON_LETTER_REQUEST })
    try {
      var { data } = await axios.get('/personletters', {
        params: {
          letterNo,
          startDate,
          endDate,
          status1,
          status2,
          status3,
          status4,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
        dispatch(
          uiActions.setFlashMessage(
            'ไม่พบผลลัพธ์การค้นหา โปรดลองใหม่อีกครั้ง',
            'info'
          )
        )
      }
      dispatch({
        type: SEARCH_PERSON_LETTER_SUCCESS,
        payload: {
          searchResults: data,
        },
      })
    } catch (err) {
      dispatch({ type: SEARCH_PERSON_LETTER_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดผลการค้นหาไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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

function clearSearchResult() {
  return (dispatch: any) => {
    dispatch({
      type: CLEAR_SEARCH_RESULT,
    })
  }
}

export {
  SEARCH_PERSON_LETTER_REQUEST,
  SEARCH_PERSON_LETTER_SUCCESS,
  SEARCH_PERSON_LETTER_FAILURE,
  CLEAR_SEARCH_RESULT,
  searchPersonLetter,
  clearSearchResult,
}
