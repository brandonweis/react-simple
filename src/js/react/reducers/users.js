import { users as usersState } from "./initState"

export default function users(state = usersState, change) {
    switch(change.type){
        case 'ADD_USER':
            return [...state, {
                id: Math.random().toString(36).substring(7),
                name: change.name,
                groupIds: [...change.groupIds]
            }]
            break;
        case 'UPDATE_USER':
            return state.map((user) => {
                let newUser = {...user}
                if(user.id == change.userId){
                    newUser = {
                        ...user,
                        groupIds: [...change.groupIds]
                    }
                }
                return newUser
            })
            break;
        case 'REMOVE_USER':
            let userIndex = state.indexOf(change.user)
            return [
                ...state.slice(0, userIndex),
                ...state.slice(userIndex+1)
            ]
            break;
        default:
            return state
    }
}
