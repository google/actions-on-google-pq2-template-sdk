// Copyright 2020, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'gsap';
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './App.css';
import ProgressBar from './component/progressbar';
import Basic from './component/basic';
import Typeface from './component/typeface';
import Option from './component/option';
import Transition from './component/transition';
import AssistantHost from './container/assistantHost';
import {setFrozen} from './action';
import {Template} from './constant';

const displayableTemplates = new Set([Template.INTRO, Template.QUESTION, Template.OUTCOME]);

/**
 * @fileoverview Main PersonalityQuiz canvas entry-point. Expects input via the
 * assistant API to add and configure new slides.
 */

/**
 * @constructor
 */
class App extends Component {
  static propTypes = {
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        fields: PropTypes.shape({
          template: PropTypes.string,
          data: PropTypes.shape({
            header: PropTypes.string,
            body: PropTypes.string,
            small: PropTypes.string,
            background: PropTypes.shape({
              portrait: PropTypes.string,
              landscape: PropTypes.string,
            }),
            image: PropTypes.shape({
              portrait: PropTypes.string,
              landscape: PropTypes.string,
            }),
          }),
          suggestions: PropTypes.arrayOf(
            PropTypes.shape({
              image: PropTypes.string,
              text: PropTypes.string,
              speech: PropTypes.string,
            })
          ),
        }),
      })
    ),
    progress: PropTypes.number,
    config: PropTypes.object,
    transition: PropTypes.any,
  };

  static defaultProps = {
    slides: [],
  };

  /**
   * Answer the current question. Sends the answer directly to the assistantHost
   * and stores the x/y position where a user clicked (used for the transition)
   * @param {string} answer
   * @param {x:number; y:number;} offset
   * @return {Promise} - Promise that resolves to sendTextQuery state.
   * @private
   */
  answer(answer, offset) {
    if (offset && offset.hasOwnProperty('x')) {
      this.props.transition.offset = offset;
    }
    this.props.dispatch(setFrozen(true));

    return window.interactiveCanvas
      .sendTextQuery(answer)
      .then((state) => {
        console.log({answer, state});
        return state;
      })
      .catch(console.error);
  }

  /**
   * Render the application
   */
  render() {
    const {config, slides, progress, frozen} = this.props;

    return (
      <Fragment>
        <AssistantHost />
        <Typeface src={config.font} />
        {slides &&
          slides
            .filter((slide) => displayableTemplates.has(slide.fields.template))
            .slice(-2)
            .map((slide) => {
              const {data = {}, template, suggestions} = slide.fields;
              const {header, body, small, image, background} = data;

              return (
                <Basic
                  key={slide.id}
                  {...{template, header, body, small, image, background, frozen}}
                >
                  {suggestions &&
                    suggestions.map((option, index) => (
                      <Option
                        key={index}
                        {...{index}}
                        isRestart={template === Template.OUTCOME}
                        value={option.speech}
                        onClick={(answer, data) => this.answer(answer, data)}
                      >
                        <Fragment>
                          {option.image && <img src={option.image} alt={option.text} />}
                          {option.text}
                        </Fragment>
                      </Option>
                    ))}
                </Basic>
              );
            })}
        <Transition />
        <ProgressBar progress={progress} />
      </Fragment>
    );
  }
}

export default connect((state) => ({
  slides: state.slides,
  config: state.config,
  progress: state.progress,
  transition: state.transition,
  frozen: state.frozen,
}))(App);
