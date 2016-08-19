import Promise from 'promise'
import { reduxStore } from './state'

export function addUser(userObj) {
    return {
        type: 'ADD_USER',
        ...userObj
    }
}

export function updateUser(userObj) {
    return {
        type: 'UPDATE_USER',
        ...userObj
    }
}

export function removeUser(user) {
    return {
        type: 'REMOVE_USER',
        user
    }
}

export function addGroup(groupObj) {
    return {
        type: 'ADD_GROUP',
        ...groupObj
    }
}

export function removeGroup(group) {
    return {
        type: 'REMOVE_GROUP',
        group
    }
}

export function addGroupUser(groupUserObj) {
    return {
        type: 'ADD_GROUP_USER',
        ...groupUserObj
    }
}

export function removeGroupUser(groupUserObj) {
    return {
        type: 'REMOVE_GROUP_USER',
        ...groupUserObj
    }
}

export function startAuth(item){
    return {
        type: 'START_AUTH',
        item
    }
}
export function waitAuth(item){
    return {
        type: 'WAIT_AUTH',
        item
    }
}
export function getAuth(item, isAuth){
    return {
        type: 'GET_AUTH',
        isAuth,
    }
}

function verifyAuthorisation(itemId, accessorId){

    let groups = reduxStore.getState().groups
    let group = groups.find(g => g.id == itemId)
    let result = group.userIds.find(uId => uId == accessorId);

    console.log("message", groups, group, result, accessorId, itemId);
    return result !== undefined ? true : false;
}

// this is a API data mocking wrapper, it can be the point to request to an API
export function isAuthorised(itemId, accessorId){
    return dispatch => {
        dispatch(startAuth(itemId));
        return new Promise(resolve => {
            setTimeout(() => {
                let isAuthorised = verifyAuthorisation(itemId, accessorId);
                resolve(isAuthorised)
            }, 2000)
        })
        .then(res => dispatch(getAuth(itemId, res)))
    }
}
