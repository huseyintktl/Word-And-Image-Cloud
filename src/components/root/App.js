import '../../App.css';
import {Route, Switch} from "react-router-dom";
import Container from "@material-ui/core/Container";
import Dashboard from "../common/Dashboard";
import NotFound from "../common/NotFound";
import {bindActionCreators} from "redux";
import * as bookActions from "../../redux/actions/bookActions";
import {connect} from "react-redux";
import {Component} from "react";

class App extends Component{

    componentDidMount() {
        this.props.actions.getBook('9781911223139');
    }

    render() {
        return (
            this.props.currentBook &&
            <Container>
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route component={NotFound} />
                </Switch>
            </Container>
        );
    }

}
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            getBook: bindActionCreators(bookActions.getBook, dispatch)
        }
    }
}

function mapStateToProps(state) {
    return {
        currentBook: state.bookReducer,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
