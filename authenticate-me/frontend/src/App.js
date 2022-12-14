import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import GroupsPage from "./components/GroupsPage";
import SingleGroup from "./components/SingleGroup";
import EventsPage from "./components/EventsPage";

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
          <Route path={'/events'}>
            <EventsPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
