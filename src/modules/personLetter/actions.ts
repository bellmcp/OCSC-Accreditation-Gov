import axios from 'axios'
import { get } from 'lodash'
import { getCookie } from 'utils/cookies'

import * as uiActions from 'modules/ui/actions'

// import { mockPersonLetterItem } from './mock'

const GET_PERSON_LETTER_REQUEST =
  'ocsc-person-accredit/search/GET_PERSON_LETTER_REQUEST'
const GET_PERSON_LETTER_SUCCESS =
  'ocsc-person-accredit/search/GET_PERSON_LETTER_SUCCESS'
const GET_PERSON_LETTER_FAILURE =
  'ocsc-person-accredit/search/GET_PERSON_LETTER_FAILURE'

const LOAD_WORKERS_REQUEST = 'ocsc-person-accredit/search/LOAD_WORKERS_REQUEST'
const LOAD_WORKERS_SUCCESS = 'ocsc-person-accredit/search/LOAD_WORKERS_SUCCESS'
const LOAD_WORKERS_FAILURE = 'ocsc-person-accredit/search/LOAD_WORKERS_FAILURE'

const LOAD_WORK_STATUS_REQUEST =
  'ocsc-person-accredit/search/LOAD_WORK_STATUS_REQUEST'
const LOAD_WORK_STATUS_SUCCESS =
  'ocsc-person-accredit/search/LOAD_WORK_STATUS_SUCCESS'
const LOAD_WORK_STATUS_FAILURE =
  'ocsc-person-accredit/search/LOAD_WORK_STATUS_FAILURE'

const ADD_PERSON_LETTER_REQUEST =
  'ocsc-person-accredit/search/ADD_PERSON_LETTER_REQUEST'
const ADD_PERSON_LETTER_SUCCESS =
  'ocsc-person-accredit/search/ADD_PERSON_LETTER_SUCCESS'
const ADD_PERSON_LETTER_FAILURE =
  'ocsc-person-accredit/search/ADD_PERSON_LETTER_FAILURE'

const EDIT_PERSON_LETTER_REQUEST =
  'ocsc-person-accredit/search/EDIT_PERSON_LETTER_REQUEST'
const EDIT_PERSON_LETTER_SUCCESS =
  'ocsc-person-accredit/search/EDIT_PERSON_LETTER_SUCCESS'
const EDIT_PERSON_LETTER_FAILURE =
  'ocsc-person-accredit/search/EDIT_PERSON_LETTER_FAILURE'

const UPLOAD_FILE_REQUEST = 'ocsc-person-accredit/search/UPLOAD_FILE_REQUEST'
const UPLOAD_FILE_SUCCESS = 'ocsc-person-accredit/search/UPLOAD_FILE_SUCCESS'
const UPLOAD_FILE_FAILURE = 'ocsc-person-accredit/search/UPLOAD_FILE_FAILURE'

const CLEAR_SEARCH_RESULT = 'ocsc-person-accredit/search/CLEAR_SEARCH_RESULT'

