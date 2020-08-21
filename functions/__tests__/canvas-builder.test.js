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

const chai = require('chai');
const {expect} = chai;

const {Canvas} = require('@assistant/conversation');

const CanvasBuilder = require('../canvas-builder.js');

describe('CanvasBuilder', function() {
  describe('constructor', function() {
    it('is a function', function() {
      expect(CanvasBuilder).to.be.a('function');
    });

    it('has static create function', function() {
      expect(CanvasBuilder.create).to.be.a('function');
    });

    it('has static clean function', function() {
      expect(CanvasBuilder.clean).to.be.a('function');
    });

    it('is a class constructor', function() {
      expect(new CanvasBuilder()).to.be.instanceOf(CanvasBuilder);
    });

    it('returns an object with defined methods', function() {
      const output = new CanvasBuilder();
      expect(output.setState).to.be.a('function');
      expect(output.set).to.be.a('function');
      expect(output.add).to.be.a('function');
      expect(output.buildState).to.be.a('function');
      expect(output.build).to.be.a('function');
    });

    it('returns an object with defined props', function() {
      const output = new CanvasBuilder();
      expect(output).to.have.property('url');
      expect(output).to.have.property('suppressMic');
      expect(output).to.have.property('action');
      expect(output).to.have.property('template');
      expect(output).to.have.property('speech');
      expect(output).to.have.property('config');
      expect(output).to.have.property('data');
      expect(output).to.have.property('suggestions');
      expect(output).to.have.property('next');
    });
  });

  describe('static create', function() {
    it('returns CanvasBuilder instance if hasCanvas is true', function() {
      const hasCanvas = true;
      const output = CanvasBuilder.create(hasCanvas);
      expect(output).to.be.instanceOf(CanvasBuilder);
      expect(output).to.not.be.instanceOf(Proxy);
    });

    it('returns Proxy instance if hasCanvas is false', function() {
      const hasCanvas = false;
      const output = CanvasBuilder.create(hasCanvas);
      expect(output.action).to.be.undefined;
      expect(output.build()).to.be.undefined;
    });

    it('passes rest args to CanvasBuilder constructor', function() {
      const hasCanvas = true;
      const action = 'testAction';
      const output = CanvasBuilder.create(hasCanvas, {action});
      expect(output.action).to.equal(action);
    });
  });

  describe('static clean', function() {
    it('returns an object', function() {
      const output = CanvasBuilder.clean({});
      expect(output).to.be.a('object');
    });

    it('invoke ssml.clean if has speech property', function() {
      const testState = {speech: '<speak >   a   </speak>'};
      const output = CanvasBuilder.clean(testState);
      expect(output.speech).to.equal('<speak>a</speak>');
    });

    it('deep cleans on input state', function() {
      const testState = {action: 'a', config: {data: {}}};
      const output = CanvasBuilder.clean(testState);
      expect(output).to.eql({action: 'a'});
    });

    it('cleans state.next if it is CanvasBuilder instance', function() {
      const testState = {action: 'a', config: {}, data: {}};
      testState.next = new CanvasBuilder({action: 'b', data: {}});
      const output = CanvasBuilder.clean(testState);
      expect(output).to.eql({action: 'a', next: {action: 'b'}});
    });
  });

  describe('setState', function() {
    let instance;

    beforeEach(function() {
      instance = new CanvasBuilder();
    });

    it('returns CanvasBuilder instance', function() {
      const output = instance.setState({});
      expect(output).to.equal(instance);
    });

    it('sets internal props with new values', function() {
      const testState = {
        url: 'a',
        suppressMic: true,
        action: 'b',
        speech: 'd',
        next: 'e',
        template: 'f',
      };
      instance.setState(testState);
      expect(instance.url).to.equal(testState.url);
      expect(instance.suppressMic).to.equal(testState.suppressMic);
      expect(instance.action).to.equal(testState.action);
      expect(instance.micState).to.equal(testState.micState);
      expect(instance.speech).to.equal(testState.speech);
      expect(instance.next).to.equal(testState.next);
      expect(instance.template).to.equal(testState.template);
    });

    it('adds internal props with new values', function() {
      const testState1 = {
        config: {a: 1},
        data: {b: 1},
        suggestions: [1, 2, 3],
      };
      const testState2 = {
        config: {b: 1},
        data: {a: 1},
        suggestions: [1, 2, 3],
      };
      instance.setState(testState1);
      instance.setState(testState2);
      expect(instance.config).to.eql({a: 1, b: 1});
      expect(instance.data).to.eql({a: 1, b: 1});
      expect(instance.suggestions).to.eql([1, 2, 3, 1, 2, 3]);
    });

    it('not set prop that are not defined in constructor', function() {
      const testState = {
        abc: 1,
        xyz: [1, 2],
      };
      instance.setState(testState);
      expect(instance.abc).to.be.undefined;
      expect(instance.xyz).to.be.undefined;
    });
  });

  describe('set', function() {
    const testValue = 'testValue';
    let instance;

    beforeEach(function() {
      instance = new CanvasBuilder();
    });

    it('returns CanvasBuilder instance', function() {
      const output = instance.set('action', 'newAction');
      expect(output).to.equal(instance);
    });

    it('sets internal props with new value', function() {
      instance.set('action', testValue);
      expect(instance.action).to.equal(testValue);
    });

    it('not set prop that are not defined in constructor', function() {
      instance.set('abc', testValue);
      expect(instance.abc).to.be.undefined;
    });
  });

  describe('add', function() {
    let instance;

    beforeEach(function() {
      instance = new CanvasBuilder();
    });

    it('returns CanvasBuilder instance', function() {
      const output = instance.add('config', {});
      expect(output).to.equal(instance);
    });

    it('concat array props with new values', function() {
      const testValue = [1, 2, 3];
      instance.add('suggestions', testValue);
      instance.add('suggestions', testValue);
      expect(instance.suggestions).to.eql([1, 2, 3, 1, 2, 3]);
    });

    it('add/update objects props with new values', function() {
      const testValue1 = {a: 1, b: 2};
      instance.add('config', testValue1);
      expect(instance.config).to.eql(testValue1);
      const testValue2 = {b: 3, c: 4};
      instance.add('config', testValue2);
      expect(instance.config).to.eql({a: 1, b: 3, c: 4});
    });

    it('replaces prop with primitive type value', function() {
      const testValue = 'FOO_BAR';
      instance.add('action', testValue);
      expect(instance.action).to.eql(testValue);
    });

    it('not set prop that are not defined in constructor', function() {
      const testValue = {a: 1, b: 2};
      instance.add('abc', testValue);
      expect(instance.abc).to.be.undefined;
    });
  });

  describe('buildState', function() {
    let instance;

    beforeEach(function() {
      instance = new CanvasBuilder();
    });

    it('returns an object', function() {
      const output = instance.buildState();
      expect(output).to.be.a('object');
    });

    it('returns a cleaned state', function() {
      instance.setState({
        action: 'a',
        data: {},
        config: {},
      });
      const output = instance.buildState();
      expect(output).to.eql({action: 'a'});
    });
  });

  describe('build', function() {
    let instance;

    beforeEach(function() {
      instance = new CanvasBuilder({
        suppressMic: false,
      });
    });

    it('returns an object', function() {
      const output = instance.build();
      expect(output).to.be.a('object');
    });

    it('updates valid immersive url from input', function() {
      instance.url = '';
      const testUrl = 'myCustomUrl';
      const output = instance.build(testUrl);
      expect(output.url).to.equal(testUrl);
    });

    it('returns Canvas instance from @assistant/conversation library', function() {
      const state = {
        url: 'abc',
        suppressMic: true,
        action: 'action1',
        template: 'template1',
        config: {a: 1},
        data: {b: 1},
        suggestions: ['a', 'b', 'c'],
      };
      instance.setState(state);
      const output = instance.build();
      expect(output).to.be.instanceOf(Canvas);
      expect(output.url).to.eql(state.url);
      expect(output.suppressMic).to.eql(state.suppressMic);
      expect(output.data).to.be.a('array');
      expect(output.data[0].action).to.eql(state.action);
      expect(output.data[0].template).to.eql(state.template);
      expect(output.data[0].config).to.eql(state.config);
      expect(output.data[0].data).to.eql(state.data);
      expect(output.data[0].suggestions).to.eql(state.suggestions);
    });

    it('returns built states as multiple elements of data array', function() {
      const state1 = {action: 'action1', template: 'template1'};
      const state2 = {action: 'action2', template: 'template2'};
      instance.setState(state1);
      instance.set('next', new CanvasBuilder());
      instance.next.setState(state2);
      const output = instance.build();
      expect(output).to.be.instanceOf(Canvas);
      expect(output.data).to.be.a('array');
      expect(output.data[0]).to.eql(state1);
      expect(output.data[1]).to.eql(state2);
    });
  });
});
