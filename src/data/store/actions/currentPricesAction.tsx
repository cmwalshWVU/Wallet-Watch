import axios from 'axios';
import setAuthToken from '../../../utils/setAuthToken';

const options = {
    headers: {}
  };

export function getCurrentPrices() {
    delete axios.defaults.headers.common["Authorization"];

    return(dispatch: any) =>{
        return axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=20")
            .then(response => {
                dispatch(updateCurrentPrices(response.data));
                setAuthToken(localStorage.getItem("jwtToken"));

            })
            .catch(err => console.log(err));
    }
}

export function updateCurrentPrices(prices: any) {
    return {
        type: 'UPDATE_CURRENT_PRICES',
        prices: prices
    }
}


export const setFilteredTickers = (filteredTickers: any[]) => ({
    type: 'SET_FILTERED_TICKERS',
    filteredTickers
  } as const);
  