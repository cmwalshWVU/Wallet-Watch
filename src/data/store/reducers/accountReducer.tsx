import {
    ADD_ACCOUNT,
    DELETE_ACCOUNT,
    GET_ACCOUNTS,
    ACCOUNTS_LOADING,
    GET_TRANSACTIONS,
    TRANSACTIONS_LOADING,
    GET_BALANCES,
    BALANCES_LOADING,
    SET_ASSET_REPORT,
    SET_ASSET_REPORT_ID
  } from "../actions/types";
  const initialState = {
    accounts: [],
    transactions: [],
    accountsLoading: false,
    transactionsLoading: false,
    balances: [],
    assetReport: null,
    assetReportId: null
  };
  export default function(state = initialState, action: any) {
    switch (action.type) {
        case ACCOUNTS_LOADING:
            return {
                ...state,
                accountsLoading: true
            };
        case ADD_ACCOUNT:
            return {
                ...state,
                accounts: [ ...state.accounts, action.payload]
            };
        case DELETE_ACCOUNT:
            return {
                ...state,
                accounts: state.accounts.filter(
                    (account: any) => account._id !== action.payload
            )
            };
        case GET_ACCOUNTS:
            return {
                ...state,
                accounts: action.payload,
                accountsLoading: false
            };
        case TRANSACTIONS_LOADING:
            return {
                ...state,
                transactionsLoading: true
            };
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload,
                transactionsLoading: false
            };
        case BALANCES_LOADING:
            return {
                ...state,
                balancesLoading: true
            };
        case GET_BALANCES:
            return {
                ...state,
                balances: action.payload,
                balancesLoading: false
            };
        case SET_ASSET_REPORT:
            return {
                ...state,
                assetReport: action.payload,
            };
        case SET_ASSET_REPORT_ID:
            return {
                ...state,
                assetReportId: action.payload,
            };
      default:
        return state;
    }
  }