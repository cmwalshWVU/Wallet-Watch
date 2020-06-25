const initData = [
    {

    }
]

const graphReducer = ( state = initData, action: any ) => {
    switch (action.type) {
        case 'UPDATE_GRAPH':
            return {
                ...state,
                [action.ticker]: action.data
            }
        default:
            return {
                ...state
            }
    }
}

export default graphReducer;