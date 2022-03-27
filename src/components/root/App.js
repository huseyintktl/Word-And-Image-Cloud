import '../../App.css';
import {Route, Switch} from "react-router-dom";
import Container from "@material-ui/core/Container";
import Dashboard from "../common/Dashboard";
import NotFound from "../common/NotFound";
import {Component} from "react";

class App extends Component{

    render() {
        return (
            <Container>
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route component={NotFound} />
                </Switch>
            </Container>
        );
    }
}
export default App