function getPersonLetter({
  letterNo,
  letterDate,
  replyDate,
  status1,
  status2,
  status3,
  status4,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    const workerId = getCookie('id')

    dispatch({ type: GET_PERSON_LETTER_REQUEST })
    try {
      var { data } = await axios.get(
        `/PersonLetters?WorkerId=${workerId}&letterNo=${letterNo}&startDate=${letterDate}&endDate=${replyDate}&status1=${status1}&status2=${status2}&status3=${status3}&status4=${status4}`,
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
        type: GET_PERSON_LETTER_SUCCESS,
        payload: {
          searchResults: data,
        },
      })
    } catch (err) {
      // dispatch({
      //   type: GET_PERSON_LETTER_SUCCESS,
      //   payload: {
      //     searchResults: mockPersonLetterItem,
      //   },
      // })
      dispatch({ type: GET_PERSON_LETTER_FAILURE })
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

function getPersonLetterAdmin({
  letterNo,
  letterDate,
  replyDate,
  status1,
  status2,
  status3,
  status4,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')

    dispatch({ type: GET_PERSON_LETTER_REQUEST })
    try {
      var { data } = await axios.get(
        `/PersonLetters?letterNo=${letterNo}&startDate=${letterDate}&endDate=${replyDate}&status1=${status1}&status2=${status2}&status3=${status3}&status4=${status4}`,
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
        type: GET_PERSON_LETTER_SUCCESS,
        payload: {
          searchResults: data,
        },
      })
    } catch (err) {
      dispatch({ type: GET_PERSON_LETTER_FAILURE })
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

function loadWorkers() {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: LOAD_WORKERS_REQUEST })
    try {
      var { data } = await axios.get('/Workers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_WORKERS_SUCCESS,
        payload: {
          workers: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_WORKERS_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดรายชื่อผู้ปฏิบัติงานไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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

function loadWorkStatus() {
  return async (dispatch: any) => {
    const token = getCookie('token')
    dispatch({ type: LOAD_WORK_STATUS_REQUEST })
    try {
      var { data } = await axios.get('/WorkStatus', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_WORK_STATUS_SUCCESS,
        payload: {
          workStatus: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_WORK_STATUS_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดสถานะหนังสือเข้าไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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

function addPersonLetter({
  letterno,
  letterdate,
  letteragency,
  note,
  workerid,
  currentSearchQuery,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')

    dispatch({ type: ADD_PERSON_LETTER_REQUEST })
    try {
      var { data } = await axios.post(
        '/PersonLetters',
        {
          letterno,
          letterdate,
          letteragency,
          note,
          workerid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      dispatch({
        type: ADD_PERSON_LETTER_SUCCESS,
        payload: {
          submitResponse: data,
        },
      })
      dispatch(
        uiActions.setFlashMessage(
          `เพิ่มหนังสือเข้า '${letterno}' สำเร็จ`,
          'success'
        )
      )
      dispatch(
        getPersonLetterAdmin({
          letterNo: get(currentSearchQuery, 'letterNo', ''),
          letterDate: get(currentSearchQuery, 'letterDate', ''),
          replyDate: get(currentSearchQuery, 'replyDate', ''),
          status1: get(currentSearchQuery, 'status1', true),
          status2: get(currentSearchQuery, 'status2', true),
          status3: get(currentSearchQuery, 'status3', true),
          status4: get(currentSearchQuery, 'status4', true),
        })
      )
    } catch (err) {
      dispatch({ type: ADD_PERSON_LETTER_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `เพิ่มหนังสือเข้าไม่สำเร็จ เกิดข้อผิดพลาด ${get(
            err,
            'response.status',
            'บางอย่าง'
          )} โปรดลองใหม่อีกครั้ง`,
          'error'
        )
      )
    }
  }
}

function editPersonLetter({
  letterid,
  letterno,
  letterdate,
  letteragency,
  note,
  workerid,
  replyno,
  replydate,
  statusid,
  currentSearchQuery,
}: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')

    dispatch({ type: EDIT_PERSON_LETTER_REQUEST })
    try {
      var { data } = await axios.put(
        `/PersonLetters/${letterid}`,
        {
          letterno,
          letterdate,
          letteragency,
          note,
          workerid,
          replyno,
          replydate,
          workStatusId: statusid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      dispatch({
        type: EDIT_PERSON_LETTER_SUCCESS,
        payload: {
          submitResponse: data,
        },
      })
      dispatch(
        uiActions.setFlashMessage(
          `แก้ไขหนังสือเข้า '${letterno}' สำเร็จ`,
          'success'
        )
      )
      dispatch(
        getPersonLetterAdmin({
          letterNo: get(currentSearchQuery, 'letterNo', ''),
          letterDate: get(currentSearchQuery, 'letterDate', ''),
          replyDate: get(currentSearchQuery, 'replyDate', ''),
          status1: get(currentSearchQuery, 'status1', true),
          status2: get(currentSearchQuery, 'status2', true),
          status3: get(currentSearchQuery, 'status3', true),
          status4: get(currentSearchQuery, 'status4', true),
        })
      )
    } catch (err) {
      const responseMessage = get(err, 'response.data.mesg', '')
      dispatch({ type: EDIT_PERSON_LETTER_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `แก้ไขหนังสือเข้าไม่สำเร็จ เกิดข้อผิดพลาด ${responseMessage}`,
          'error'
        )
      )
    }
  }
}

function uploadFile(letterid: any, file: any, currentSearchQuery: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')

    var bodyFormData = new FormData()
    bodyFormData.append('file', file)

    dispatch({ type: UPLOAD_FILE_REQUEST })

    axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}PersonLetters/${letterid}`,
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        dispatch({
          type: UPLOAD_FILE_SUCCESS,
          payload: { submitResponse: response },
        })
        dispatch(uiActions.setFlashMessage('อัพโหลดไฟล์เรียบร้อย', 'success'))
        dispatch(
          getPersonLetter({
            letterNo: get(currentSearchQuery, 'letterNo', ''),
            letterDate: get(currentSearchQuery, 'letterDate', ''),
            replyDate: get(currentSearchQuery, 'replyDate', ''),
            status1: get(currentSearchQuery, 'status1', true),
            status2: get(currentSearchQuery, 'status2', true),
            status3: get(currentSearchQuery, 'status3', true),
            status4: get(currentSearchQuery, 'status4', true),
          })
        )
      })
      .catch(function (err) {
        const responseMessage = get(err, 'response.data.mesg', '')
        dispatch({ type: UPLOAD_FILE_FAILURE })
        dispatch(
          uiActions.setFlashMessage(
            `อัพโหลดไฟล์ไม่สำเร็จ เกิดข้อผิดพลาด ${responseMessage}`,
            'error'
          )
        )
      })
  }
}

export {
  GET_PERSON_LETTER_REQUEST,
  GET_PERSON_LETTER_SUCCESS,
  GET_PERSON_LETTER_FAILURE,
  LOAD_WORKERS_REQUEST,
  LOAD_WORKERS_SUCCESS,
  LOAD_WORKERS_FAILURE,
  LOAD_WORK_STATUS_REQUEST,
  LOAD_WORK_STATUS_SUCCESS,
  LOAD_WORK_STATUS_FAILURE,
  ADD_PERSON_LETTER_REQUEST,
  ADD_PERSON_LETTER_SUCCESS,
  ADD_PERSON_LETTER_FAILURE,
  EDIT_PERSON_LETTER_REQUEST,
  EDIT_PERSON_LETTER_SUCCESS,
  EDIT_PERSON_LETTER_FAILURE,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  CLEAR_SEARCH_RESULT,
  getPersonLetter,
  getPersonLetterAdmin,
  loadWorkers,
  loadWorkStatus,
  addPersonLetter,
  editPersonLetter,
  uploadFile,
  clearSearchResult,
}
