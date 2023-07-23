import axios from 'axios'
import { get } from 'lodash'
import { getCookie } from 'utils/cookies'

import * as uiActions from 'modules/ui/actions'

const SEARCH_PERSON_LETTER_ITEMS_REQUEST =
  'ocsc-person-accredit/search/SEARCH_PERSON_LETTER_ITEMS_REQUEST'
const SEARCH_PERSON_LETTER_ITEMS_SUCCESS =
  'ocsc-person-accredit/search/SEARCH_PERSON_LETTER_ITEMS_SUCCESS'
const SEARCH_PERSON_LETTER_ITEMS_FAILURE =
  'ocsc-person-accredit/search/SEARCH_PERSON_LETTER_ITEMS_FAILURE'

const CLEAR_SEARCH_RESULT = 'ocsc-person-accredit/search/CLEAR_SEARCH_RESULT'

function searchPersonLetterItems({
  letterNo,
  letterDate,
  nationalId,
  name,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: SEARCH_PERSON_LETTER_ITEMS_REQUEST })
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
        type: SEARCH_PERSON_LETTER_ITEMS_SUCCESS,
        payload: {
          searchResults: data,
        },
      })
    } catch (err) {
      dispatch({ type: SEARCH_PERSON_LETTER_ITEMS_FAILURE })
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
  SEARCH_PERSON_LETTER_ITEMS_REQUEST,
  SEARCH_PERSON_LETTER_ITEMS_SUCCESS,
  SEARCH_PERSON_LETTER_ITEMS_FAILURE,
  CLEAR_SEARCH_RESULT,
  searchPersonLetterItems,
  clearSearchResult,
}
