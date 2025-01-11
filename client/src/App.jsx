import { useState, useEffect } from "react";
import RosterForm from "./RosterForm";
import Search from "./Search";
import "./App.css";
import Stats from "./Stats";
import { Switch, Route} from "react-router-dom";

function App() {
    
    return (
        <>
            <h2> Roster Application</h2>
            <Switch>
                <Route exact path="/">
                    <RosterForm />
                </Route>
                <Route exact path="/stats">
                    <Stats />
                </Route>
                <Route exact path="/search">
                    <Search />
                </Route>
                
            </Switch>
        </>
    );
}



export default App;
