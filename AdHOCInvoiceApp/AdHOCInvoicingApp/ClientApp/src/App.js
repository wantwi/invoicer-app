import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from 'views/examples/Login'
import AdminLayout from './layouts/Admin'
import AuthLayout from './layouts/Auth.js'
import "./assets/js/zendesk-static"

const App = () => {
  return (
    <Switch>
      <Route path='/auth/login' render={(props) => <Login {...props} />} />
      <Route path='/admin' render={(props) => <AdminLayout {...props} />} />
      <Route
        path='/admin/customers'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/items'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/refunds'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/reports'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/user-accounts'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/currency'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/dashboard'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route
        path='/admin/profile'
        render={(props) => <AdminLayout {...props} />}
      />
      <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
      <Redirect from='/' to='/auth/login' />
    </Switch>
  )
}

export default App