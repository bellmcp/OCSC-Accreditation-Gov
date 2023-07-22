import {
  LOAD_HOME_CONTENT_REQUEST,
  LOAD_HOME_CONTENT_SUCCESS,
  LOAD_HOME_CONTENT_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  announcement: '',
  howTo: '',
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_HOME_CONTENT_REQUEST:
      return { ...state, isLoading: true, announcement: '', howTo: '' }
    case LOAD_HOME_CONTENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        announcement: action.payload.announcement,
        howTo: action.payload.howTo,
      }
    case LOAD_HOME_CONTENT_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}
