import userReducer from './store/reducers/userReducer';
import accountReducer from "./store/reducers/accountReducer";
import authReducer from "./store/reducers/authReducer";
import errorReducer from "./store/reducers/errorReducer";
import newsReducer from './store/reducers/newsReducer';
import currentPriceReducer from './store/reducers/currentPriceReducer';
import graphReducer from './store/reducers/graphReducer';
import moment from 'moment';
import { balanceChartReducer } from './store/reducers/balanceChartReducer';
import { combineReducers } from 'redux';

export const initialState: any = {
  user: {
    hasSeenTutorial: false,
    darkMode: false,
    isLoggedin: false,
    loading: false
  },
  auth: {
    isAuthenticated: false,
    user: {},
    loading: false
  },
  plaid: {
    accounts: [],
    accountsLoading: true,
    balances: [],
    balancesLoading: false,
    transactions: [],
    transactionsLoading: true,
    assetReport: null,
    assetReportId: null
  },
  errors: [],
  news: [],
  currentPrices: {
    currentPrices: [],
    filteredTickers: [],
    lastUpdated: moment()
  },
  prices: [],
  secondChart: {
    index: -1
  }
};

const reducers = combineReducers({
  user: userReducer,
  auth: authReducer,
  plaid: accountReducer,
  errors: errorReducer,
  news: newsReducer,
  currentPrices: currentPriceReducer,
  prices: graphReducer,
  secondChart: balanceChartReducer
});

export default reducers

export type AppState = ReturnType<typeof reducers>;