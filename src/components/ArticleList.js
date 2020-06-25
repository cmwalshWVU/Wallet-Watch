import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import { connect } from '../data/connect';
import Article from './Article.tsx';
import '../theme/card.scss';
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button'
import { getNewsData } from '../data/store/actions/newsAction';
import { IonHeader, IonCard, IonCardContent, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonGrid, IonRow, IonCol } from '@ionic/react';

// JS file bc no @types/pushid
class ArticleList extends Component {

    constructor(props) {
		super(props);
		this.state = {
            newsArticles: [],
            collapsed: true
		};
	}

    componentDidMount() {
        const pusher = new Pusher('5994b268d4758d733605', {
            cluster: 'us2',
            encrypted: true
            });

        const channel = pusher.subscribe('news-channel');
        channel.bind('update-news', data => {
            this.setState({
                newsArticles: [data.articles, ...this.state.newsArticles],
            });
        });

        this.props.getNewsData();
    }
    
    newArray(x,y) {
        let d = []
        x.concat(y).forEach(item =>{
           if (d.find((iterator) => iterator.title  === item.title) === undefined) 
             d.push(item); 
        });
        return d;
      }

    toggleCollapse = () => {
        this.setState((state) => { return {collapsed: !state.collapsed}})
    }

    render() {
        let newsArticles = noData;
        let articles = [];

        if (this.state.newsArticles && this.state.newsArticles.length > 0) {
            articles = [...this.state.newsArticles];
        }
        if (this.props.newsArticles !== undefined && this.props.newsArticles !== null && this.props.newsArticles.length > 0) {
            articles = this.newArray(articles, this.props.newsArticles)
        }
        if (articles.length > 0) {
            newsArticles = articles.sort((a, b) => {
                if (a.publishedAt !== undefined && b.publishedAt !== undefined) {
                    return a.publishedAt < b.publishedAt ? 1 : -1
                } else if (a.publishedAt !== undefined && b.published_on !== undefined) {
                    const bT = new Date(b.published_on * 1000)
                    const aT = new Date(a.publishedAt)
                    return aT < bT ? 1 : -1
                }
                else if (a.published_on !== undefined && b.publishedAt !== undefined) {
                    const bT = new Date(b.publishedAt)
                    const aT = new Date(a.published_on * 1000)
                    return aT < bT ? 1 : -1
                }
                else {
                    return a.published_on < b.published_on ? 1 : -1
                }
            }).map((article, index)  => <IonCol className="article-col" size="12" size-md="4" key={index}>
            <Article key={index} article={article} id={pushid()} />
        </IonCol>);
        }
        return (
            <IonContent>
                <IonList>
                    <IonGrid fixed className="article-grid">
                        <IonRow align-items-stretch>
                        {newsArticles}
                        </IonRow>
                    </IonGrid>
                </IonList>
            </IonContent>
        );
    }
}

const noData = (
    <IonContent>
        <IonList>
            <IonGrid fixed>
                <IonRow align-items-stretch>
                <IonCol size="12" size-md="4">
                <IonCard className="speaker-card">
                    <IonCardContent className="card-content grey-text text-darken-3">
                    <div className="card-content">
                        <span >No recent news </span>
                    </div>
                    </IonCardContent>
                </IonCard> 
                </IonCol>                        
                </IonRow>
            </IonGrid>
        </IonList>
    </IonContent>
    );

export default connect({
    mapStateToProps: (state) => ({
        newsArticles: state.news.newsArticles,
    }),
    mapDispatchToProps: ({
        getNewsData
    }),
    component: ArticleList
  });