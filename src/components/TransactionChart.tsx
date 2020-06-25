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
import { useSelector } from 'react-redux';
import { groupBy } from '../helpers/plaidHelpers';

interface TransactionChartProps { 
}

const transactionsColumns: {title:string, field: string, type? : "boolean" | "time" | "date" | "currency" | "numeric" | "datetime" | undefined, defaultGroupOrder?: number, defaultGroupSort?: "desc" | "asc" | undefined  }[] = [
  { title: "Date", field: "date", type: "date", defaultGroupSort: "desc" },
  { title: "Name", field: "name" },
  { title: "Amount", field: "amount" },
  { title: "Account", field: "account", defaultGroupOrder: 0 },
  { title: "Category", field: "category", defaultGroupOrder: 0 }

];

const TransactionChart: React.FC<TransactionChartProps> = ({ }) => {
    const [priceData, setPriceData] = useState([])
    const [dataPoints, setDataPoints] = useState()
    const [chartOpen, setChartOpen] = useState(true)
    const transactions = useSelector((state: any) => state.plaid.transactions)

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })

    let totalTransactions: any[] = []
    let transactionsData: any[] = [];
    transactions.forEach(function(account: any) {
        account.transactions.forEach(function(transaction: any) {
            transactionsData.push({
                account: account.accountName,
                date: transaction.date,
                category: transaction.category[0],
                name: transaction.name,
                amount: formatter.format(transaction.amount)
            });
            totalTransactions.push(transaction);
        });
    });


    var transactionsByCategory = groupBy(totalTransactions, 'category')


    const transactionsByCategoryTotals = () => {
        let totals = []
        for (var transaction in transactionsByCategory) {
            let t = transactionsByCategory[transaction].reduce(function(prev: number, cur: any) {
                return prev + cur.amount;
            }, 0);
            totals.push(t)
        }
        // console.log(totals)
        return totals
    }
    useEffect(() => {
        // Update the document title using the browser API
      }, []);

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
                  categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                    'United States', 'China', 'Germany'
                  ],
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

  return (
    <IonCard className="transactionChart">
        <IonCardContent className="card-content grey-text text-darken-3">
            <IonCardTitle className={"ticker-name"} >
                Transactions
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
                              labels: {
                                  show: true,
                                  formatter: function (value: any) {
                                      return "$" + numbro(value).format({
                                          average: true,
                                      })
                                  }
                              },
                              categories: Object.keys(transactionsByCategory),
                          }
                        }} series={[{
                          data: transactionsByCategoryTotals(),
                          name: "Transactions"
                        }]
                          } type="bar" height={350} />
                    }
                </div>
            : null }
            </IonCardContent>   
        </IonCardContent>
    </IonCard> 
  );
}

export default TransactionChart
