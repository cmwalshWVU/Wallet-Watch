import { UserActions } from '../actions/userActions';
import { UserState } from '../../user/user.state';

const initState = {
  hasSeenTutorial: false,
  darkMode: false,
  isLoggedin: false,
  loading: false
}

const userReducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    default:
      return {
          ...state
      }
  }
}

export default userReducer