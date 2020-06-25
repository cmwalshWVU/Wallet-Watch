import moment from "moment";

const initData = {
    currentPrices: [],
    filteredTickers: [],
    lastUpdated: moment()
}

const currentPriceReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'UPDATE_CURRENT_PRICES':
        return {
            ...state,
            currentPrices: action.prices,
            filteredTickers: action.prices,
            lastUpdated: moment()
        }
    case 'SET_FILTERED_TICKERS':
        return {
            ...state,
            filteredTickers: action.filteredTickers 
        }
    default:
        return {
            ...state
        }
    }
}

export default currentPriceReducer;