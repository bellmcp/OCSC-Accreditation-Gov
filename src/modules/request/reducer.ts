import {
  SEARCH_PERSON_LETTER_REQUEST,
  SEARCH_PERSON_LETTER_SUCCESS,
  SEARCH_PERSON_LETTER_FAILURE,
  CLEAR_SEARCH_RESULT,
} from './actions'

const initialState = {
  isLoading: false,
  isSearching: false,
  isIncrementing: false,
  educationLevels: [],
  searchResults: [],
  visitor: 0,
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SEARCH_PERSON_LETTER_REQUEST:
      return { ...state, isSearching: true, searchResults: [] }
    case SEARCH_PERSON_LETTER_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.payload.searchResults,
      }
    case SEARCH_PERSON_LETTER_FAILURE:
      return { ...state, isSearching: false }

    case CLEAR_SEARCH_RESULT:
      return { ...state, searchResults: [] }
    default:
      return state
  }
}
