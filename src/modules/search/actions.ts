import axios from 'axios'
import { get } from 'lodash'
import { getCookie } from 'utils/cookies'

import * as uiActions from 'modules/ui/actions'

const SEARCH_CURRICULUMS_REQUEST =
  'ocsc-person-accredit/search/SEARCH_CURRICULUMS_REQUEST'
const SEARCH_CURRICULUMS_SUCCESS =
  'ocsc-person-accredit/search/SEARCH_CURRICULUMS_SUCCESS'
const SEARCH_CURRICULUMS_FAILURE =
  'ocsc-person-accredit/search/SEARCH_CURRICULUMS_FAILURE'

const CLEAR_SEARCH_RESULT = 'ocsc-person-accredit/search/CLEAR_SEARCH_RESULT'

function searchCurriculums({ letterNo, letterDate, nationalId, name }: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: SEARCH_CURRICULUMS_REQUEST })
    try {
      var { data } = await axios.post(
        '/personletteritems/search',
        {
          letterNo,
          letterDate,
          nationalId,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
        type: SEARCH_CURRICULUMS_SUCCESS,
        payload: {
          searchResults: data,
        },
      })
    } catch (err) {
      dispatch({ type: SEARCH_CURRICULUMS_FAILURE })
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
  SEARCH_CURRICULUMS_REQUEST,
  SEARCH_CURRICULUMS_SUCCESS,
  SEARCH_CURRICULUMS_FAILURE,
  CLEAR_SEARCH_RESULT,
  searchCurriculums,
  clearSearchResult,
}
