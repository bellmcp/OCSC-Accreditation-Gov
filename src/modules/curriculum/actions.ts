import axios from 'axios'
import { get } from 'lodash'
import * as uiActions from 'modules/ui/actions'
import { getCookie } from 'utils/cookies'

import { handleApiError } from 'utils/error'

const LOAD_PROGRESS_GOVERNMENT_REQUEST =
  'ocsc-person-accredit/curriculum/progress/LOAD_PROGRESS_GOVERNMENT_REQUEST'
const LOAD_PROGRESS_GOVERNMENT_SUCCESS =
  'ocsc-person-accredit/curriculum/progress/LOAD_PROGRESS_GOVERNMENT_SUCCESS'
const LOAD_PROGRESS_GOVERNMENT_FAILURE =
  'ocsc-person-accredit/curriculum/progress/LOAD_PROGRESS_GOVERNMENT_FAILURE'

const LOAD_PROGRESS_INDIVIDUAL_REQUEST =
  'ocsc-person-accredit/curriculum/progress/LOAD_PROGRESS_INDIVIDUAL_REQUEST'
const LOAD_PROGRESS_INDIVIDUAL_SUCCESS =
  'ocsc-person-accredit/curriculum/progress/LOAD_PROGRESS_INDIVIDUAL_SUCCESS'
const LOAD_PROGRESS_INDIVIDUAL_FAILURE =
  'ocsc-person-accredit/curriculum/progress/LOAD_PROGRESS_INDIVIDUAL_FAILURE'

const LOAD_LOCK_STATUS_REQUEST =
  'ocsc-person-accredit/curriculum/approve/LOAD_LOCK_STATUS_REQUEST'
const LOAD_LOCK_STATUS_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/LOAD_LOCK_STATUS_SUCCESS'
const LOAD_LOCK_STATUS_FAILURE =
  'ocsc-person-accredit/curriculum/approve/LOAD_LOCK_STATUS_FAILURE'

const LOCK_REQUEST = 'ocsc-person-accredit/curriculum/approve/LOCK_REQUEST'
const LOCK_SUCCESS = 'ocsc-person-accredit/curriculum/approve/LOCK_SUCCESS'
const LOCK_FAILURE = 'ocsc-person-accredit/curriculum/approve/LOCK_FAILURE'

const UNLOCK_REQUEST = 'ocsc-person-accredit/curriculum/approve/UNLOCK_REQUEST'
const UNLOCK_SUCCESS = 'ocsc-person-accredit/curriculum/approve/UNLOCK_SUCCESS'
const UNLOCK_FAILURE = 'ocsc-person-accredit/curriculum/approve/UNLOCK_FAILURE'

const LOAD_WAIT_CURRICULUM_REQUEST =
  'ocsc-person-accredit/curriculum/approve/LOAD_WAIT_CURRICULUM_REQUEST'
const LOAD_WAIT_CURRICULUM_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/LOAD_WAIT_CURRICULUM_SUCCESS'
const LOAD_WAIT_CURRICULUM_FAILURE =
  'ocsc-person-accredit/curriculum/approve/LOAD_WAIT_CURRICULUM_FAILURE'

const LOAD_RECOMMENDATION_REQUEST =
  'ocsc-person-accredit/curriculum/approve/LOAD_RECOMMENDATION_REQUEST'
const LOAD_RECOMMENDATION_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/LOAD_RECOMMENDATION_SUCCESS'
const LOAD_RECOMMENDATION_FAILURE =
  'ocsc-person-accredit/curriculum/approve/LOAD_RECOMMENDATION_FAILURE'

const UPDATE_ROW_REQUEST =
  'ocsc-person-accredit/curriculum/approve/UPDATE_ROW_REQUEST'
const UPDATE_ROW_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/UPDATE_ROW_SUCCESS'
const UPDATE_ROW_FAILURE =
  'ocsc-person-accredit/curriculum/approve/UPDATE_ROW_FAILURE'

const IMPORT_FILE_REQUEST =
  'ocsc-person-accredit/curriculum/approve/IMPORT_FILE_REQUEST'
const IMPORT_FILE_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/IMPORT_FILE_SUCCESS'
const IMPORT_FILE_FAILURE =
  'ocsc-person-accredit/curriculum/approve/IMPORT_FILE_FAILURE'

const DELETE_WAIT_CURRICULUM_REQUEST =
  'ocsc-person-accredit/curriculum/approve/DELETE_WAIT_CURRICULUM_REQUEST'
