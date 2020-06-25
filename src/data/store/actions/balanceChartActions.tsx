import { ActionType } from "../../../utils/types";

export const setSecondChart = (index: number) => ({
    type: 'set-second-chart',
    index
  } as const);

  export type BalanceChartActions =
  | ActionType<typeof setSecondChart>
