import axios from "axios";
import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  ACCOUNTS_LOADING,
  GET_TRANSACTIONS,
  TRANSACTIONS_LOADING,
  BALANCES_LOADING,
  GET_BALANCES,
  SET_ASSET_REPORT,
  SET_ASSET_REPORT_ID
} from "./types";
import { client } from "../plaid/plaid";
import { firestore, auth } from "../firebase/firebase";
// Actions will go here

// Add account
export const addAccount = (plaidData: any) => (dispatch: any) => {
  const user = auth.currentUser

    axios.post("/api/plaid/accounts/add", {plaidData, userId: user!.uid})
      .then(res =>
        dispatch({
          type: ADD_ACCOUNT,
          payload: res.data
        })
      )
      .then(data =>
        plaidData.accounts ? dispatch(getTransactions(plaidData.accounts.concat(data.payload))) : null
      )
      .catch(err => console.log(err));
};

// Add account
export const addNewAccount = (plaidData: any): any =>{
  const PUBLIC_TOKEN = localStorage.jwtToken;
  const user = auth.currentUser

  if (PUBLIC_TOKEN) {
    axios.post("/api/plaid/accounts/add", {plaidData, userId: user!.uid})
      .then((resp: any) => {
        const ACCESS_TOKEN = resp.data.access_token;
        const ITEM_ID = resp.data.item_id;
        // Check if account already exists for specific user
        var docRef = firestore.collection('plaidAccounts').doc(user!.uid).collection("accounts").doc(plaidData.metadata.institution.itemId)
        return docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log("Error: Duplicate dependent address ")
            return false
          } else {
            const newAccount = {
              userId: user!.uid,
              accessToken: ACCESS_TOKEN,
              itemId: ITEM_ID,
              institutionId: plaidData.metadata.institution.institution_id,
              institutionName: plaidData.metadata.institution.name
          };
            docRef.set(newAccount).then(() => {
              return newAccount
            })
          }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            return null
        });
    }).catch((err: any) => {
      console.log(err)
      return null
    }); // Plaid Error
  }
  return null
};


export const dispatchAddAccount = (accounts: any, data: any) => (dispatch: any) => {
  dispatch({
    type: ADD_ACCOUNT,
    payload: data
  }).then((data: any) =>
    accounts ? dispatch(getTransactions(accounts.concat(data.payload))) : null
  )
}

  // Delete account
export const deleteAccount = (plaidData: any) => (dispatch: any) => {
  const user = auth.currentUser
  if (window.confirm("Are you sure you want to remove this account?")) {
    const id = plaidData.id;
    const newAccounts = plaidData.accounts.filter(
      (account: any) => account._id !== id
    );
    firestore.collection('plaidAccounts').doc(user!.uid).collection("accounts").doc(id).delete().then(function() {
      console.error("Success removing document: ");
      dispatch({
        type: DELETE_ACCOUNT,
        payload: id
      })
    }).then(newAccounts ? dispatch(getTransactions(newAccounts)) : null)
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
    // axios.delete(`/api/plaid/accounts/${id}`)
    //   .then(res =>
    //     dispatch({
    //       type: DELETE_ACCOUNT,
    //       payload: id
    //     })
    //   )
    //   .then(newAccounts ? dispatch(getTransactions(newAccounts)) : null)
    //   .catch(err => console.log(err));
  }
};

  // Get all accounts for specific user
export const getAccounts = () => (dispatch: any) => {
  console.log("calling get accounts")
    dispatch(setAccountsLoading());
    const accounts = axios
      .get("/api/plaid/accounts")
      .then(res => {
        // dispatch({
        //   type: GET_ACCOUNTS,
        //   payload: res.data
        // })
        return res.data
      })
      .catch(err => {
        // dispatch({
        //   type: GET_ACCOUNTS,
        //   payload: []
        // })
        return []
      });
    return accounts
  };
  // Accounts loading
  export const setAccountsLoading = () => {
    return {
      type: ACCOUNTS_LOADING
    };
};

// Get all accounts for specific user
export const getFirebaseAccounts = (): any => {
  const user = auth.currentUser

  if (user) {
    const accounts = firestore.collection('plaidAccounts').doc(user!.uid).collection("accounts").get()
      .then(res => {
          const accounts:any[] = []
          res.forEach(r => {
            const data = r.data()
            accounts.push(data)
          })
          // dispatch({
          //   type: GET_ACCOUNTS,
          //   payload: accounts
          // })
          console.log(accounts)
          return accounts
      })
      .catch(err => {
          console.log(err)     
          return []      
    });

    return accounts
  }
};


// Get Transactions
export const getTransactions = (plaidData: any) => (dispatch: any) => {
  console.log("TEST1")
    dispatch(setTransactionsLoading());
    axios
      .post("https://wallet-watch-server.herokuapp.com/api/plaid/accounts/transactions", plaidData)
      .then(res =>
        dispatch({
          type: GET_TRANSACTIONS,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_TRANSACTIONS,
          payload: []
        })
      );
  };
  // Transactions loading
  export const setTransactionsLoading = () => {
    return {
      type: TRANSACTIONS_LOADING
    };
};

// Get Transactions
export const getBalances = (plaidData: any) => (dispatch: any) => {
  console.log("calling get balances")

  console.log("TEST1")
  dispatch(setBalancesLoading());
    axios
      .post("https://wallet-watch-server.herokuapp.com/api/plaid/accounts/balances", plaidData)
      .then(res => {
        console.log("success")
        dispatch({
          type: GET_BALANCES,
          payload: res.data
        })
    }
      )
      .catch(err => {
        console.log("error")
        dispatch({
            type: GET_BALANCES,
            payload: []
          })
      } 
      );
  };
  // Transactions loading
  export const setBalancesLoading = () => {
    return {
      type: BALANCES_LOADING
    };
};

export const createAssetReport = (plaidData: any) => (dispatch: any) => {
  console.log("Asset Test")
    axios
      .post("https://wallet-watch-server.herokuapp.com/api/plaid/assets", plaidData)
      .then(res => {
        console.log("assets")
        console.log(res.data)

        dispatch({
          type: SET_ASSET_REPORT_ID,
          payload: res.data.asset_report_token
        })
    }
      )
      .catch(err => {
        console.log("asset error")
        dispatch({
            type: SET_ASSET_REPORT_ID,
            payload: null
          })
      } 
      );
  };

  export const getAssetReport = (plaidData: any, token: string) => (dispatch: any) => {
    console.log(token)
      axios
        .post(`https://wallet-watch-server.herokuapp.com/api/plaid/getAssets/${token}`, plaidData)
        .then(res => {
          console.log("Got Assets")
          console.log(res.data)
  
          dispatch({
            type: SET_ASSET_REPORT,
            payload: res.data.asset_report_id
          })
      }
        )
        .catch(err => {
          console.log("asset error")
          dispatch({
              type: SET_ASSET_REPORT,
              payload: null
            })
        } 
        );
    };