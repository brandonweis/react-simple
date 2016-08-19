import React from 'react'
import { render } from 'react-dom'
import auth from '../lib/auth'
import { Link } from 'react-router'
import { reduxStore } from './state'
import * as actions from './actions'

// console.log("addUser", addUser, actions.addUser);

export const App = React.createClass({
    getInitialState() {
        return { loggedIn: auth.loggedIn() }
    },

    updateAuth(loggedIn) {
        this.setState({ loggedIn: loggedIn })
    },

    componentWillMount() {
        auth.onChange = this.updateAuth
        auth.login()
    },

    render() {
        return (
          <div>
            <div id="menu">
                <ul>
                    {auth.isAdmin() && (
                        <span>
                        <li><Link to="/addUser">Add User</Link></li>
                        <li><Link to="/addGroup">Add Door</Link></li>
                        <li><Link to="/listUser">List User</Link></li>
                        <li><Link to="/listGroup">List Door</Link></li>
                        </span>
                    )}
                    <li>
                    {this.state.loggedIn ? (
                    <Link to="/logout">Log out</Link>
                    ) : (
                    <Link to="/login">Sign in</Link>
                    )}
                    </li>
                </ul>
            </div>
            <div id="container">
                <div id="content">
                    {this.props.children}
                </div>
            </div>
          </div>
        )
    }
})

export const Login = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            error: false
        }
    },

    handleSubmit(event) {
        event.preventDefault()

        const email = this.refs.email.value
        const pass = this.refs.pass.value

        auth.login(email, pass, (loggedIn) => {
            if (!loggedIn)
                return this.setState({ error: true })

            const { location } = this.props

            if (location.state && location.state.nextPathname) {
                this.context.router.replace(location.state.nextPathname)
            } else {
                this.context.router.replace('/listUser')
            }
        })
    },

    render() {
        return (
            <div id="login">
                <h3>Login</h3>
                <form onSubmit={this.handleSubmit}>
                    <label><input type="text" ref="email" placeholder="email" defaultValue="admin@admin.com" /></label>
                    <label><input ref="pass" placeholder="password" type="password" /></label>
                    Admin:<br /> (email:admin@admin.com password:admin)<br /><br />
                    Preset Users:<br /> (email:Alice@clay.com passowrd:user)<br />
                    (email:Bob@clay.com passowrd:user)<br />
                    (email:Caty@clay.com passowrd:user)<br />
                    Other Users:<br /> (email:Case-Sensitive-Name@clay.com password:user)<br /><br />

                    <button type="submit">login</button>
                    {this.state.error && (
                    <p>Bad login information</p>
                    )}
                </form>
            </div>
        )
    }
})

export const Logout = React.createClass({
    componentDidMount() {
        auth.logout()
    },

    render() {
        return <p>You are now logged out</p>
    }
})

export const requireAuth = (nextState, replace) => {
    if (!auth.loggedIn()) {
        return replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }

    if (!auth.isAdmin() && nextState.location.pathname !== '/listGroup') {
        return replace({
            pathname: '/listGroup',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

export const AddUser = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            error: false,
            groupIds: []
        }
    },

  handleFieldChange(fieldId, value) {
      let newState = {}
      this.setState((prevState, currentProps) => {
            let state = {}
            state['groupIds'] = [...prevState['groupIds'], fieldId]
            state['groupIds'] = state['groupIds'].filter(id =>{
                return (fieldId !== id || (fieldId === id && value))
            })
            return state
      })
  },

    handleSubmit(event) {
        event.preventDefault()
        const name = this.refs.name.value
        if(!name || this.state.groupIds.length === 0) return this.setState({error: true})

        // use redux to add{ type: 'ADD_USER', name: name, groupIds:this.state.groupIds }
        reduxStore.dispatch(actions.addUser({ name: name, groupIds:this.state.groupIds }))
        let latestState = reduxStore.getState()
        let lastInsertedUser = latestState.users[latestState.users.length-1]

        for(let i=0; i<this.state.groupIds.length; i++){
            let action = reduxStore.dispatch(actions.addGroupUser({
                groupId: this.state.groupIds[i],
                userId:lastInsertedUser.id
            }))
        }

        this.context.router.replace('/listUser')
    },

    render() {
        let groups = reduxStore.getState().groups || [];
        return (
            <div>
                <h3>Add User</h3>
                <form onSubmit={this.handleSubmit}>
                    <label><input type="text" ref="name" placeholder="name"/></label>
                    <br/>
                    <GroupSelection
                    groups={ groups }
                    handleFieldChange = { this.handleFieldChange }
                    />
                    <br/>
                    <button type="submit">Add</button>
                    {this.state.error && (
                    <p>Please provide a name and select at least a group</p>
                    )}
                </form>
            </div>
        )
    }
})

export const GroupSelection = React.createClass({
    propTypes: {
        groups:             React.PropTypes.any.isRequired,
        handleFieldChange:  React.PropTypes.func.isRequired
    },

    handleFieldChange(fieldId, value) {
        this.props.handleFieldChange(fieldId, value)
    },

    render() {
        let selectedGroups = this.props.selectedGroups || [];
        return (
            <label>
                { this.props.groups.map((group) => {
                    let props = {
                        label: group.name,
                        value: group.id,
                        selected: (selectedGroups.indexOf(group.id) > -1),
                        onChange: this.handleFieldChange,
                    }
                    return <CheckboxWithLabel  key= { group.id } { ...props } />
                }) }
            </label>
        )
    }
})

export const CheckboxWithLabel = React.createClass({
    propTypes: {
        label:              React.PropTypes.string.isRequired,
        value:              React.PropTypes.any.isRequired,
        selected:           React.PropTypes.bool.isRequired,
        onChange:           React.PropTypes.func.isRequired
    },

    onChange(event) {
        this.props.onChange(this.props.value, event.target.checked)
    },

    render() {
        return (
            <div>
                <label>
                    <input
                    type="checkbox"
                    onChange={ this.onChange }
                    value={ this.props.value }
                    defaultChecked={ this.props.selected }
                    />
                    { this.props.label }
                </label>
            </div>
        )
    }
})

export const AddGroup = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            error: false
        }
    },

    handleSubmit(event) {
        event.preventDefault()
        const name = this.refs.name.value
        if(!name) return this.setState({ error: true })
        // use redux to add
        reduxStore.dispatch(actions.addGroup({ name }))

        this.context.router.replace('/listGroup')
    },

    render() {
        return (
            <div>
                <h3>Add Doors</h3>
                <form onSubmit={this.handleSubmit}>
                    <label><input type="text" ref="name" placeholder="Door name here"/></label>
                    <br/>
                    <button type="submit">Add</button>
                    {this.state.error && (
                    <p>Please provide a door name</p>
                    )}
                </form>
            </div>
        )
    }
})

export const ListUser = React.createClass({
    componentWillMount() {
        // set state for users
        // this.setState({users: (this.props.users || reduxStore.getState().users)})
    },

    componentDidMount() {
        this.unsubscribe = reduxStore.subscribe(() => {
            console.log("forceUpdate");
            this.forceUpdate()
        });
    },

    componentWillUnmount() {
        this.unsubscribe();
    },

    onClickToRemove(user) {
        //redux remove user
        reduxStore.dispatch(actions.removeUser(user))
        // redux remove user from group
        user.groupIds.forEach(groupId => {
            reduxStore.dispatch(actions.removeGroupUser({
                userId: user.id,
                groupId: groupId
            }))
        })
    },

    render() {
        let users = this.props.users || reduxStore.getState().users;
        return (
            <div>
                {
                    ((this.props.headerOn !== false)) && (<h3>Users</h3>)
                }
                <ul className="list_style">
                { users.map((user) => {
                    return (
                        <li key={ user.id }>
                        <div className="list_item">
                            <Link
                                className="left"
                                to={{pathname: `/user/${user.id}`,}}
                            >
                            { user.name }
                            </Link>
                            <div className="right">
                            <Button
                                target={ user }
                                onClick={ this.props.onClickToRemove || this.onClickToRemove }
                                label={ this.props.label }
                            />
                            </div>
                            <div className="clear"></div>
                        </div>
                        </li>
                    )
                }) }
                </ul>
                {this.props.children}
            </div>
        )
    }
})


const Button = React.createClass({
    getInitialState() {
        return {
            label:(this.props.label || "Remove")
        }
    },

    onClick(event) {
        event.preventDefault()
        this.setState({ label: 'Authorising...', className: 'loading' })
        let promise = this.props.onClick(this.props.target)
        promise && promise.then((status) => {
            let className = status ? "granted" : "denied"
            let label = status ? "Access Granted" : "Access Denied"
            this.setState({ label, className })
        })
    },

    render() {
        return (
            <button onClick={ this.onClick } className={this.state.className}>
                { this.state.label }
            </button>
        )
    }
})

export const ListGroup = React.createClass({
    componentWillMount() {
        // set state for users
        // this.setState({users: (this.props.users || reduxStore.getState().users)})
    },

    componentDidMount() {
        this.unsubscribe = reduxStore.subscribe(() => {
            console.log("ListGroup forceUpdate");
            this.forceUpdate()
        });
    },

    componentWillUnmount() {
        this.unsubscribe();
    },

    onClickToAccess(groupId) {
        let userId = auth.getId()
        return () => {
            return reduxStore.dispatch(actions.isAuthorised(groupId, userId)).then(() => {
                let authItems = reduxStore.getState().auth.items
                console.log('authorised completed', authItems[authItems.length-1])
                return authItems[authItems.length-1]
            })
        }
    },

    render() {
        let users = reduxStore.getState().users || [];
        let groups = reduxStore.getState().groups || [];
        let user = auth.getRole() || [];
        return (
            <div>
                <h3>Doors</h3>
                <ul className="list_style">
                { groups.map((g) => {
                    return (
                        <li key={ g.id }>
                            <div className="list_item">
                                <Link
                                    className="left"
                                    to={{pathname: `/group/${g.id}`,}}
                                >
                                { g.name }
                                </Link>
                                <div className="right">
                                <Button
                                    ref="button"
                                    target={ user }
                                    onClick={ this.onClickToAccess(g.id) }
                                    label='Open Door'
                                />
                                </div>
                                <div className="clear"></div>
                            </div>
                        </li>
                    )
                }) }
                </ul>
                {this.props.children}
            </div>
        )
    }
})

