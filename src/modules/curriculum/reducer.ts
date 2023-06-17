import {
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
  LOAD_CIRCULAR_LETTER_REQUEST,
  LOAD_CIRCULAR_LETTER_SUCCESS,
  LOAD_CIRCULAR_LETTER_FAILURE,
  CLEAR_SEARCH_RESULT,
} from './actions'

const initialState = {
  isLoading: false,
  isLoadingGovernment: false,
  isLoadingIndividual: false,
  isSearching: false,
  isRecommending: false,
  progressGovernment: [],
  progressIndividual: [],
  isLocked: false,
  lockMessage: '',
  waitCurriculums: [],
  recommendations: [],
  curricularLetters: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_PROGRESS_GOVERNMENT_REQUEST:
      return { ...state, isLoadingGovernment: true, progressGovernment: [] }
    case LOAD_PROGRESS_INDIVIDUAL_REQUEST:
      return { ...state, isLoadingIndividual: true, progressIndividual: [] }
    case LOAD_LOCK_STATUS_REQUEST:
      return { ...state, isLoading: true, isLocked: false, lockMessage: '' }
    case LOAD_WAIT_CURRICULUM_REQUEST:
      return { ...state, isSearching: true, waitCurriculums: [] }
    case LOAD_RECOMMENDATION_REQUEST:
      return { ...state, isRecommending: true, recommendations: [] }
    case LOAD_CIRCULAR_LETTER_REQUEST:
      return { ...state, isLoading: true, curricularLetters: [] }
    case LOAD_PROGRESS_GOVERNMENT_SUCCESS:
      return {
        ...state,
        isLoadingGovernment: false,
        progressGovernment: action.payload.progressGovernment,
      }
    case LOAD_PROGRESS_INDIVIDUAL_SUCCESS:
      return {
        ...state,
        isLoadingIndividual: false,
        progressIndividual: action.payload.progressIndividual,
      }
    case LOAD_LOCK_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLocked: action.payload.isLocked,
        lockMessage: action.payload.lockMessage,
      }
    case LOAD_WAIT_CURRICULUM_SUCCESS:
      return {
        ...state,
        isSearching: false,
        waitCurriculums: action.payload.waitCurriculums,
      }
    case LOAD_RECOMMENDATION_SUCCESS:
      return {
        ...state,
        isRecommending: false,
        recommendations: action.payload.recommendations,
      }
    case LOAD_CIRCULAR_LETTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        curricularLetters: action.payload.curricularLetters,
      }
    case LOAD_PROGRESS_GOVERNMENT_FAILURE:
      return { ...state, isLoadingGovernment: false }
    case LOAD_PROGRESS_INDIVIDUAL_FAILURE:
      return { ...state, isLoadingIndividual: false }
    case LOAD_CIRCULAR_LETTER_FAILURE:
    case LOAD_LOCK_STATUS_FAILURE:
      return { ...state, isLoading: false }
    case LOAD_WAIT_CURRICULUM_FAILURE:
      return { ...state, isSearching: false }
    case LOAD_RECOMMENDATION_FAILURE:
      return { ...state, isRecommending: false }
    case CLEAR_SEARCH_RESULT:
      return { ...state, waitCurriculums: [] }
    default:
      return state
  }
}
