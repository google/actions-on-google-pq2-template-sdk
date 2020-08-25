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

const {conversation} = require('@assistant/conversation');

const config = require('./config.js');
const {Action, Alias, Prompt} = require('./constant.js');
const util = require('./util');
const debug = require('./analytics/debug.js');
const logger = require('./analytics/logger.js');
const CanvasBuilder = require('./canvas-builder.js');
const ConvHelper = require('./conv-helper.js');
const Fulfillment = require('./fulfillment.js');

/**
 * @module app
 * @desc ConversationV3 App Setup and Routing
 */

/**
 * Init data constructor, output will be set to conv.session.params.data on initial request.
 * @return {Object<string, any>} - Init data.
 */
const initDataCtor = () => ({
  quizSettings: {
    [Alias.QUIZ_SETTINGS.PLAY_INTRO_CONFIRMATION]: config.PLAY_INTRO_CONFIRMATION_DEFAULT,
    [Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ]: config.QUESTIONS_PER_QUIZ_DEFAULT,
    [Alias.QUIZ_SETTINGS.INTRO_TITLE]: config.INTRO_TITLE_DEFAULT,
    [Alias.QUIZ_SETTINGS.INTRO_SUBTITLE]: config.INTRO_SUBTITLE_DEFAULT,
    [Alias.QUIZ_SETTINGS.INTRO_TITLE_COLOR]: config.INTRO_TITLE_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.INTRO_SUBTITLE_COLOR]: config.INTRO_SUBTITLE_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.START_BUTTON_TEXT]: config.START_BUTTON_TEXT_DEFAULT,
    [Alias.QUIZ_SETTINGS.RESTART_BUTTON_TEXT]: config.RESTART_BUTTON_TEXT_DEFAULT,
    [Alias.QUIZ_SETTINGS.TEXT_COLOR]: config.TEXT_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.FONT]: config.FONT_DEFAULT,
    [Alias.QUIZ_SETTINGS.BUTTON_NORMAL_TEXT_COLOR]: config.BUTTON_NORMAL_TEXT_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.BUTTON_NORMAL_BACKGROUND_COLOR]:
      config.BUTTON_NORMAL_BACKGROUND_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.BUTTON_SELECTED_TEXT_COLOR]: config.BUTTON_SELECTED_TEXT_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.BUTTON_SELECTED_BACKGROUND_COLOR]:
      config.BUTTON_SELECTED_BACKGROUND_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.PROGRESS_BAR_BACKGROUND_COLOR]:
      config.PROGRESS_BAR_BACKGROUND_COLOR_DEFAULT,
    [Alias.QUIZ_SETTINGS.PROGRESS_BAR_FILL_COLOR]: config.PROGRESS_BAR_FILL_COLOR_DEFAULT,
  },
  count: 0,
  limit: config.MAX_QUESTIONS_PER_QUIZ,
  questions: [],
  traitToWeight: {},
});

/**
 * Device capabilities to conv field lookup.
 */
const capabilityLookup = {
  RICH_RESPONSE: 'hasScreen',
  SPEECH: 'hasAudio',
  LONG_FORM_AUDIO: 'hasLongFormAudio',
  WEB_LINK: 'hasWebBrowser',
  INTERACTIVE_CANVAS: 'hasInteractiveCanvas',
};

/**
 * ConversationV3 app middleware handler.
 * @param {ConversationV3} conv - ConversationV3 instance.
 */
const middleware = (conv) => {
  // Set capability helper props on conv.
  util.object.forOwn(capabilityLookup, (prop, capability) => {
    conv[prop] = conv.device.capabilities.includes(capability);
  });
  // Add init data to conv.session.params.data on initial request.
  if (conv.session.params.data == null) {
    conv.session.params.data = Object.assign({}, initDataCtor());
  }
  // Attach a ConvHelper instance to conv.$helper
  conv.$helper = ConvHelper.create(conv);
  // Attach a CanvasBuilder instance to conv.$immersive
  conv.$immersive = CanvasBuilder.create(conv.hasInteractiveCanvas, {
    url: conv.$helper.isNewConversation() ? config.IMMERSIVE_URL : null,
  });
};

/**
 * ConversationV3 app error handler.
 * @param {ConversationV3} conv - ConversationV3 instance.
 * @param {Error} error - Error object.
 * @return {?Promise} - Promise that resolve to error handler response.
 */
const errorHandler = async (conv, error) => {
  debug.setDebugInfo(conv, error);
  logger.error(`An error has occurred handling [${conv.handler.name}]: `, {
    labels: {execution_id: conv.headers['function-execution-id']},
    stack: error.stack,
    conv: util.object.stringify(conv),
  });
  // Reset canvas response builder to default initial state.
  conv.$immersive = CanvasBuilder.create(conv.hasInteractiveCanvas, {
    url: conv.$helper.isNewConversation() ? config.IMMERSIVE_URL : null,
  });
  try {
    await conv.$helper.closeWithPrompt(Prompt.GENERIC_MAX_NO_MATCH);
  } catch (err) {
    err.labels = {execution_id: conv.headers['function-execution-id']};
    logger.error(`Failed to follow up with a fallback error response: `, err);
    conv.scene.next = {name: 'actions.scene.END_CONVERSATION'};
    conv.add('An unknown error occurred.');
  }
};

// Instantiates the ConversationV3 app.
const app = conversation({debug: false});
// App Middleware.
app.middleware(middleware);
// Map fulfillment handlers with actions
const fulfillment = Fulfillment.create();
for (const action of Object.values(Action)) {
  if (typeof fulfillment[action] !== 'function') continue;
  app.handle(action, async (conv, ...args) => {
    await fulfillment[action](conv, ...args);
    debug.setDebugInfo(conv);
  });
}
// Handles uncaught errors.
app.catch(errorHandler);

module.exports = app;
