import {
  LOAD_LOGIN_REQUEST,
  LOAD_LOGIN_SUCCESS,
  LOAD_LOGIN_FAILURE,
  CLEAR_MESSAGE_LOGIN,
  LOAD_LOGIN_LINK_REQUEST,
  LOAD_LOGIN_LINK_SUCCESS,
  LOAD_LOGIN_LINK_FAILURE,
} from './actions'
const initialState = {
  isLoading: false,
  users: [],
  status: [],
  messageLogin: null,
  forgetPasswordUrl: '',
  registrationUrl: '',
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_LOGIN_REQUEST:
      return { ...state, isLoading: true, users: [], messageLogin: [] }
    case LOAD_LOGIN_LINK_REQUEST:
      return { ...state, forgetPasswordUrl: '', registrationUrl: '' }
    case LOAD_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: action.payload.user,
        status: action.payload.status,
        messageLogin: action.payload.messageLogin,
      }
    case LOAD_LOGIN_LINK_SUCCESS:
      return {
        ...state,
        forgetPasswordUrl: action.payload.forgetPasswordUrl,
        registrationUrl: action.payload.registrationUrl,
      }
    case LOAD_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        status: action.payload.status,
        messageLogin: action.payload.messageLogin,
      }
    case CLEAR_MESSAGE_LOGIN:
      return { ...state, messageLogin: null }
    case LOAD_LOGIN_LINK_FAILURE:
    default:
      return state
  }
}
