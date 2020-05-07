import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './AppRoutes.css'
import Home from './containers/Home'
import About from './containers/About'
import RobotList from './containers/RobotList'
import PageNotFound from './containers/PageNotFound'

export default function AppRoutes() {
    return (
        <div>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about" exact component={About} />
                <Route path="/robotlist" exact component={RobotList} />
                <Route path="/robotlist/:robotType" exact component={RobotList} />
                {/* Finally, catch all unmatched routes */}
                <Route component={ PageNotFound } />
            </Switch>
        </div>
    )
}
