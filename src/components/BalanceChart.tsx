import React, { useState, useEffect } from 'react'
import '../theme/card.scss';
import moment from 'moment';
import { IonCard, IonCardHeader, IonItem, IonCardContent, IonCardTitle, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { logoTwitter, shareAlt, chatboxes, arrowDown, arrowUp } from 'ionicons/icons';
import numbro from 'numbro'
import { connect } from '../data/connect';
import { getGraphData } from '../data/store/actions/graphAction';
import Chart from 'react-apexcharts';
import { Button } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import ReactApexChart from 'react-apexcharts';
import { setSecondChart } from '../data/store/actions/balanceChartActions';
import { useSelector, useDispatch } from 'react-redux';

interface BalanceChartProps { 
    currentBalancesTotals: any
    availableBalancesTotals: any
    // setSecondChartIndex?: any
    // secondChartIndex?: any
    title: string
}

interface DispatchProps {
  // setSecondChart: typeof setSecondChart;
}

interface StateProps {
}

const BalanceChart: React.FC<BalanceChartProps & DispatchProps & StateProps> = ({ title}) => {
    const [chartOpen, setChartOpen] = useState(true)
    const [secondChartIndex, setSecondChartIndex] = useState(-1)
    const [secondChartAvail, setSecondChartAvail] = useState([])
    const [secondChartCurr, setSecondChartCurr] = useState([])
    const [secondChartCol, setSecondChartCol] = useState([])
    const [secondTitle, setSecondTitle] = useState("")
    
    const index = useSelector((state: any) => state.secondChart.index)
    const balances = useSelector((state: any) => state.plaid.balances)



  let balanceData: any[] = []
  var numberOfAccounts = 0;
  var totalBalance = 0;
  var availableBalance = 0;
  let totalBalances: any[] = []

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  balances.forEach(function(acnt: any) {
      let acct: any[] = []
      let accountName = "";
      let totalAvailable = 0;
      let totalCurrent = 0;
      acnt.forEach(function(account: any) {
          totalBalances.push(account)
          accountName = account.accountName ;
          totalCurrent += account.currentBalance;
          totalAvailable += account.availableBalance;            
          numberOfAccounts++;
          acct.push({
              account: account.accountName,
              accountType: account.accountType,
              currentBalance: formatter.format(account.currentBalance),
              availableBalance: formatter.format(account.availableBalance),
              limit: formatter.format(account.limit),
              currency: account.currency,
              officialName: account.officialName ? account.officialName : account.accountType
          });
      });
      totalBalance += totalAvailable;
      availableBalance += totalCurrent
      balanceData.push({
          account: accountName,
          totalCurrent: formatter.format(totalCurrent),
          totalAvailable: formatter.format(totalAvailable),
          balances: acct})
  });
  var balancesByAccount = totalBalances.length > 0 ? groupBy(totalBalances, 'accountName') : []
  
  const getSecondChartData = (prop: string) => {
    if( index !== -1 ) {
      let i = 0
      for (var x in balancesByAccount) {
        if (i === index) {
          // console.log(balancesByAccount[x])
          if (prop === "accountType") {
            return groupBy(balancesByAccount[x], 'accountType')
          } else {
            return balancesByAccount[x].map((it: any) => it[prop] + Math.random() * 1000)
          }
        }
        i++
      }
      return []
    }
    return []
  }

  const availableBalancesTotals = () => {
    let totals = []
    for (var account in balancesByAccount) {
      // console.log(account)
        let t = balancesByAccount[account].reduce(function(prev: number, cur: any) {
            return prev + cur.availableBalance;
          }, 0);
        totals.push(t)
        // console.log(t)
    }
    // console.log(totals)
    return totals
  }

  const currentBalancesTotals = () => {
      let totals = []
      for (var account in balancesByAccount) {
          let t = balancesByAccount[account].reduce(function(prev: number, cur: any) {
              return prev + cur.currentBalance;
            }, 0);
          totals.push(t)
          // console.log(t)
      }
      // console.log(totals)
      return totals
  }

  const setIndex = (param: number, index: number) => {
    if (index !== param) {
      console.log(param)
      console.log(index)
      setSecondChartIndex(param)       
    } else {
      console.log(index)

      setSecondChartIndex(-1)
    }
  }

  function groupBy(arr: any[], property: any) {
    return arr.reduce(function(memo: any, x: any) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  const dispatch = useDispatch()
  
  const options = () => { 
    return {
        options: {
            chart: {
              type: 'bar',
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: true,
              }
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: Object.keys(balancesByAccount),
            }
        }
    }
  }


  const override = css`
      display: block;
      margin: 25px auto;
      size: 5px;
      width: 60px;
      height: 60px;
      border-color: red;
  `;

  useEffect(() => {
    // console.log(secondChartIndex)
    // setSecondChartIndex(index)
    setSecondChartCol(getSecondChartData("accountType"))
    setSecondChartCurr(getSecondChartData("availableBalance"))
    setSecondChartAvail(getSecondChartData("currentBalance"))
    let i = 0
    for (var x in balancesByAccount) {
      if (i === index) {
        setSecondTitle(x)
      }
      i++
    }      
  }, [index]);
    // console.log(secondChartIndex)
  return (
    <>
    <IonCard className="balanceChart chart">
        <IonCardContent className="card-content grey-text text-darken-3">
            <IonCardTitle className={"ticker-name"} >
                {title}
            </IonCardTitle>
            <IonCardContent className="chart-content">
            { chartOpen ? 
                <div className="chart">
                    { false ?  
                        <ClipLoader
                            css={override}
                            size={150}
                            //size={"150px"} this also works
                            color={"#339989"}
                            loading={true}
                        />
                        :
                        <Chart options={{
                            chart: {
                              width: '100%',
                              type: 'bar',
                              // height: 350,
                              events: {
                                dataPointSelection: function(event: any, chartContext: any, config: any) {
                                  dispatch(setSecondChart(config.dataPointIndex))
                                  // setIndex(config.dataPointIndex, secondChartIndex)
                                  // if (secondChartIndex !== config.dataPointIndex) {
                                  //   console.log(config.dataPointIndex)
                                  //   console.log(secondChartIndex)
                                  //   setSecondChartIndex(config.dataPointIndex)       
                                  // } else {
                                  //   setSecondChartIndex(-1)
                                  // }
                                }
                              }
                            },
                            tooltip: {
                              y: {
                                formatter: function(value: any) {
                                  return "$" + numbro(value).format({
                                    average: true,
                                  }
                                )                                }
                              }
                            },
                            plotOptions: {
                              bar: {
                                horizontal: true,
                              }
                            },
                            dataLabels: {
                              enabled: false
                            }, 
                            xaxis: {
                                labels: {
                                    show: true,
                                    formatter: function (value: any) {
                                        return "$" + numbro(value).format({
                                          average: true,
                                        })
                                    }
                                },
                                categories: Object.keys(balancesByAccount),
                            },
                            yaxis: {
                              labels: {
                                  show: true,
                                  formatter: function (value: any) {
                                      return value.toString().length > 10 ? value.toString().slice(0,10) + "..." : value
                                  }
                              }
                          },
                        }} series={[{
                            data: currentBalancesTotals(),
                            name: "Current Balance"
                          }, {
                            data: availableBalancesTotals(),
                            name: "Available Balance"
                          }]
                          } type="bar" height={350} />
                    }
                </div>
            : null }
            </IonCardContent>   
        </IonCardContent>
    </IonCard>
    {index !== -1 ?
      <IonCard className="balanceChart chart">
        <IonCardContent className="card-content grey-text text-darken-3">
            <IonCardTitle className={"ticker-name"} >
                {secondTitle}
            </IonCardTitle>
            <IonCardContent className="chart-content">
            { chartOpen ? 
                <div className="chart">
                    { false ?  
                        <ClipLoader
                            css={override}
                            size={150}
                            //size={"150px"} this also works
                            color={"#339989"}
                            loading={true}
                        />
                        :
                        <Chart options={{
                            chart: {
                              width: '100%',
                              type: 'bar',
                              // height: 350
                            },
                            tooltip: {
                              y: {
                                formatter: function(value: any) {
                                  return "$" + numbro(value).format({
                                    average: true,
                                  }
                                )                                }
                              }
                            },
                            plotOptions: {
                              bar: {
                                horizontal: true,
                              }
                            },
                            dataLabels: {
                              enabled: false
                            }, 
                            xaxis: {
                                labels: {
                                    show: true,
                                    formatter: function (value: any) {
                                        return "$" + numbro(value).format({
                                          average: true,
                                        })
                                    }
                                },
                                categories: Object.keys(getSecondChartData("accountType")),
                            },
                            yaxis: {
                              labels: {
                                  show: true,
                                  formatter: function (value: any) {
                                      return value.toString().length > 10 ? value.toString().slice(0,10) + "..." : value
                                  }
                              }
                          },
                        }} series={[{
                            data: secondChartCurr,
                            name: "Current Balance"
                          }, {
                            data: secondChartAvail,
                            name: "Available Balance"
                          }]
                          } type="bar" height={350} />
                        }
                      </div>
                  : null }
                  </IonCardContent>   
              </IonCardContent>
          </IonCard> 
        : null
      }
    </>
  );
}

export default BalanceChart
