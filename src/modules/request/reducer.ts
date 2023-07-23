import {
  SEARCH_PERSON_LETTER_REQUEST,
  SEARCH_PERSON_LETTER_SUCCESS,
  SEARCH_PERSON_LETTER_FAILURE,
  LOAD_PERSON_LETTER_REQUEST,
  LOAD_PERSON_LETTER_SUCCESS,
  LOAD_PERSON_LETTER_FAILURE,
  LOAD_UPLOAD_NOTE_REQUEST,
  LOAD_UPLOAD_NOTE_SUCCESS,
  LOAD_UPLOAD_NOTE_FAILURE,
  CLEAR_SEARCH_RESULT,
} from './actions'

const initialState = {
  isLoading: false,
  isSearching: false,
  searchResults: [],
  personLetter: {},
  personLetterItems: [],
  uploadNote: {},
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SEARCH_PERSON_LETTER_REQUEST:
      return { ...state, isSearching: true, searchResults: [] }
    case LOAD_PERSON_LETTER_REQUEST:
      return {
        ...state,
        isLoading: true,
        personLetter: {},
        personLetterItems: [],
      }
    case LOAD_UPLOAD_NOTE_REQUEST:
      return {
        ...state,
        uploadNote: {},
      }
    case SEARCH_PERSON_LETTER_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.payload.searchResults,
      }
    case LOAD_PERSON_LETTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        personLetter: action.payload.personLetter,
        personLetterItems: action.payload.personLetterItems,
      }
    case LOAD_UPLOAD_NOTE_SUCCESS:
      return {
        ...state,
        uploadNote: action.payload.uploadNote,
      }
    case SEARCH_PERSON_LETTER_FAILURE:
      return { ...state, isSearching: false }
    case LOAD_PERSON_LETTER_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case CLEAR_SEARCH_RESULT:
      return { ...state, searchResults: [] }
    case LOAD_UPLOAD_NOTE_FAILURE:
    default:
      return state
  }
}
