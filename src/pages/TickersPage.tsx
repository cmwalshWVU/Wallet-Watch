import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonGrid, IonRow, IonCol, IonButton, IonIcon, getConfig, IonModal } from '@ionic/react';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import './SpeakerList.scss';
import ArticleList from '../components/ArticleList';
import TickerList from '../components/TickerList';
import { options } from 'ionicons/icons';
import TickersFilter from '../components/TickersFilter';
import { Moment } from 'moment';

interface OwnProps { };

interface StateProps {
  mode: 'ios' | 'md';
  currentPrices: any[];
  lastUpdated: Moment;
};

interface DispatchProps { };

interface TickersPageProps extends OwnProps, StateProps, DispatchProps { };

const TickersPage: React.FC<TickersPageProps> = ({ lastUpdated, currentPrices, mode }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const getTickers = () => {
    let tickers = currentPrices.filter(it => it.rank <= 10).map(t => t.symbol)

    return tickers
  }

  const [filteredTickers, setfilteredTickers] = useState(getTickers());

  useEffect(() => {
    // Update the document title using the browser API
    setfilteredTickers(getTickers())
  }, [currentPrices]);

  return (
    <IonPage id="news-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Current Prices</IonTitle>
          <IonButtons slot="end">
          <div className={"last-updated-time"}>Last Updated: {lastUpdated.format("llll")}</div>
            <IonButton onClick={() => setShowFilterModal(!showFilterModal)}>
              {mode === 'ios' ? 'Filter' : <IonIcon icon={options} slot="icon-only" />}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`outer-content`}>
      <TickerList filteredTickerList={filteredTickers} />
      </IonContent>
      <IonModal
        isOpen={showFilterModal}
        onDidDismiss={() => setShowFilterModal(false)}
      >
        <TickersFilter
          setfilteredTickers={setfilteredTickers}
          onDismissModal={() => setShowFilterModal(false)}
          filteredTickerList={filteredTickers}
          tickerList={currentPrices.map(t => t.symbol)}

        />
      </IonModal>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    currentPrices: selectors.getCurrentPrices(state),
    lastUpdated: selectors.getLastUpdated(state),
    mode: getConfig()!.get('mode')
  }),
  component: React.memo(TickersPage)
});