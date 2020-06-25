import Axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const groupBy = (arr: any[], property: any) => {
    return arr.reduce(function(memo: any, x: any) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

// // Login - get user token
// export const loginUser = (userData: any) => {
//     return Axios
//       .post("/api/users/login", userData)
//       .then(async res => {
//         // Save to localStorage
  
//         // Set token to localStorage
//         const { token } = res.data;
//         localStorage.setItem("jwtToken", token);
//         // Set token to Auth header
//         await setAuthToken(token);
//         // Decode token to get user data
//         const decoded = jwt_decode(token);
//         // Set current user
//         // dispatch(setCurrentUser(decoded));
        
//         return decoded
//       })
//       .catch(err => {
//         console.log({err})
//         // dispatch({
//         //   type: GET_ERRORS,
//         //   payload: err
//         // })
//         return false
//       }
//       );
//     };