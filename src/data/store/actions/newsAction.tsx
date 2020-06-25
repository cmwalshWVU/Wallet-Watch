export function getNewsData() {
    return(dispatch: any) =>{
        return fetch('/api/news/live')
            .then(response => response.json())
            .then(articles => {
                dispatch(updateNewsData(articles));
            }).catch(error => console.log(error)
        );
    }
}

export function updateNewsData(data: any) {
    return {
        type: 'UPDATE_NEWS_ARTICLES',
        articles: data
    }
}