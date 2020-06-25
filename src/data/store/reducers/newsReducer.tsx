const initData = {}

const newsReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'UPDATE_NEWS_ARTICLES':
        return {
            ...state,
            newsArticles: action.articles
        }
    default:
        return {
            ...state
        }
    }
}

export default newsReducer;