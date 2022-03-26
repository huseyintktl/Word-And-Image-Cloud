import React, {Component} from 'react';
import {Row} from "reactstrap";
import ReactWordCloud from 'q-fork-react-wordcloud';
import {bindActionCreators} from "redux";
import * as wordsActions from "../../redux/actions/wordsActions";
import {connect} from "react-redux";

class WordCloud extends Component {

    componentDidMount() {
        this.props.actions.getWordsToCloud();
        window.addEventListener("resize", () => {
            let pageWidth = window.innerWidth
            this.zoom(pageWidth)
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let pageWidth = window.innerWidth
        if (pageWidth < 604) {
            this.zoom(pageWidth)
        }
    }

    zoom(pageWidth) {
        let zoom = 1;
        let zoomElem = document.querySelector("#wordCloudContainer svg")
        let w = pageWidth
        let cw = zoomElem.clientWidth;
        let zoomCorrectionFactor = 0.90;

        if (w < cw) {
            zoom = w / cw;
            zoomElem.style.transformOrigin = "0 0";
            zoomElem.style.transform = "scale(" + zoom * zoomCorrectionFactor + ")";
        } else {
            zoomElem.style.transformOrigin = null
            zoomElem.style.transform = null
        }

    }

    render() {
        const words = this.props.currentWords;

        if (words) {
            return renderWords(words);
        } else {
            return renderDefault();
        }
    }
}

function renderWords(words) {

    const WORD_COUNT_KEY = 'value';
    const WORD_KEY = 'word';
    let maxWords = 13
    let minFontSize = 30
    let maxFontSize = 65

    return (
        <div id="wordCloudContainer" style={{height: 440}}>
            <h3>Sözcük Bulutu</h3>
            <ReactWordCloud
                words={words}
                wordCountKey={WORD_COUNT_KEY}
                wordKey={WORD_KEY}
                minFontSize={minFontSize}
                maxFontSize={maxFontSize}
                maxWords={maxWords}
                tooltipEnabled={false}
                fontFamily="Roboto, sans-serif"
                width={604}
            />
        </div>
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
        currentWords: state.wordsReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            getWordsToCloud: bindActionCreators(wordsActions.getWordsToCloud, dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordCloud);