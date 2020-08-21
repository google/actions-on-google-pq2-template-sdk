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

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TimelineLite} from 'gsap';

import style from './Basic.css';
import preloadImage from '../../util/preloadImage';
import orientation from '../../util/orientation';
import Background from '../background';
import {validateBackground} from '../../util/backgroundOptions';
import {setFrozen} from '../../action';
import {Template} from '../../constant';

/**
 * @fileoverview A relatively generic "slide" for the presenter. It can house
 * any components by injecting them as children, and will animate once it has
 * loaded all required assets.
 */

class Basic extends Component {
  static propTypes = {
    template: PropTypes.string,
    header: PropTypes.string,
    body: PropTypes.string,
    small: PropTypes.string,
    background: PropTypes.shape({
      landscape: PropTypes.string,
      portrait: PropTypes.string,
    }),
    image: PropTypes.shape({
      landscape: PropTypes.string,
      portrait: PropTypes.string,
    }),
    config: PropTypes.object,
    transition: PropTypes.any,
    children: PropTypes.arrayOf(PropTypes.node),
    frozen: PropTypes.bool,
  };

  state = {autoScroll: true};

  async componentDidMount() {
    const tl = this.setupTimeline();
    const backgroundUrl = await validateBackground(this.props.background);
    this.setState({background: backgroundUrl});
    this.props.transition.image = await preloadImage(backgroundUrl);
    tl.play();
    this.startAutoScroll();
  }

  componentWillUnmount() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    if (this.smallContainer && this.state.autoScroll) {
      setTimeout(this.stepAutoScroll.bind(this), 10000);
    }
  }

  stopAutoScroll() {
    this.setState({autoScroll: false});
  }

  stepAutoScroll() {
    if (this.smallContainer && this.state.autoScroll) {
      const {offsetHeight, scrollTop, scrollHeight} = this.smallContainer;
      if (offsetHeight + scrollTop >= scrollHeight) {
        this.stopAutoScroll();
      } else {
        requestAnimationFrame(() => {
          this.smallContainer.scrollBy(0, 1);
          const delay = orientation() === 'portrait' ? 100 : 55;
          setTimeout(this.stepAutoScroll.bind(this), delay);
        });
      }
    }
  }

  /**
   * Generate all the "in" animations.
   * @return {TimelineLite}
   */
  setupTimeline() {
    const {transition} = this.props;
    const tl = new TimelineLite({paused: true});
    // Start the circle-masking animation
    tl.add(transition.start());
    // Toggle visibility of this element
    tl.from(this.root, 0.01, {opacity: 0});
    // Hide the circle-masking animation
    tl.add(() => transition.end());
    tl.add('text', '+=0.0');
    tl.add('buttons', '+=0.4');
    tl.add(() => this.props.dispatch(setFrozen(false)));
    return tl;
  }

  render() {
    const {template, config, header, body, small, image, children, frozen} = this.props;
    const {background} = this.state;

    const isIntroSlide = template === Template.INTRO;
    const isOutcomeSlide = template === Template.OUTCOME;
    const isQuestionSlide = template === Template.QUESTION;

    const headerColor = isIntroSlide ? config.introTitleColor : config.textColor;
    const bodyColor = isIntroSlide ? config.introSubtitleColor : config.textColor;
    const smallColor = isIntroSlide ? config.introSubtitleColor : config.textColor;

    return (
      <div
        className={[style.root, frozen ? style.frozen : null].join(' ')}
        ref={(el) => (this.root = el)}
        onTouchStart={this.stopAutoScroll.bind(this)}
        onClick={this.stopAutoScroll.bind(this)}
        onWheel={this.stopAutoScroll.bind(this)}
      >
        <Background src={background} />
        <div
          className={[
            style.container,
            isOutcomeSlide ? style.outcomeContainer : null,
            isQuestionSlide ? style.questionContainer : null,
          ].join(' ')}
        >
          {image && image[orientation()] && (
            <div className={style.imageContainer}>
              <picture>
                <img src={image[orientation()]} alt={header} />
              </picture>
            </div>
          )}
          <div
            className={[
              style.textContainer,
              isIntroSlide ? style.introTextContainer : null,
              isOutcomeSlide ? style.outcomeTextContainer : null,
            ].join(' ')}
          >
            {header && (
              <h1
                className={style.header}
                ref={(el) => (this.header = el)}
                style={{color: headerColor}}
              >
                {header.split('\n').map((item, index) => (
                  <Fragment key={index}>
                    {item}
                    <br />
                  </Fragment>
                ))}
              </h1>
            )}
            {body && (
              <h2
                className={[style.body, isOutcomeSlide ? style.outcomeBody : null].join(' ')}
                ref={(el) => (this.body = el)}
                style={{color: bodyColor}}
              >
                {body.split('\n').map((item, index) => (
                  <Fragment key={index}>
                    {item}
                    <br />
                  </Fragment>
                ))}
              </h2>
            )}
            {isOutcomeSlide && (
              <div className={style.smallContainer} ref={(el) => (this.smallContainer = el)}>
                <p
                  className={style.small}
                  ref={(el) => (this.small = el)}
                  style={{color: smallColor}}
                >
                  {small &&
                    small.split('\n').map((item, index) => (
                      <Fragment key={index}>
                        {item}
                        <br />
                      </Fragment>
                    ))}
                </p>
                {children && isOutcomeSlide && (
                  <div
                    className={[
                      style.childrenContainer,
                      isOutcomeSlide ? style.outcomeChildrenContainer : null,
                    ].join(' ')}
                    ref={(el) => (this.childrenContainer = el)}
                  >
                    {children}
                  </div>
                )}
              </div>
            )}
          </div>
          {children && !isOutcomeSlide && (
            <div
              className={[
                style.childrenContainer,
                isQuestionSlide ? style.questionChildrenContainer : null,
              ].join(' ')}
              ref={(el) => (this.childrenContainer = el)}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  config: state.config,
  transition: state.transition,
  frozen: state.frozen,
}))(Basic);
