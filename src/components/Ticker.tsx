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

interface StateProps {
    prices: any;
}
  
interface DispatchProps {
    getGraphData: typeof getGraphData
}

interface TickerProps { 
    crypto: any;
    id: any;
    ticker: string;
}

const Ticker: React.FC<TickerProps & StateProps & DispatchProps> = ({ prices, ticker, crypto, id, getGraphData }) => {
    const [priceData, setPriceData] = useState([])
    const [dataPoints, setDataPoints] = useState()
    const [chartOpen, setChartOpen] = useState(true)

    useEffect(() => {
        // Update the document title using the browser API
        getGraphData(crypto.symbol)
      }, []);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
   
    const options = () => { 
        return {
            chart: {
                type: 'line',
                toolbar: { tools: { download: false } },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: false,
                },
                menu: {
                    show: false
                }
            },
                      
            // colors: ['#3EC300'],
            colors: [function(props: any) {
                console.log(props.w.config.series[0].data)
                console.log(props.w.config.series[0].data[props.w.config.series[0].data.length-1])
                if (props.w.config.series[0].data[props.w.config.series[0].data.length-1].y[0] > props.w.config.series[0].data[0].y[0]) {
                    return '#72D345'
                } else {
                    return '#F8454D'
                }
              }],
            // D63230
            grid: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    show: false
                    
                },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth',
              width: 4
            },
            yaxis: {
                labels: {
                    align: 'right',
                    show: true,
                    formatter: function (value: any) {
                        if (value < .5) {
                            return "$" + numbro(value).format({
                                average: true,
                                mantissa: 4,
                            })                        }
                        return "$" + numbro(value).format({
                            average: true,
                            mantissa: 2,
                        })
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            xaxis: {
                labels: {
                    show: false,
                    formatter: function (value: any) {
                        return new Date(value).toLocaleString()
                    }
                },
                type: 'datetime',
                tooltip: {
                    enabled: true
                }
            },
          }
    }

    const setPoints = () => {
        let points = []
        if(prices !== undefined && prices.Data !== undefined) {

            let highest = {
                x: new Date(prices.Data[0].time * 1000).toLocaleString(),
                y: prices.Data[0].close,
                marker: {
                    size: 8,
                    fillColor: '#fff',
                    strokeColor: 'red',
                    radius: 2,
                    cssClass: 'apexcharts-custom-class'
                    },
                    label: {
                    borderColor: '#FF4560',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#FF4560',
                    },
                    text: 'Point Annotation',
                }
            }
            let lowest = {
                x: new Date(prices.Data[0].time * 1000).toLocaleString(),
                y: prices.Data[0].close,
                marker: {
                    size: 8,
                    fillColor: '#fff',
                    strokeColor: 'red',
                    radius: 2,
                    cssClass: 'apexcharts-custom-class'
                },
                label: {
                    borderColor: '#FF4560',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#FF4560',
                    },
                    text: 'Point Annotation',
                }
            }
            prices.Data.forEach((record: any) => {
                if (record.close > highest.y) {
                    highest = {
                            x: new Date(record.time * 1000).toLocaleString(),
                            y: record.close,
                            marker: {
                            size: 8,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 2,
                            cssClass: 'apexcharts-custom-class'
                        },
                        label: {
                            borderColor: '#FF4560',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#FF4560',
                            },
                            text: record.close,
                        }
                    }
                }
                if (record.close < lowest.y) {
                    lowest = {
                            x: new Date(record.time * 1000).toLocaleString(),
                            y: record.close,
                            marker: {
                            size: 8,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 2,
                            cssClass: 'apexcharts-custom-class'
                        },
                        label: {
                            borderColor: '#FF4560',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#FF4560',
                            },
                            text: record.close,
                        }
                    }
                }
            });
            points.push(highest, lowest)
        }
        return points
    }

    const series = () => {
        let priceData = []

        if(prices === undefined || prices.Data === undefined || prices.Data.length === 0) {
            let data = [{
                x: new Date(0),
                y: [0, 0, 0, 0]
            },
            {
                x: new Date(1),
                y: [0,0,0,0]
            }
            ]
            priceData.push({data});
        }
        else {
            let data: any = [];
            // console.log(`foreach ${prices.Data}`)
            try {
                prices.Data.forEach((record: any) => {
                    var obj: any = {};
                    obj.x = new Date(record.time * 1000).toLocaleString();
                    obj.y = [record.close];
                    data.push(obj);               
                });
                priceData.push({data});
            } catch {
                let data = [{
                    x: new Date(0),
                    y: [0, 0, 0, 0]
                },
                {
                    x: new Date(1),
                    y: [0,0,0,0]
                }
                ]
                priceData.push({data});
            }
        }
        // console.log(priceData)
        return priceData
    }   
  
    const override = css`
        display: block;
        margin: 25px auto;
        size: 5px;
        width: 60px;
        height: 60px;
        border-color: red;
    `;
    const s = series()
  return (
    <IonCard className="ticker">
        <IonCardContent className="ticker-card-content grey-text text-darken-3">
            <IonCardTitle className={"ticker-name"} >
                {crypto.name}
                <div className={"trading-pair"} > 
                    ({crypto.symbol}/USD)
                </div>
                <div className={"trading-pair"} > 
                    Rank: {crypto.rank}
                </div>
                {/* {chartOpen ? <ExpandMore className={"ticker-collapse"} onClick={() => setChartOpen(false)}/>
                            : <ExpandLess className={"ticker-collapse"} onClick={() => setChartOpen(true)} />
                        } */}
                {/* <div className={"ticker-rank"}>Rank: {crypto.rank}</div> */}
            </IonCardTitle>
            <IonCardContent className="chart-content">
            { chartOpen ? 
                <div className="chart">
                    { prices === undefined || prices.Data.length < 1 ?  
                        <ClipLoader
                            css={override}
                            size={150}
                            //size={"150px"} this also works
                            color={"#339989"}
                            loading={true}
                        />
                        :
                        <Chart height={150} options={options()} type="line" 
                            series={[{
                                data: series()[0].data,
                                name: ticker
                            }]} />
                    }
                </div>
            : null }
            </IonCardContent>
            <IonRow justify-content-center>
                <IonCol text-center >
                    <IonRow className={"ticker-row"}>
                        Market Cap
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"} >
                        {/* { formatter.format(crypto.crypto.market_cap_usd)} */}
                        ${ numbro(crypto.market_cap_usd).format({
                            average: true,
                            mantissa: 2,
                        })}

                    </IonRow>
                </IonCol>
                <IonCol text-center >
                    <IonRow className={"ticker-row"}>
                        Volume (24h)
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"} >
                        {/* {formatter.format(crypto.crypto['24h_volume_usd'])} */}
                        ${ numbro(crypto['24h_volume_usd']).format({
                            average: true,
                            mantissa: 2,
                        })}
                    </IonRow>
                </IonCol>

                <IonCol text-center >
                    <IonRow className={"ticker-row"}>
                        % Change (24h)
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"}>
                        {crypto.percent_change_24h}%
                    </IonRow>
                </IonCol>
                <IonCol text-left >
                    <IonRow className={"ticker-row"}>
                        % Change (1h)
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"}>
                        {crypto.percent_change_1h}%
                    </IonRow>
                </IonCol>
            </IonRow>
        </IonCardContent>
    </IonCard> 
  );
}

export default connect<TickerProps, StateProps, {}>({
    mapStateToProps: (state, props) => ({
        prices: state.prices[props.crypto.symbol]
    }),
    mapDispatchToProps: ({
        getGraphData
    }),
    component: Ticker
  })  
