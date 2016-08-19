import { groups as groupState } from "./initState"

export default function groups(state = groupState, change) {
    switch(change.type){
        case 'ADD_GROUP':
            return [...state, {
                id: Math.random().toString(36).substring(7),
                name: change.name,
                userIds: []
            }]
            break;
        case 'REMOVE_GROUP':
            let groupIndex = state.indexOf(change.group)
            return [
                ...state.slice(0, groupIndex),
                ...state.slice(groupIndex+1)
            ]
            break;
        case 'ADD_GROUP_USER':
            return state.map((group) => {
                let newGroup = {...group}
                if(group.id == change.groupId){
                    newGroup = {
                        ...group,
                        userIds: [...group.userIds, change.userId]
                    }
                }
                return newGroup
            })
            break;
        case 'REMOVE_GROUP_USER':
            return state.map((group) => {
                let newGroup = {...group}
                if(group.id == change.groupId){
                    let index = group.userIds.indexOf(change.userId)
                    let newUserIds = [...group.userIds.slice(0, index), ...group.userIds.slice(index+1)]
                    newGroup = {
                        ...group,
                        userIds: newUserIds
                    }
                }
                return newGroup
            })
            break
        default:
            return state
    }
}
