import React, {Component} from 'react';
import {Row} from "reactstrap";
import {bindActionCreators} from "redux";
import * as imagesActions from "../../redux/actions/imagesActions";
import {connect} from "react-redux";
import ImageCloud2 from "./ImageCloud2";

class ImageCloud extends Component {

    componentWillMount() {
        this.props.actions.getImagesToCloud();
    }

    render() {
        const images = this.props.currentImages;
        if (images) {
            return renderedImages();
        } else {
            return renderDefault();
        }
    }
}

function renderedImages() {
    return (
        <ImageCloud2/>
    );
}

function renderDefault() {
    return <div>
        <Row>
        </Row>
    </div>
}

function mapStateToProps(state) {
    return {
        currentImages: state.imagesReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            getImagesToCloud: bindActionCreators(imagesActions.getImagesToCloud, dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageCloud);