import React, { Component } from 'react';
import moment from 'moment';
import Pusher from 'pusher-js';
import {getCurrentPrices} from '../data/store/actions/currentPricesAction';
import Ticker from './Ticker';
import { connect } from '../data/connect';
import { IonHeader, IonCard, IonCardContent, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import setAuthToken from '../utils/setAuthToken';
import { TickerChip } from './TickerChip';
import * as selectors from '../data/selectors';

class TickerList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			updateHistory: true,
			prices: [],
			modalOpen: false,
			ticker: null
		};
	}

	componentDidMount = async () => {
		await this.props.getCurrentPrices()
		setAuthToken(localStorage.getItem("token"));
		const pusher = new Pusher(process.envREACT_PUSHER_ID, {
			cluster: 'us2',
			encrypted: true
		});

        const channel = pusher.subscribe('news-channel');
        channel.bind('update-prices', data => {
			console.log(JSON.stringify(data.prices.Data));
            this.setState({
                prices: [...data.prices.Data, ...this.state.prices],
            });
        });
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	toggleModal = () => {
		this.setState({modalOpen: !this.state.modalOpen})
	}

	setGraphTicker = (ticker) => {
		this.setState({ticker: ticker})
	}

	render() {
		var tickerData = this.props.currentPrices == null ? this.state.data : this.props.currentPrices;
		// var top10 = tickerData.filter(currency => currency.rank <= );
		// var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
		// var result = tickerData.filter(currency => wanted.includes(currency.id));
		var tickers = tickerData.map((currency, index) => {
			if(this.props.filteredTickerList.indexOf(currency.symbol) > -1) {
				return (
					<IonCol size="12" size-md="3" key={index}>
						<Ticker ticker={currency.symbol} crypto={currency} />
					</IonCol>
				)
			}
		});


		return (
			<IonContent className="tickers">
                <IonList>
                    <IonGrid fixed className={"ticker-grid"}>
                        <IonRow align-items-stretch>
                        {!this.state.isLoading ? tickers : noData}
                        </IonRow>
                    </IonGrid>
                </IonList>
            </IonContent>
            // <div >
            //     <ul className="tickers">{!this.state.isLoading ? tickers : noData}</ul>
            // </div>
		);
	}
}

const noData = (
    <div className="dashboard-section section">
		<div className="rounded-card card z-depth-0">
			<div className="card-content">
				<span >Loading Ticker Data... </span>
			</div>
		</div>
	</div>
);

const mapStateToProps = (state) => {
	return {
		currentPrices: state.currentPrices.currentPrices,
		lastUpdated: selectors.getLastUpdated(state),
	}
}

export default connect({
	mapStateToProps, 
	mapDispatchToProps: ({
		getCurrentPrices
	}),
    component: TickerList
  });