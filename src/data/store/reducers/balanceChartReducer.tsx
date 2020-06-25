import { BalanceChartActions } from '../actions/balanceChartActions';

const initialState = {
    index: -1
  };

export function balanceChartReducer(state = initialState, action: BalanceChartActions) {
  switch (action.type) {
    case 'set-second-chart':
      console.log("setting index")
      if (state.index === action.index) {
          return { ...state, index: -1 };
      } else {
          return { ...state, index: action.index };
      }
      default:
        return {
          ...state
      }
    }
}