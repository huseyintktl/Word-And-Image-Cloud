import React, {Component} from 'react';
import WordCloud from "../wordcloud/WordCloud";
import ImageCloud from "../imagecloud/ImageCloud";
import {Col, Row} from "reactstrap";
import Navi from "../navi/Navi";

class Dashboard extends Component {

    render() {
           return (
               <div>
                   <Navi/>
                   <Row>
                       <Col xs={6}>
                           <WordCloud/>
                       </Col>
                       <Col xs={6}>
                           <ImageCloud/>
                       </Col>
                   </Row>
               </div>
        );
    }
}

export default Dashboard