export const UserDetail = React.createClass({
    getInitialState() {
        return {
            groupIds: []
        }
    },

    handleFieldChange(fieldId, value) {
        this.setState((prevState, currentProps) => {
            let state = {}
            state['groupIds'] = [...prevState['groupIds'], fieldId]
            state['groupIds'] = state['groupIds'].filter(id =>{
                return (fieldId !== id || (fieldId === id && value))
            })
            return state
        })
    },

    getCurrentUser() {
        const { id } = this.props.params
        let users = reduxStore.getState().users || []
        let currentUser = users.find(u => u.id == id)
        return currentUser
    },

    getCurrentGroups() {
        let groups = reduxStore.getState().groups || []
        let currentUser = this.getCurrentUser()
        return groups.filter(g => currentUser.groupIds.indexOf(g.id) > -1 )
    },

    componentWillMount() {
        let currentUser = this.getCurrentUser()
        this.setState({ groupIds: currentUser.groupIds })
        this.setState({ currentUser: this.getCurrentUser() })
        this.setState({ currentUserGroups: this.getCurrentGroups() })
        this.setState({ groups: (reduxStore.getState().groups || []) })
        console.log('componentWillMount', reduxStore.getState());
    },

    componentWillUnmount() {
        console.log('componentWillUnmount', reduxStore.getState());
        // use redux to update user
        // after component unmount (redirected to other route)
        reduxStore.dispatch(actions.updateUser({
            groupIds: this.state.groupIds,
            userId: this.state.currentUser.id
        }))

        // use redux to update group
        let diffToRemove = this.state.currentUser.groupIds.filter(id => this.state.groupIds.indexOf(id) < 0)
        diffToRemove.forEach(groupId => {
            reduxStore.dispatch(actions.removeGroupUser({
                groupId,
                userId: this.state.currentUser.id
            }))
        })

        let diffToAdd = this.state.groupIds.filter(id => this.state.currentUser.groupIds.indexOf(id) < 0)
        diffToAdd.forEach(groupId => {
            reduxStore.dispatch(actions.addGroupUser({
                groupId,
                userId: this.state.currentUser.id
            }))
        })
    },

    render() {
        return (
            <div>
                <h3>User - { this.state.currentUser.name }</h3>
                <GroupSelection
                    groups = { this.state.groups }
                    selectedGroups = { this.state.currentUser.groupIds }
                    handleFieldChange = { this.handleFieldChange }
                />
            </div>
        )
    }
})

export const GroupDetail = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            error: false,
        }
    },

    componentWillMount() {
        const { id } = this.props.params
        let users = reduxStore.getState().users || []
        let groups = reduxStore.getState().groups || []

        let currentGroup = groups.find(g => g.id == id)
        this.setState({currentGroup: currentGroup})

        if(!currentGroup) return
        let groupUsers = users.filter(u => currentGroup.userIds.indexOf(u.id) > -1 )
        this.setState({groupUsers: groupUsers})
    },

    componentDidMount() {
        this.unsubscribe = reduxStore.subscribe(() => {
            this.componentWillMount()
            // this.forceUpdate()
        });
    },

    componentWillUnmount() {
        this.unsubscribe();
    },

    onClickToRemove(user) {
        const { id : groupId } = this.props.params
        // redux to dispatch remove user from group
        reduxStore.dispatch(actions.removeGroupUser({
            groupId,
            userId: user.id
        }))
        // redux to dispatch remove group from user
        let groupIds = user.groupIds.filter(uGroupId => uGroupId != groupId )
        reduxStore.dispatch(actions.updateUser({
            groupIds: groupIds,
            userId: user.id
        }))
    },

    removeGroup() {
        const { id } = this.props.params

        if(this.state.currentGroup.userIds.length > 0) return this.setState({ error: true })

        reduxStore.dispatch(actions.removeGroup(this.state.currentGroup))

        this.context.router.replace('/listGroup')
    },

    render() {
        return (
            <div>
                <h3>Door - { this.state.currentGroup.name }</h3>
                {this.state.error &&
                  "Door can not be removed, please revoke access of all the authorised users to this door"
                }
                <ListUser
                    users={ this.state.groupUsers }
                    onClickToRemove={ this.onClickToRemove }
                    label="Revoke access"
                    headerOn={ false }
                />
                <br/>
                <button onClick={ this.removeGroup }>Remove Door</button>
            </div>
        )
    }
})

// reduxStore.subscribe(state => {
//     console.log("subscribe", reduxStore.getState());
// })
