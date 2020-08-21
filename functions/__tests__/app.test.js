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

const rewire = require('rewire');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {expect} = chai;
chai.use(sinonChai);

const app = rewire('../app.js');
const {Prompt} = require('../constant.js');
const logger = require('../analytics/logger.js');
const ConvHelper = require('../conv-helper.js');
const CanvasBuilder = require('../canvas-builder.js');

describe('app', function() {
  const initDataCtor = app.__get__('initDataCtor');
  const middleware = app.__get__('middleware');
  const errorHandler = app.__get__('errorHandler');

  before(function() {
    logger.transports.forEach((t) => (t.silent = true));
  });

  beforeEach(function() {
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('exports', function() {
    it('exports a ConversationV3 app', function() {
      expect(app).to.be.a('function');
      expect(app.middleware).to.be.a('function');
      expect(app.catch).to.be.a('function');
    });
  });

  describe('initDataCtor', function() {
    it('is an function', function() {
      expect(initDataCtor).to.be.a('function');
    });

    it('returns an object for initial conv data', function() {
      const initData = initDataCtor();
      expect(initData).to.be.an('object');
      expect(initData.quizSettings).to.be.an('object');
    });
  });

  describe('middleware', function() {
    let fakeConv;

    beforeEach(function() {
      fakeConv = {
        request: {},
        headers: {
          ['function-execution-id']: 'xyz123',
        },
        handler: {
          name: 'LOAD_SETTINGS',
        },
        intent: {
          name: 'actions.intent.MAIN',
          params: {},
          query: 'Talk to test app',
        },
        scene: {
          name: 'Welcome',
          slotFillingStatus: 'UNSPECIFIED',
          slots: {},
        },
        session: {
          id: 'abc123',
          params: {},
          typeOverrides: [],
          languageCode: '',
        },
        user: {
          locale: 'en-US',
          params: {},
          accountLinkingStatus: 'ACCOUNT_LINKING_STATUS_UNSPECIFIED',
          verificationStatus: 'VERIFIED',
          packageEntitlements: [],
          lastSeenTime: '2020-08-07T23:11:04Z',
        },
        home: {
          params: {},
        },
        device: {
          capabilities: [
            'SPEECH',
            'RICH_RESPONSE',
            'WEB_LINK',
            'LONG_FORM_AUDIO',
            'INTERACTIVE_CANVAS',
          ],
        },
        expected: {
          speech: [],
        },
        context: {},
        add: () => {},
        append: () => {},
        json: () => {},
        response: () => {},
        serialize: () => {},
      };
    });

    it('sets capability shortcut properties to true', function() {
      fakeConv.device.capabilities = [
        'SPEECH',
        'RICH_RESPONSE',
        'WEB_LINK',
        'LONG_FORM_AUDIO',
        'INTERACTIVE_CANVAS',
      ];
      middleware(fakeConv);
      expect(fakeConv.hasScreen).to.be.true;
      expect(fakeConv.hasAudio).to.be.true;
      expect(fakeConv.hasLongFormAudio).to.be.true;
      expect(fakeConv.hasWebBrowser).to.be.true;
      expect(fakeConv.hasInteractiveCanvas).to.be.true;
    });

    it('sets capability shortcut properties to false', function() {
      fakeConv.device.capabilities = [,];
      middleware(fakeConv);
      expect(fakeConv.hasScreen).to.be.false;
      expect(fakeConv.hasAudio).to.be.false;
      expect(fakeConv.hasLongFormAudio).to.be.false;
      expect(fakeConv.hasWebBrowser).to.be.false;
      expect(fakeConv.hasInteractiveCanvas).to.be.false;
    });

    it('assigns a init data to conv.session.params.data if does not exist', function() {
      fakeConv.session.params = {};
      middleware(fakeConv);
      expect(fakeConv.session.params.data).to.be.a('object');
    });

    it('not assigns a init data to conv.session.params.data if already exists', function() {
      fakeConv.session.params.data = {a: 1};
      middleware(fakeConv);
      expect(fakeConv.session.params.data).to.eql({a: 1});
    });

    it('instantiate a $helper prop on conv', function() {
      middleware(fakeConv);
      expect(fakeConv.$helper).to.be.instanceOf(ConvHelper);
    });

    it('instantiate a $immersive prop on conv', function() {
      middleware(fakeConv);
      expect(fakeConv.$immersive).to.be.instanceOf(CanvasBuilder);
    });

    it('instantiate $immersive prop with url if is a new conversation', function() {
      fakeConv.intent.name = 'actions.intent.MAIN';
      middleware(fakeConv);
      expect(fakeConv.$immersive.url).to.be.ok;
    });

    it('instantiate $immersive prop with empty url if is not a new conversation', function() {
      fakeConv.intent.name = 'YES';
      middleware(fakeConv);
      expect(fakeConv.$immersive.url).to.not.be.ok;
    });
  });

  describe('errorHandler', function() {
    const originalImmersive = CanvasBuilder.create(true);
    let fakeConv;

    beforeEach(function() {
      fakeConv = {
        request: {},
        headers: {
          ['function-execution-id']: 'xyz123',
        },
        handler: {
          name: 'LOAD_SETTINGS',
        },
        intent: {
          name: 'actions.intent.MAIN',
          params: {},
          query: 'Talk to test app',
        },
        scene: {
          name: 'Welcome',
          slotFillingStatus: 'UNSPECIFIED',
          slots: {},
        },
        session: {
          id: 'abc123',
          params: {},
          typeOverrides: [],
          languageCode: '',
        },
        user: {
          locale: 'en-US',
          params: {},
          accountLinkingStatus: 'ACCOUNT_LINKING_STATUS_UNSPECIFIED',
          verificationStatus: 'VERIFIED',
          packageEntitlements: [],
          lastSeenTime: '2020-08-07T23:11:04Z',
        },
        home: {
          params: {},
        },
        device: {
          capabilities: [
            'SPEECH',
            'RICH_RESPONSE',
            'WEB_LINK',
            'LONG_FORM_AUDIO',
            'INTERACTIVE_CANVAS',
          ],
        },
        expected: {
          speech: [],
        },
        context: {},
        add: () => {},
        append: () => {},
        json: () => {},
        response: () => {},
        serialize: () => {},
        $immersive: originalImmersive,
      };

      fakeConv.$helper = ConvHelper.create(fakeConv);
      sinon.spy(logger, 'error');
    });

    it('logs error message by logger', async function() {
      await errorHandler(fakeConv, new Error('failed'));
      expect(logger.error).to.have.been.called;
    });

    it('resets conv.$immersive to a new instance', async function() {
      fakeConv.intent.name = 'YES';
      await errorHandler(fakeConv, new Error('failed'));
      expect(fakeConv.$immersive).to.not.equal(originalImmersive);
    });

    it('invokes conv.$helper.closeWithPrompt with GENERIC_MAX_NO_MATCH prompt', async function() {
      sinon.stub(fakeConv.$helper, 'closeWithPrompt').resolves({});
      await errorHandler(fakeConv, new Error('failed'));
      expect(fakeConv.$helper.closeWithPrompt).to.have.been.calledWith(Prompt.GENERIC_MAX_NO_MATCH);
    });

    it('catches error if conv.$helper.closeWithPrompt fails', async function() {
      sinon.spy(fakeConv, 'add');
      sinon.stub(fakeConv.$helper, 'closeWithPrompt').rejects(new Error('failed again'));
      await errorHandler(fakeConv, new Error('failed'));
      expect(fakeConv.$helper.closeWithPrompt).to.have.been.calledWith(Prompt.GENERIC_MAX_NO_MATCH);
      expect(fakeConv.scene.next).to.eql({name: 'actions.scene.END_CONVERSATION'});
      expect(fakeConv.add).to.have.been.called;
    });
  });
});
