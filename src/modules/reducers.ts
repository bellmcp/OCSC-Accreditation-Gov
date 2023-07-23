import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { loadingBarReducer } from 'react-redux-loading-bar'

import uiReducer from 'modules/ui/reducer'
import loginReducer from 'modules/login/reducer'
import homeReducer from 'modules/home/reducer'
import searchReducer from 'modules/search/reducer'
import personLetterReducer from 'modules/personLetter/reducer'
import infoReducer from 'modules/info/reducer'
import curriculumReducer from 'modules/curriculum/reducer'

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    loadingBar: loadingBarReducer,
    login: loginReducer,
    ui: uiReducer,
    home: homeReducer,
    search: searchReducer,
    info: infoReducer,
    personLetter: personLetterReducer,
    curriculum: curriculumReducer,
  })
