export default function auth(state={
    isFetching: false,
    items: []
}, action){
    switch(action.type){
        case 'START_AUTH':
            return {
                ...state,
                isFetching: true
            }
            break;
        case 'WAIT_AUTH':
            return {
                ...state,
                isFetching: true
            }
            break;
        case 'GET_AUTH':


            return {
                ...state,
                isFetching: false,
                items: [...state.items, action.isAuth]
            }
            break;
        default:
            return state
    }
}
