import { createSelector } from 'reselect';
import { parseISO as parseDate } from 'date-fns';
import { AppState } from './state';

export const getCurrentPrices = (state: AppState) => state.currentPrices.currentPrices;
export const getLastUpdated = (state: AppState) => state.currentPrices.lastUpdated;
