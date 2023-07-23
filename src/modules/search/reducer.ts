import {
  SEARCH_PERSON_LETTER_ITEMS_REQUEST,
  SEARCH_PERSON_LETTER_ITEMS_SUCCESS,
  SEARCH_PERSON_LETTER_ITEMS_FAILURE,
  CLEAR_SEARCH_RESULT,
} from './actions'

const initialState = {
  isLoading: false,
  isSearching: false,
  searchResults: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SEARCH_PERSON_LETTER_ITEMS_REQUEST:
      return { ...state, isSearching: true, searchResults: [] }
    case SEARCH_PERSON_LETTER_ITEMS_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.payload.searchResults,
      }
    case SEARCH_PERSON_LETTER_ITEMS_FAILURE:
      return { ...state, isSearching: false }
    case CLEAR_SEARCH_RESULT:
      return { ...state, searchResults: [] }
    default:
      return state
  }
}
