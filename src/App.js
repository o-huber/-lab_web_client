import logo from './logo.svg';
import './App.css';
import Sidebar from "./components/Sidebar";
import {
    Router,
    Switch,
    Route
} from "react-router-dom";
import Content from "./components/Content";
import Columns from "./components/Columns";
import Rows from "./components/Rows";

function App() {
    return (
            <Switch>
                <div className="App">
                    <Sidebar/>

                    <Route exact path="/:database/:table/columns" component={Columns}/>
                    <Route exact path="/:database/:table/rows" component={Rows}/>
                    <Route exact path="/" component={Content}/>


                </div>
            </Switch>
    );
}

export default App;
