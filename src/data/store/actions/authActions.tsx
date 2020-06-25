import axios from "axios";
import setAuthToken from "../../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { auth, adminAuth, firestore } from "../firebase/firebase";
import jwt from "jsonwebtoken";
import keys from "../firebase/keys";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// Register User
export const registerUser = (userData: any, history: any) => (dispatch: any) => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = (userData: any) => async (dispatch: any) => {
  const res = await axios
    .post("/api/users/login", userData)
    .then(async res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      await setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      
      return true
    })
    .catch(err => {
      console.log({err})
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
      return false
    }
    );

  return res
};

export const loadUserSession = (decoded: any) => async (dispatch: any) => {
  console.log("TEST")
  dispatch(setCurrentUser(decoded));
}

// Set logged in user
export const setCurrentUser = (decoded: any) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => (dispatch: any) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};



export const forgotPassword = (credentials: any) => {
  return (dispatch: any, getState: any) => {
      auth.sendPasswordResetEmail(
          credentials.email
      ).then(() => {
          dispatch({ type: 'PASSWORD_RESET_EMAIL_RESET_SENT'});
      }).catch((err: any) => {
          dispatch({ type: 'PASSWORD_RESET_EMAIL_RESET_ERROR', err });
      })
  }
}

export const signIn = (credentials: any) => {
  return (dispatch: any, getState: any) => {

      auth.signInWithEmailAndPassword(
          credentials.email,
          credentials.password
      ).then((response) => {
        dispatch({type: "SET_FIREBASE_USER", user: response.user})
        console.log(response.user)
        adminAuth.createCustomToken(response!!.user!!.uid).then((token: any) => {
          console.log("Token " + token)
          jwt.sign(
            token,
            keys.secretOrKey,
            {
            },
            (err, token2) => {
              console.log("err " + err)
              console.log("Token " + token2)

              localStorage.setItem("jwtToken", "Bearer " + token2);
              setAuthToken("Bearer " +token2);
              // Decode token to get user data
              // const decoded = jwt_decode("Bearer " +token2);
              // Set current user
              dispatch(setCurrentUser("Bearer " + credentials));
            });
        }).catch((err: any) => {
          console.log("error " + err)
        })
        dispatch({ type: 'LOGIN_SUCCESS'});
      }).catch((err: any) => {
        dispatch({ type: 'LOGIN_ERROR', err });
      })
  }
}


export const signInWithCustomToken = (token: any) => {
  return (dispatch: any, getState: any) => {
      auth.signInWithCustomToken(token).then((response: any) => {
          const accessToken = JSON.parse(JSON.stringify(response.user)).stsTokenManager.accessToken
          dispatch({ type: 'COINBASE_LOGIN_SUCCESS', token: accessToken});
      }).catch((err: any) => {
          dispatch({ type: 'COINBASE_LOGIN_ERROR', err });
      })
  }
}


export const signOut = () => {
  return (dispatch: any, getState: any) => {
      auth.signOut().then(() => {
          dispatch({ type: 'SIGNOUT_SUCCESS' });
      })
  }
}

export const signUp = ( newUser: any ): Promise<boolean> => {
  return auth.createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
  ).then((resp: any) => {
      firestore.collection('users').doc(resp.user.uid).set({
          name: newUser.name,
          email: newUser.email
      })
  }).then(() => {
      return true
  }).catch((err: any) => {
      console.log(err)
      return false
  })
}