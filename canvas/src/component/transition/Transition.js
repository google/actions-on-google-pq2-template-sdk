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
import {setTransition} from '../../action';
import connect from 'react-redux/es/connect/connect';
import style from './Transition.css';
import fitRect from 'fit-rect';
import TweenLite from 'gsap/TweenLite';
import Easing from '../../util/easingPreset';

/**
 * @fileoverview The transition class; renders a Canvas element, and will draw
 * an animated masked circle on it.
 */

class Transition extends Component {
  state = {};

  /**
   * @description options for initializing the animation
   */
  options = {
    image: null,
    offset: null,
  };

  /**
   * @description Size of the window
   */
  size = {};

  /**
   * description visibility of the canvas
   * @type {boolean}
   */
  visible = false;

  /**
   * description contains the scale/x/y offset for fitting the image as cover.
   */
  imageProps = null;

  radius = 0;

  /**
   * @description Progress of the transition
   * @type {number}
   */
  progress = 0;

  /**
   * description alpha applied on circle on top of image.
   * @type {number}
   */
  alpha = 0.5;

  /**
   * @description default options for initializing the animation
   */
  static Defaults = {
    options: {
      offset: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    },
  };

  componentDidMount() {
    this.props.dispatch(setTransition(this));
    this.ctx = this.canvas.getContext('2d');
    this.hide();
    this.reset();
  }

  /**
   * Reset the offset, and re-calculate the canvas size for good measure. Needed
   * at least once.
   */
  reset() {
    this.resize();
    this.offset = {...Transition.Defaults.options.offset};
  }

  /**
   * Recalculate the canvas size based on the current window dimensions.
   */
  resize() {
    this.size = {
      w: window.innerWidth * window.devicePixelRatio,
      h: window.innerHeight * window.devicePixelRatio,
    };
    this.canvas.width = this.size.w;
    this.canvas.height = this.size.h;
  }

  /**
   * Show the canvas
   */
  show() {
    this.canvas.style.opacity = 1;
    this.visible = true;
  }

  /**
   * Hide the canvas
   */
  hide() {
    this.canvas.style.opacity = 0;
    this.visible = false;
  }

  /**
   * Start playing the transition animation
   * @returns TweenLite
   */
  start() {
    this.resize();
    this.transition = TweenLite.to(this, 0.8, {
      progress: 1,
      onStart: () => {
        this.show();
      },
      onUpdate: () => {
        this.draw();
      },
      ease: Easing.standard,
    });

    return this.transition;
  }

  /**
   * Called when the animation is done and ready to be hidden.
   */
  end() {
    this.hide();
    this.progress = 0;
  }

  /**
   * The "requestAnimationFrame" type drawing; draws data to the canvas using
   * the current tween progress.
   */
  draw() {
    if (!this.ctx || !this.options.image || !this.imageProps) return;

    this.ctx.clearRect(0, 0, this.size.w, this.size.h);
    this.ctx.save();

    // Draw Image
    this.ctx.drawImage(
      this.options.image,
      this.imageProps[0],
      this.imageProps[1],
      this.imageProps[2],
      this.imageProps[3]
    );

    // Paint alpha
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha - this.progress * this.alpha})`;

    this.ctx.fillRect(0, 0, this.size.w, this.size.h);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = 'destination-in';

    // Reset alpha
    this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;

    // Draw Circle for clipping
    this.ctx.arc(
      this.options.offset.x,
      this.options.offset.y,
      this.radius * this.progress,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * Set an image URL
   * @param {string} url
   */
  set image(url) {
    this.options.image = url;
    /**
     * Calculate the x/y/w/h of how the image should be placed, to replicate the
     * browser-native "cover" background-sizing.
     */
    const rect = [0, 0, this.options.image.naturalWidth, this.options.image.naturalHeight];
    const target = [0, 0, this.size.w, this.size.h];
    this.imageProps = fitRect(rect, target, 'cover');
  }

  /**
   * Sets the start-point of the animation
   * @param {number} x
   * @param {number} y
   */
  set offset({x, y}) {
    this.options.offset = {
      x: x * window.devicePixelRatio,
      y: y * window.devicePixelRatio,
    };

    this.resize();

    // Calculate the total radius we should animate out to
    const maxX = Math.max(
      Math.abs(0 - this.options.offset.x),
      Math.abs(this.size.w - this.options.offset.x)
    );
    const maxY = Math.max(
      Math.abs(0 - this.options.offset.y),
      Math.abs(this.size.h - this.options.offset.y)
    );

    this.radius = Math.sqrt(maxX ** 2 + maxY ** 2);
  }

  render() {
    return <canvas className={style.root} ref={(el) => (this.canvas = el)} />;
  }
}

export default connect()(Transition);
