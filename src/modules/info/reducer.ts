import {
  LOAD_COUNTRIES_REQUEST,
  LOAD_COUNTRIES_SUCCESS,
  LOAD_COUNTRIES_FAILURE,
  LOAD_SALARY_GROUPS_REQUEST,
  LOAD_SALARY_GROUPS_SUCCESS,
  LOAD_SALARY_GROUPS_FAILURE,
  LOAD_EDUCATION_LEVELS_REQUEST,
  LOAD_EDUCATION_LEVELS_SUCCESS,
  LOAD_EDUCATION_LEVELS_FAILURE,
  LOAD_UNIVERSITIES_REQUEST,
  LOAD_UNIVERSITIES_SUCCESS,
  LOAD_UNIVERSITIES_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  isUniversitiesLoading: false,
  countries: [],
  salaryGroups: [],
  educationLevels: [],
  universities: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_COUNTRIES_REQUEST:
      return { ...state, isLoading: true, countries: [] }
    case LOAD_SALARY_GROUPS_REQUEST:
      return { ...state, isLoading: true, salaryGroups: [] }
    case LOAD_EDUCATION_LEVELS_REQUEST:
      return { ...state, isLoading: true, educationLevels: [] }
    case LOAD_UNIVERSITIES_REQUEST:
      return { ...state, isUniversitiesLoading: true, universities: [] }
    case LOAD_COUNTRIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        countries: action.payload.countries,
      }
    case LOAD_SALARY_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        salaryGroups: action.payload.salaryGroups,
      }
    case LOAD_EDUCATION_LEVELS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        educationLevels: action.payload.educationLevels,
      }
    case LOAD_UNIVERSITIES_SUCCESS:
      return {
        ...state,
        isUniversitiesLoading: false,
        universities: action.payload.universities,
      }
    case LOAD_COUNTRIES_FAILURE:
    case LOAD_SALARY_GROUPS_FAILURE:
    case LOAD_EDUCATION_LEVELS_FAILURE:
      return { ...state, isLoading: false }
    case LOAD_UNIVERSITIES_FAILURE:
      return { ...state, isUniversitiesLoading: false }
    default:
      return state
  }
}
