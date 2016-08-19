import { doors as doorsState } from "./initState"

export default function doors(state = doorsState, change) {
    switch(change.type){
        case 'ADD_DOOR':
            return [...state, {
                id: Math.random().toString(36).substring(7),
                name: change.name,
                userIds: []
            }]
            break;
        case 'REMOVE_DOOR':
            let index = state.indexOf(change.door)
            return [
                ...state.slice(0, index),
                ...state.slice(index+1)
            ]
            break;
        case 'ADD_DOOR_USER':
            return state.map((door) => {
                let tempDoor = {...door}
                if(door.id == change.doorId){
                    tempDoor = {
                        ...door,
                        userIds: [...door.userIds, change.userId]
                    }
                }
                return tempDoor
            })
            break;
        case 'REMOVE_DOOR_USER':
            return state.map((door) => {
                let tempDoor = {...door}
                if(door.id == change.doorId){
                    let index = door.userIds.indexOf(change.userId)
                    let newUserIds = [...door.userIds.slice(0, index), ...door.userIds.slice(index+1)]
                    tempDoor = {
                        ...door,
                        userIds: newUserIds
                    }
                }
                return tempDoor
            })
            break
        default:
            return state
    }
}
