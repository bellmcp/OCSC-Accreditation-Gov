import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { loadingBarReducer } from 'react-redux-loading-bar'

import uiReducer from 'modules/ui/reducer'
import loginReducer from 'modules/login/reducer'
import homeReducer from 'modules/home/reducer'
import requestReducer from 'modules/request/reducer'
import searchReducer from 'modules/search/reducer'

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    loadingBar: loadingBarReducer,
    login: loginReducer,
    ui: uiReducer,
    home: homeReducer,
    request: requestReducer,
    search: searchReducer,
  })
