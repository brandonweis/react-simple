import { Router, Route, Link } from 'react-router'
import { hashHistory } from 'react-router'
import React from 'react'
import { render } from 'react-dom'
import { App, Login, Logout, About, Dashboard, requireAuth, AddUser, AddGroup, ListUser, ListGroup, UserDetail, GroupDetail } from './view'

import '../../style/style.scss'

const body = document.getElementById('react')

// this is where you define the routes
render((
    <Router history={ hashHistory }>
        <Route path="/" component={ App }>
            <Route path="login" component={ Login } />
            <Route path="logout" component={ Logout } />
            <Route path="addUser" component={ AddUser } onEnter={ requireAuth } />
            <Route path="addGroup" component={ AddGroup } onEnter={ requireAuth } />
            <Route path="listUser" component={ ListUser } onEnter={ requireAuth } />
            <Route path="listGroup" component={ ListGroup } onEnter={ requireAuth } />
            <Route path="user/:id" component={ UserDetail } onEnter={ requireAuth } />
            <Route path="group/:id" component={ GroupDetail } onEnter={ requireAuth } />
        </Route>
    </Router>
), body)
