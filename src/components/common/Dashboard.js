import React, {Component} from 'react';
import WordCloud from "../wordcloud/WordCloud";
import ImageCloud from "../imagecloud/ImageCloud";
import {Col, Row} from "reactstrap";

class Dashboard extends Component {

    render() {
           return (
               <div>
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
