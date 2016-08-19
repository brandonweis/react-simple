import { combineReducers } from 'redux'
import users from './reducers/users'
import groups from './reducers/groups'
import doors from './reducers/doors'
import auth from './reducers/auth'

export default combineReducers({
  users,
  doors,
  groups,
  auth
})
