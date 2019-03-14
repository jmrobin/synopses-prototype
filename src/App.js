import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import './App.css';

import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Versions from './components/Versions';
import RootVersionForm from './components/RootVersionForm';
import ForkedVersionForm from './components/ForkedVersionForm';
import ReadVersion from './components/ReadVersion';
import Authors from './components/Authors';
import AuthorForm from './components/AuthorForm';
import Titles from './components/Titles';
import TitleForm from './components/TitleForm';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import NotFound from './components/NoFound';
import Profile from './components/Profile';
import EditRootVersion from './components/EditRootVersion';
import EditForkedVersion from './components/EditForkedVersion';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <Container>
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route path="/versions" component={Versions} />
            <Route path="/forked-version-form/:key" component={ForkedVersionForm} />
            <Route path="/edit-forked-version/:key" component={EditForkedVersion} />
            <Route path="/root-version-form" component={RootVersionForm} />
            <Route path="/edit-root-version/:key" component={EditRootVersion} />
            <Route path="/read-version/:key" component={ReadVersion} />
            <Route path="/authors" component={Authors} />
            <Route path="/author-form/:key" component={AuthorForm} />
            <Route path="/titles" component={Titles} />
            <Route path="/title-form/:key" component={TitleForm} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/home" />
            <Redirect to="/not-found" />
          </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
