import { reduxStore } from '../react/state'

module.exports = {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1]
        if (localStorage.token) {
            if (cb) cb(true)
            this.onChange(true)
            return
        }
        pretendRequest(email, pass, (res) => {
            if (res.authenticated) {
                localStorage.token = res.token
                localStorage.role = res.role
                localStorage.id = res.id
                if (cb) cb(true)
                this.onChange(true)
            } else {
                if (cb) cb(false)
                this.onChange(false)
            }
        })
    },

    getToken() {
        return localStorage.token
    },

    getRole() {
        return localStorage.role
    },

    isAdmin() {
        return localStorage.role === 'admin'
    },

    getId() {
        return localStorage.id
    },

    logout(cb) {
        delete localStorage.token
        delete localStorage.role
        if (cb) cb()
        this.onChange(false)
    },

    loggedIn() {
        return !!localStorage.token
    },

    onChange() {}
}

function pretendRequest(email, pass, cb) {
    let users = reduxStore.getState().users
    setTimeout(() => {
        if (email === 'admin@admin.com' && pass === 'admin') {
            return cb({
                authenticated: true,
                token: Math.random().toString(36).substring(7),
                role: 'admin'
            })
        }

        let name = email && email.substring(0, email.lastIndexOf("@"))
        let result = name && users.find(u => u.name === name)

        console.log("message", name, result);

        if (result && pass === 'user') {
            cb({
                authenticated: true,
                token: Math.random().toString(36).substring(7),
                role: 'user',
                id: result.id
            })
        }
        else {
            cb({ authenticated: false })
        }
    }, 0)
}