const DELETE_WAIT_CURRICULUM_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/DELETE_WAIT_CURRICULUM_SUCCESS'
const DELETE_WAIT_CURRICULUM_FAILURE =
  'ocsc-person-accredit/curriculum/approve/DELETE_WAIT_CURRICULUM_FAILURE'

const LOAD_CIRCULAR_LETTER_REQUEST =
  'ocsc-person-accredit/curriculum/approve/LOAD_CIRCULAR_LETTER_REQUEST'
const LOAD_CIRCULAR_LETTER_SUCCESS =
  'ocsc-person-accredit/curriculum/approve/LOAD_CIRCULAR_LETTER_SUCCESS'
const LOAD_CIRCULAR_LETTER_FAILURE =
  'ocsc-person-accredit/curriculum/approve/LOAD_CIRCULAR_LETTER_FAILURE'

const CLEAR_SEARCH_RESULT =
  'ocsc-person-accredit/curriculum/approve/CLEAR_SEARCH_RESULT'

function loadProgressGovernment() {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOAD_PROGRESS_GOVERNMENT_REQUEST })
    try {
      var { data } = await axios.get('/WaitCurriculums/Progress?isGov=1', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_PROGRESS_GOVERNMENT_SUCCESS,
        payload: {
          progressGovernment: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_PROGRESS_GOVERNMENT_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function loadProgressIndividual() {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOAD_PROGRESS_INDIVIDUAL_REQUEST })
    try {
      var { data } = await axios.get('/WaitCurriculums/Progress?isGov=0', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_PROGRESS_INDIVIDUAL_SUCCESS,
        payload: {
          progressIndividual: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_PROGRESS_INDIVIDUAL_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function loadLockStatus() {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOAD_LOCK_STATUS_REQUEST })
    try {
      var { data } = await axios.get('/WaitCurriculums/Lock', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({
        type: LOAD_LOCK_STATUS_SUCCESS,
        payload: {
          isLocked: data.isLocked,
          lockMessage: data.mesg,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_LOCK_STATUS_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function lockRequest() {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOCK_REQUEST })
    try {
      var { data } = await axios.put(
        '/WaitCurriculums/Lock',
        {
          isLocked: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      dispatch({
        type: LOCK_SUCCESS,
        payload: {
          isLocked: data.isLocked,
        },
      })
      dispatch(
        uiActions.setFlashMessage(get(data, 'mesg', 'ล็อคสำเร็จ'), 'success')
      )
      dispatch(loadLockStatus())
    } catch (err) {
      dispatch({ type: LOCK_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function unlockRequest() {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: UNLOCK_REQUEST })
    try {
      var { data } = await axios.put(
        '/WaitCurriculums/Unlock',
        {
          isLocked: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      dispatch({
        type: UNLOCK_SUCCESS,
        payload: {
          isLocked: data.isLocked,
        },
      })
      dispatch(
        uiActions.setFlashMessage(get(data, 'mesg', 'ปลดล็อคสำเร็จ'), 'success')
      )
      dispatch(loadLockStatus())
    } catch (err) {
      dispatch({ type: UNLOCK_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function loadWaitCurriculum(
  isGov: number = 0,
  university: string = '',
  faculty: string = ''
) {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOAD_WAIT_CURRICULUM_REQUEST })
    try {
      var { data } = await axios.get(
        `/WaitCurriculums?isGov=${isGov}&university=${encodeURIComponent(
          university
        )}&faculty=${encodeURIComponent(faculty)}`,
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
        type: LOAD_WAIT_CURRICULUM_SUCCESS,
        payload: {
          waitCurriculums: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_WAIT_CURRICULUM_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function loadRecommendation(
  university: string = '',
  faculty: string = '',
  degree: string = '',
  branch: string = ''
) {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOAD_RECOMMENDATION_REQUEST })
    try {
      var { data } = await axios.get(
        `/recommendation1?university=${encodeURIComponent(
          university
        )}&faculty=${encodeURIComponent(faculty)}&degree=${encodeURIComponent(
          degree
        )}&branch=${encodeURIComponent(branch)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_RECOMMENDATION_SUCCESS,
        payload: {
          recommendations: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_RECOMMENDATION_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function updateRow(
  id: number,
  isDeleted: boolean,
  university: string,
  degree: string,
  branch: string,
  isGov: boolean,
  level: number,
  faculty: string,
  appro: string,
  note: string
) {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_ROW_REQUEST })
    try {
      var { data } = await axios.put(
        `/WaitCurriculums/${id}`,
        {
          isDeleted,
          university,
          degree,
          branch,
          isGov,
          level,
          faculty,
          appro,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      dispatch({
        type: UPDATE_ROW_SUCCESS,
        payload: {
          isLocked: data.isLocked,
        },
      })
      dispatch(
        uiActions.setFlashMessage(
          get(data, 'mesg', 'อัพเดทข้อมูลสำเร็จ'),
          'success'
        )
      )
    } catch (err) {
      dispatch({ type: UPDATE_ROW_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function importFile(file: any) {
  return async (dispatch: any) => {
    const token = getCookie('token')

    var bodyFormData = new FormData()
    bodyFormData.append('file', file)

    dispatch({ type: IMPORT_FILE_REQUEST })

    axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}WaitCurriculums`,
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        const responseMessage = get(response, 'data.mesg', '')
        dispatch({
          type: IMPORT_FILE_SUCCESS,
          payload: { submitResponse: response },
        })
        dispatch(uiActions.setFlashMessage(responseMessage, 'success'))
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(function (err) {
        dispatch({ type: IMPORT_FILE_FAILURE })
        handleApiError(err, dispatch)
      })
  }
}

function deleteWaitCurriculum(
  isGov: number,
  letterNo: string,
  letterDate: string
) {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: DELETE_WAIT_CURRICULUM_REQUEST })
    try {
      var { data } = await axios.delete(
        `/WaitCurriculums?isGov=${encodeURIComponent(
          isGov
        )}&letterNo=${encodeURIComponent(
          letterNo
        )}&letterDate=${encodeURIComponent(letterDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: DELETE_WAIT_CURRICULUM_SUCCESS,
        payload: {
          waitCurriculums: data,
        },
      })
      dispatch(
        uiActions.setFlashMessage(
          get(data, 'mesg', 'ออกหนังสือเวียนสำเร็จ'),
          'success'
        )
      )
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      dispatch({ type: DELETE_WAIT_CURRICULUM_FAILURE })
      handleApiError(err, dispatch)
    }
  }
}

function loadCircularLetter(isGov: number) {
  const token = getCookie('token')
  return async (dispatch: any) => {
    dispatch({ type: LOAD_CIRCULAR_LETTER_REQUEST })
    try {
      var { data } = await axios.get(
        `/WaitCurriculums/CircularLetter?isGov=${encodeURIComponent(isGov)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_CIRCULAR_LETTER_SUCCESS,
        payload: {
          curricularLetters: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_CIRCULAR_LETTER_FAILURE })
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
  LOAD_PROGRESS_GOVERNMENT_REQUEST,
  LOAD_PROGRESS_GOVERNMENT_SUCCESS,
  LOAD_PROGRESS_GOVERNMENT_FAILURE,
  LOAD_PROGRESS_INDIVIDUAL_REQUEST,
  LOAD_PROGRESS_INDIVIDUAL_SUCCESS,
  LOAD_PROGRESS_INDIVIDUAL_FAILURE,
  LOAD_LOCK_STATUS_REQUEST,
  LOAD_LOCK_STATUS_SUCCESS,
  LOAD_LOCK_STATUS_FAILURE,
  LOAD_WAIT_CURRICULUM_REQUEST,
  LOAD_WAIT_CURRICULUM_SUCCESS,
  LOAD_WAIT_CURRICULUM_FAILURE,
  LOAD_RECOMMENDATION_REQUEST,
  LOAD_RECOMMENDATION_SUCCESS,
  LOAD_RECOMMENDATION_FAILURE,
  LOCK_REQUEST,
  LOCK_SUCCESS,
  LOCK_FAILURE,
  UNLOCK_REQUEST,
  UNLOCK_SUCCESS,
  UNLOCK_FAILURE,
  UPDATE_ROW_REQUEST,
  UPDATE_ROW_SUCCESS,
  UPDATE_ROW_FAILURE,
  IMPORT_FILE_REQUEST,
  IMPORT_FILE_SUCCESS,
  IMPORT_FILE_FAILURE,
  DELETE_WAIT_CURRICULUM_REQUEST,
  DELETE_WAIT_CURRICULUM_SUCCESS,
  DELETE_WAIT_CURRICULUM_FAILURE,
  LOAD_CIRCULAR_LETTER_REQUEST,
  LOAD_CIRCULAR_LETTER_SUCCESS,
  LOAD_CIRCULAR_LETTER_FAILURE,
  CLEAR_SEARCH_RESULT,
  loadProgressGovernment,
  loadProgressIndividual,
  loadLockStatus,
  lockRequest,
  unlockRequest,
  loadWaitCurriculum,
  loadRecommendation,
  updateRow,
  importFile,
  deleteWaitCurriculum,
  loadCircularLetter,
  clearSearchResult,
}
