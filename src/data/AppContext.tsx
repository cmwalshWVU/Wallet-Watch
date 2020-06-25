import React, { createContext, useReducer, useEffect } from 'react';
import  reducers, { initialState, AppState } from './state'
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from "jwt-decode";
import { setCurrentUser } from './store/actions/authActions';

export interface AppContextState {
  state: AppState;
  dispatch: React.Dispatch<any>;
}

export const AppContext = createContext<AppContextState>({
  state: initialState,
  dispatch: () => undefined
});

export const AppContextProvider: React.FC = (props => {

  const [store, dispatch] = useReducer(reducers, initialState);

  // useEffect(() => {
  //   if (localStorage.jwtToken) {
  //     // Set auth token header auth
  //     const token = localStorage.jwtToken;
  //     setAuthToken(token);
  //     // Decode token and get user info and exp
  //     const decoded: any = jwt_decode(token);
  //     // Set user and isAuthenticated
  //     dispatch(setCurrentUser(decoded));
  //     // Check for expired token
  //     const currentTime = Date.now() / 1000; // to get in milliseconds
  //     if (decoded.exp < currentTime) {
  //       // Logout user
  //       // Redirect to login
  //       // history.push("/login");
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, []);

  
  return (
    <AppContext.Provider value={{
      state: store,
      dispatch
    }}>
      {props.children}
    </AppContext.Provider>
  )
});