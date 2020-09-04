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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Easing from '../../util/easingPreset';
import {TweenLite} from 'gsap';
import style from './Option.css';
import {setOptionActive} from '../../action';

/**
 * @fileoverview A Button class. Includes the "ripple" selected-state.
 * @example
 * ```js
 * <Option value="Yes" onClick={(value, data) => this.answer(value, data)}>
 *  { "Yes" }
 *  </Option>
 * ```
 *
 *  Note that the "data" argument sent in the onClick handler, returns an object
 *  of shape: { x: number; y: number; }, to indicate where the user has clicked
 *  relative to the window.
 */

class Option extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
    value: PropTypes.string,
    index: PropTypes.number,
    option: PropTypes.number,
    isRestart: PropTypes.bool,
  };

  state = {
    active: false,
  };

  componentDidUpdate() {
    if (this.state.active === false && this.props.index === this.props.option) {
      this.activate();
    } else if (this.state.active === true && this.props.option === null) {
      this.deactivate();
    }
  }

  /**
   * Activate the "down" state. Triggers the ripple-effect.
   * @param {SyntheticEvent} [e]
   * @param {boolean} bubble - True to indicate user clicked event.
   */
  activate(
    e = {
      nativeEvent: {
        offsetX: this.root.clientWidth * 0.5,
        offsetY: this.root.clientHeight * 0.5,
        clientX: this.root.getBoundingClientRect().x + this.root.clientWidth * 0.5,
        clientY: this.root.getBoundingClientRect().y + this.root.clientHeight * 0.5,
      },
    },
    bubble = false
  ) {
    this.setState({active: true});
    this.props.dispatch(setOptionActive(this.props.index));

    const {offsetX, offsetY, clientX, clientY} = e.nativeEvent;
    const {clientWidth, clientHeight} = this.root;

    // Calculate max radius the ripple needs to be
    const x = Math.round((offsetX / clientWidth) * 100);
    const y = Math.round((offsetY / clientHeight) * 100);
    const radius = Math.sqrt(
      Math.max(offsetX, Math.abs(clientWidth - offsetX)) ** 2 +
        Math.max(offsetY, Math.abs(clientHeight - offsetY)) ** 2
    );

    // Animate the ripple
    TweenLite.fromTo(
      this.ripple,
      0.64,
      {
        webkitClipPath: `circle(20px at ${x}% ${y}%)`,
        clipPath: `circle(20px at ${x}% ${y}%)`,
      },
      {
        webkitClipPath: `circle(${radius}px at ${x}% ${y}%)`,
        clipPath: `circle(${radius}px at ${x}% ${y}%)`,
        ease: Easing.decelerate,
      }
    );

    TweenLite.to(this.root, 0.2, {
      color: this.props.config.buttonSelectedTextColor,
    });

    /**
     * The onClick callback. The value is the string set in the Option.value
     * parameter. The second object is of shape {x:number; y:number;}, and
     * indicated where on-screen a user has clicked.
     */
    if (bubble === true) {
      this.props.onClick(this.props.value, {
        x: clientX,
        y: clientY,
      });
    }
  }

  /**
   * Undo the "down"-state.
   */
  deactivate() {
    this.setState({active: false});

    /* TweenLite.to(this.ripple, 0.2, {opacity: 0});
    TweenLite.to(this.root, 0.2, {
      color: this.props.config.buttonNormalTextColor,
    });*/
  }

  /**
   * Render the element
   * @returns {*}
   */
  render() {
    const {config, children, isRestart} = this.props;

    return (
      <button
        className={[style.root, isRestart ? style.restartRoot : null].join(' ')}
        ref={(el) => (this.root = el)}
        style={{
          color: config.buttonNormalTextColor,
          backgroundColor: config.buttonNormalBackgroundColor,
        }}
        onClick={(e) => {
          if (!this.state.active && !this.props.frozen) {
            this.activate(e, true);
          }
        }}
      >
        <div
          className={style.ripple}
          ref={(el) => (this.ripple = el)}
          style={{backgroundColor: config.buttonSelectedBackgroundColor}}
        />
        <div className={style.text}>{children}</div>
      </button>
    );
  }
}

export default connect((state) => ({
  config: state.config,
  option: state.option,
  frozen: state.frozen,
}))(Option);
