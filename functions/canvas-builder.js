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

'use strict';

const {Canvas} = require('@assistant/conversation');

const util = require('./util');

/**
 * @typedef CanvasState
 * @property {string} [url] - Host url of web app.
 * @property {boolean} [suppressMic] - True to close mic.
 * @property {string} [action] - Canvas response action.
 * @property {string} [template] - Canvas response template.
 * @property {string} [speech] - Output TTS to be spoken by device.
 * @property {Object<string, any>} [config] - Configuration options for web app.
 * @property {Object<string, any>} [data] - Displayable data for web app.
 * @property {Array<Object|string>} [suggestions] - Suggestion chips.
 * @property {CanvasBuilder} [next] - Next Canvas response.
 */

/**
 * Utility class to construct Canvas Response object.
 */
class CanvasBuilder {
  /**
   * Constructs a new CanvasBuilder object.
   * @param {CanvasState} initialState - Initial state.
   */
  constructor(initialState = {}) {
    this.url = initialState.url || '';
    this.suppressMic = initialState.suppressMic || false;
    this.action = initialState.action || '';
    this.template = initialState.template || '';
    this.speech = initialState.speech || '';
    this.config = initialState.config || {};
    this.data = initialState.data || {};
    this.suggestions = initialState.suggestions || [];
    this.next = initialState.next || null;
  }

  /**
   * Sets canvas states by state object.
   * @param {CanvasState} newState - New state object.
   * @return {CanvasBuilder} - This instance.
   */
  setState(newState = {}) {
    util.object.forOwn(newState, (val, prop) => {
      switch (prop) {
        case 'url':
        case 'suppressMic':
        case 'action':
        case 'template':
        case 'speech':
        case 'next':
          this.set(prop, val);
          break;
        case 'config':
        case 'data':
        case 'suggestions':
          this.add(prop, val);
          break;
        default:
          break;
      }
    });
    return this;
  }

  /**
   * Sets new value for prop.
   * @param {string} prop - Property name.
   * @param {*} value - New value.
   * @return {CanvasBuilder} - This instance.
   */
  set(prop, value) {
    if (this.hasOwnProperty(prop)) {
      this[prop] = value;
    }
    return this;
  }

  /**
   * Adds new values for existing prop with array/object value type.
   * @param {string} prop - Property name.
   * @param {!Object|Array} values - New values.
   * @return {CanvasBuilder} - This instance.
   */
  add(prop, values) {
    if (this.hasOwnProperty(prop)) {
      if (Array.isArray(this[prop])) {
        this[prop] = this[prop].concat(values);
      } else if (typeof this[prop] === 'object') {
        this[prop] = Object.assign(this[prop], values);
      } else {
        this.set(prop, values);
      }
    }
    return this;
  }

  /**
   * Builds state object.
   * @return {Object} - Constructed state object.
   */
  buildState() {
    return CanvasBuilder.clean({
      action: this.action,
      template: this.template,
      speech: this.speech,
      config: this.config,
      data: this.data,
      suggestions: this.suggestions,
      next: this.next,
    });
  }

  /**
   * Builds Canvas Response for ConversationV3.
   * @param {string} url - URL for canvas init.
   * @return {Canvas} - Canvas response.
   */
  build(url) {
    if (typeof url === 'string' && url) {
      this.url = url;
    }
    const slides = [this.buildState()];
    while (slides[slides.length - 1].next) {
      const last = slides[slides.length - 1];
      slides.push(last.next);
      delete last.next;
    }
    return new Canvas({
      url: this.url,
      suppressMic: this.suppressMic,
      data: slides,
    });
  }

  /**
   * Cleans the SSML fields, and remove all empty properties.
   * @param {Object} state - Canvas response state.
   * @return {Object} - Cleaned canvas response state.
   */
  static clean(state) {
    if (state.speech) {
      state.speech = util.ssml.clean(state.speech).trim();
    }
    const cleanedNext = state.next instanceof CanvasBuilder ? state.next.buildState() : null;
    state.next = null; // deep clean on next is already done above
    const cleanedState = util.object.deepClean(state);
    if (!util.object.isEmpty(cleanedNext)) {
      cleanedState.next = cleanedNext;
    }
    return cleanedState;
  }

  /**
   * Creates either an CanvasBuilder instance or one with Proxy wrapper.
   * If using Proxy object:
   * - Routes all method invocation to do nothing.
   * - Routes all property lookup to return undefined.
   * - Skips redundant work when immersive response is not needed.
   * @param {boolean} hasCanvas - False to create a Proxy wrapper object.
   * @param {...any} args - Args to pass to CanvasBuilder constructor.
   * @return {CanvasBuilder|Proxy} - CanvasBuilder or Proxy wrapper.
   */
  static create(hasCanvas, ...args) {
    // Wrap instance with Proxy object
    const wrap = function(obj) {
      const handler = {
        get(target, prop, receiver) {
          if (target[prop] instanceof Function) {
            return () => (prop.startsWith('build') ? undefined : receiver);
          }
        },
      };
      return new Proxy(obj, handler);
    };
    const instance = new CanvasBuilder(...args);
    return hasCanvas ? instance : wrap(instance);
  }
}

module.exports = CanvasBuilder;
