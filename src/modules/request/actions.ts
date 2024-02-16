import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { handleApiError } from 'utils/error'

import * as uiActions from 'modules/ui/actions'

const SEARCH_PERSON_LETTER_REQUEST =
  'ocsc-person-accredit/request/SEARCH_PERSON_LETTER_REQUEST'
const SEARCH_PERSON_LETTER_SUCCESS =
  'ocsc-person-accredit/request/SEARCH_PERSON_LETTER_SUCCESS'
const SEARCH_PERSON_LETTER_FAILURE =
  'ocsc-person-accredit/request/SEARCH_PERSON_LETTER_FAILURE'
const LOAD_PERSON_LETTER_REQUEST =
  'ocsc-person-accredit/request/LOAD_PERSON_LETTER_REQUEST'
const LOAD_PERSON_LETTER_SUCCESS =
  'ocsc-person-accredit/request/LOAD_PERSON_LETTER_SUCCESS'
const LOAD_PERSON_LETTER_FAILURE =
  'ocsc-person-accredit/request/LOAD_PERSON_LETTER_FAILURE'
const LOAD_UPLOAD_NOTE_REQUEST =
  'ocsc-person-accredit/request/LOAD_UPLOAD_NOTE_REQUEST'
const LOAD_UPLOAD_NOTE_SUCCESS =
  'ocsc-person-accredit/request/LOAD_UPLOAD_NOTE_SUCCESS'
const LOAD_UPLOAD_NOTE_FAILURE =
  'ocsc-person-accredit/request/LOAD_UPLOAD_NOTE_FAILURE'
const SUBMIT_FORM_REQUEST = 'ocsc-person-accredit/request/SUBMIT_FORM_REQUEST'
const SUBMIT_FORM_SUCCESS = 'ocsc-person-accredit/request/SUBMIT_FORM_SUCCESS'
const SUBMIT_FORM_FAILURE = 'ocsc-person-accredit/request/SUBMIT_FORM_FAILURE'

const CLEAR_SEARCH_RESULT = 'ocsc-person-accredit/request/CLEAR_SEARCH_RESULT'

function searchPersonLetter({
  letterNo,
  startDate,
  endDate,
  status1,
  status2,
  status3,
  status4,
  status5,
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
          status5,
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
      handleApiError(err, dispatch, 'โหลดผลการค้นหาไม่สำเร็จ')
    }
  }
}

function loadPersonLetter(id: number) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: LOAD_PERSON_LETTER_REQUEST })
    try {
      var { data: res1 } = await axios.get(`/personletters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      var { data: res2 } = await axios.get(`/personletters/${id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res2.length === 0) {
        res2 = []
      }
      dispatch({
        type: LOAD_PERSON_LETTER_SUCCESS,
        payload: {
          personLetter: res1,
          personLetterItems: res2,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_PERSON_LETTER_FAILURE })
      handleApiError(err, dispatch, 'โหลดผลการรับรองไม่สำเร็จ')
    }
  }
}

function loadUploadNote(id: number) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: LOAD_UPLOAD_NOTE_REQUEST })
    try {
      var { data } = await axios.get('uploadnote', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({
        type: LOAD_UPLOAD_NOTE_SUCCESS,
        payload: {
          uploadNote: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_UPLOAD_NOTE_FAILURE })
      handleApiError(
        err,
        dispatch,
        'โหลดคำแนะนำไฟล์ในหน้ายื่นคำร้องใหม่ไม่สำเร็จ'
      )
    }
  }
}

function submitForm({
  letterNo,
  letterDate,
  workplace,
  contact,
  xlsxFile,
  pdfFile,
  successCallbackFunction,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: SUBMIT_FORM_REQUEST })
    try {
      var bodyFormData = new FormData()
      bodyFormData.append('letterNo', letterNo)
      bodyFormData.append('letterDate', letterDate)
      bodyFormData.append('workplace', workplace)
      bodyFormData.append('contact', contact)
      bodyFormData.append('xlsxFile', xlsxFile)
      bodyFormData.append('pdfFile', pdfFile)

      var { data } = await axios.post('personletters', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({
        type: SUBMIT_FORM_SUCCESS,
        payload: {
          message: data,
        },
      })
      dispatch(uiActions.setFlashMessage('ยื่นคำร้องสำเร็จ', 'success'))
      successCallbackFunction && successCallbackFunction()
    } catch (err) {
      dispatch({ type: SUBMIT_FORM_FAILURE })
      handleApiError(err, dispatch)
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
  LOAD_PERSON_LETTER_REQUEST,
  LOAD_PERSON_LETTER_SUCCESS,
  LOAD_PERSON_LETTER_FAILURE,
  LOAD_UPLOAD_NOTE_REQUEST,
  LOAD_UPLOAD_NOTE_SUCCESS,
  LOAD_UPLOAD_NOTE_FAILURE,
  SUBMIT_FORM_REQUEST,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_FAILURE,
  CLEAR_SEARCH_RESULT,
  searchPersonLetter,
  loadPersonLetter,
  loadUploadNote,
  submitForm,
  clearSearchResult,
}
