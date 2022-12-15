import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import GroupsPage from "./components/GroupsPage";
import SingleGroup from "./components/SingleGroup";
import EventsPage from "./components/EventsPage";
import SingleEvent from "./components/SingleEvent";
import Footer from "./components/Footer";
import AboutPage from "./components/AboutPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <SplashPage />
          </Route>
          <Route exact path={'/groups'}>
            <GroupsPage />
          </Route>
          <Route path={'/groups/:groupId'}>
            <SingleGroup />
          </Route>
          <Route exact path={'/events'}>
            <EventsPage />
          </Route>
          <Route path={`/events/:eventId`}>
            <SingleEvent />
          </Route>
          <Route path={'/about'}>
            <AboutPage />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
