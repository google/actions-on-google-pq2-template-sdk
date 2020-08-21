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

const {Simple, Image, Suggestion} = require('@assistant/conversation');

const util = require('./util');
const metric = require('./analytics/metric.js');
const {Collection, Key, Schema, PromptVariant, Tab} = require('./sheet.js');
const {Intent, Type, Alias, Template, TemplateAction, TypeOverrideMode} = require('./constant.js');
const sheetData = require('./sheet-data.js');

/**
 * @typedef {Object} ConvHelperResponses
 * @property {string|Object} simple - Voice only simple response.
 * @property {Array} rich - Array of rich responses.
 * @property {Array} immersive - Array of Immersive responses.
 */

/**
 * Helper methods for AoG Conversation conv object.
 */
class ConvHelper {
  /**
   * @param {ConversationV3} conv - ConversationV3 instance.
   */
  constructor(conv) {
    this.conv = conv;
  }

  /**
   * Creates a ConvHelper instance.
   * @param {ConversationV3} conv - ConversationV3 instance.
   * @return {ConvHelper} - ConvHelperV3 instance.
   */
  static create(conv) {
    return new ConvHelper(conv);
  }

  /**
   * Get locale from request info
   * @return {string} - Conv locale
   */
  getLocale() {
    return this.conv.user.locale;
  }

  /**
   * Check whether current conv is a new conversation.
   * @return {boolean} - True if current conv is a new conversation.
   */
  isNewConversation() {
    const intent = this.conv.intent.name;
    return intent === Intent.MAIN || intent === Intent.PLAY_GAME;
  }

  /**
   * Loads quiz config settings and validates through FieldSchema.
   * @return {Promise<QuizSettings>} - Promise that resolves to validated quiz config settings.
   */
  getQuizSettings() {
    const collection = Collection.QUIZ_SETTINGS;
    const valueKey = Tab.QUIZ_SETTINGS.valueKey;
    const options = Object.values(Tab.QUIZ_SETTINGS.key);
    const settings = Object.assign(
      {},
      Tab.QUIZ_SETTINGS.default,
      this.loadCompatibleSettings(collection, valueKey, options)
    );
    return Promise.resolve(util.schema.validateObject(settings, Tab.QUIZ_SETTINGS.schema));
  }

  /**
   * Loads a random validated quiz intro doc.
   * @return {Promise<QuizIntro>} - Promise that resolves to validated quiz intro doc.
   */
  getRandomQuizIntro() {
    return Promise.resolve(this.getRandomValidatedDoc(Collection.QUIZ_INTRO, Schema.QUIZ_INTRO));
  }

  /**
   * Loads all validated quiz question docs.
   * @return {Promise<Array<Question>>} - Promise that resolves to validated quiz questions docs.
   */
  getAllQuizQuestions() {
    return Promise.resolve(this.getAllValidatedDocs(Collection.QUIZ_Q_A, Schema.QUIZ_Q_A));
  }

  /**
   * Loads all validated quiz outcome docs.
   * @return {Promise<Array<QuizOutcome>>} - Promise that resolves to validated quiz outcome docs.
   */
  getAllQuizOutcomes() {
    return Promise.resolve(
      this.getAllValidatedDocs(Collection.QUIZ_OUTCOMES, Schema.QUIZ_OUTCOMES)
    );
  }

  /**
   * Fetches a random prompt and optionally fill the placeholder strings.
   * @param {string} name - Prompt name to fetch.
   * @param {FormatArgs} [formatArgs] - Replacement strings for prompt.
   * @return {Promise<Simple>} - Promise that resolves to a formatted prompt.
   */
  getRandomFormattedPrompt(name, formatArgs) {
    return this.getRandomPrompt(name).then((prompt) =>
      util.response.formatSimple(prompt, formatArgs)
    );
  }

  /**
   * Fetches a random prompt from Firestore for all variants, then validates by field schema,
   * then converts to SimpleResponse shape, which simplifies ssml merge and concatenation.
   * @param {string} name - Prompt name.
   * @return {Promise<Simple>} - Promise that resolves to random validated prompt.
   */
  getRandomPrompt(name) {
    if (!PromptVariant[name]) {
      throw new Error(`Invalid prompt name provided: ${name}`);
    }
    const {key, variant} = PromptVariant[name];
    let keys = [key];
    if (variant > 0) {
      const {variantSuffix} = Tab.GENERAL_PROMPTS;
      keys = Array.from({length: variant}, (_, i) => `${key}${variantSuffix}${i + 1}`);
    }
    const prompts = keys.map((key) => {
      const prompt = sheetData.byLocale(this.getLocale())[Collection.GENERAL_PROMPTS][key];
      const validated = util.schema.validateObject(prompt, Schema.GENERAL_PROMPTS);
      return util.response.toSimple(
        validated,
        Key.GENERAL_PROMPTS.DISPLAYED_FLOW,
        Key.GENERAL_PROMPTS.SPOKEN_FLOW
      );
    });
    return Promise.resolve(util.array.randomPick(prompts.filter((prompt) => prompt.text)));
  }

  /**
   * Load a random document from a collection and validates with schema validator.
   * @param {string} collection - Collection name.
   * @param {Object} [schema={}] - Validation schema.
   * @return {Object} - Random validated collection doc.
   */
  getRandomValidatedDoc(collection, schema = {}) {
    return util.array.randomPick(this.getAllValidatedDocs(collection, schema));
  }

  /**
   * Load all documents from a collection and validates with schema validator.
   * @param {string} collection - Collection name.
   * @param {Object} [schema={}] - Validation schema.
   * @return {Array<Object>} - Validated collection docs.
   */
  getAllValidatedDocs(collection, schema = {}) {
    const docs = sheetData.byLocale(this.getLocale())[collection];
    return util.schema.validateCollection(docs, schema);
  }

  /**
   * Loads parameter settings, then filter by matching setting options.
   * @param {string} collection - Collection name.
   * @param {string} valueKey - Database value object key that maps to actual value.
   * @param {Array<string>} options - Compatible settings options.
   * @return {Object} - Compatible settings object.
   */
  loadCompatibleSettings(collection, valueKey, options) {
    const lowerCaseOptions = new Set(options.map((s) => s.toLowerCase()));
    const hasMatchKey = (_, key) => lowerCaseOptions.has(key.toLowerCase());
    const settings = this.loadSettings(collection, valueKey);
    return util.object.pickBy(settings, hasMatchKey);
  }

  /**
   * Loads parameter settings, then map values to valueKey property of value object.
   * @param {string} collection - Collection name.
   * @param {string} valueKey - Database value object key that maps to actual value.
   * @return {Object} - Settings object.
   */
  loadSettings(collection, valueKey) {
    const getValueCol = (target) => {
      target = Array.isArray(target) ? target[0] : target;
      return util.object.isObject(target) ? target[valueKey] : target;
    };
    const settings = sheetData.byLocale(this.getLocale())[collection];
    return util.object.mapValues(settings, getValueCol);
  }

  /**
   * Updates conv.session.params.data.quizSettings values with sheet settings for existing keys
   * (case-insensitive) only. New values will be converted to same type as existing values.
   * @param {!Object} sheetSettings - Sheet settings to update conv.session.params.data.quizSettings
   */
  updateConvDataQuizSettings(sheetSettings) {
    const {quizSettings} = this.conv.session.params.data;
    const lookup = new Map();
    Object.keys(quizSettings).forEach((prop) => lookup.set(prop.toLowerCase(), prop));
    util.object.forOwn(sheetSettings, (val, key) => {
      const lowerCaseKey = key.toLowerCase();
      if (lookup.has(lowerCaseKey)) {
        const prop = lookup.get(lowerCaseKey);
        quizSettings[prop] = util.string.convertType(val, typeof quizSettings[prop]);
      }
    });
  }

  /**
   * Checks whether input is a valid transition object.
   * transition = {simple: '', rich: [], immersive: {}}
   * @param {?TransitionResponse} target - Input to check.
   * @return {boolean} - True for valid transition.
   */
  isValidTransition(target) {
    return (
      util.object.isObject(target) &&
      typeof target.simple === 'string' &&
      Array.isArray(target.rich) &&
      util.object.isObject(target.immersive)
    );
  }

  /**
   * Builds session type and speech biasing for answer type.
   */
  setupSessionTypeAndSpeechBiasing() {
    const clean = (synonyms) => [...new Set(synonyms.map((s) => util.string.stripEmoji(s).trim()))];
    const question = this.getCurrentQuestion();
    const positiveAnswers = clean(question[Alias.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS]);
    const negativeAnswers = clean(question[Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS]);
    this.conv.expected.speech = [...positiveAnswers, ...negativeAnswers];
    this.addSessionType(Type.ANSWER, positiveAnswers, negativeAnswers);
  }

  /**
   * Add entry to session type.
   * @param {string} typeName - Session type name.
   * @param {Array<Array<string>>} synonymsEntries - List of synonyms for session type.
   */
  addSessionType(typeName, ...synonymsEntries) {
    const entries = synonymsEntries.map((synonyms) => {
      synonyms = synonyms.map((tokens) => tokens.toLowerCase().trim()).filter(Boolean);
      return {name: synonyms[0], synonyms: [...new Set(synonyms)]};
    });
    const sessionType = {
      name: typeName,
      mode: TypeOverrideMode.TYPE_REPLACE,
      synonym: {entries},
    };
    const index = this.conv.session.typeOverrides.findIndex((ele) => ele.name === sessionType.name);

    if (index === -1) {
      this.conv.session.typeOverrides.push(sessionType);
    } else {
      this.conv.session.typeOverrides[index] = sessionType;
    }
  }

  /**
   * Returns rich response suggestion chip texts for current question.
   * @return {Array<string>} - Rich response suggestion chip texts for current question.
   */
  getQuestionRichSuggestions() {
    const question = this.getCurrentQuestion();
    return [
      this.cleanRichSuggestion(question[Alias.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS][0]),
      this.cleanRichSuggestion(question[Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS][0]),
    ];
  }

  /**
   * Get UserAnswer and clear it in session params.
   * @return {string} - Captured value of 'answer' type.
   */
  getAndClearUserAnswer() {
    const userAnswer = this.conv.session.params.UserAnswer;
    this.conv.session.params.UserAnswer = null;
    return userAnswer;
  }

  /**
   * Returns the current quiz question.
   * @return {Question} - Current question.
   */
  getCurrentQuestion() {
    return this.conv.session.params.data.questions[this.conv.session.params.data.count];
  }

  /**
   * Fetches suggestion prompts and build cleaned rich response suggestion chips.
   * @param {Array<string>} prompts - Suggestion chip prompts.
   * @return {Promise<Array<string>>} - Promise that resolves to cleans suggestion chip texts.
   */
  buildPromptRichSuggestions(prompts) {
    return Promise.all(prompts.map(this.getRandomPrompt.bind(this))).then((chips) =>
      chips.map(this.cleanRichSuggestion.bind(this))
    );
  }

  /**
   * Clean text for Rich response suggestion chip.
   * @param {string[]|Simple[]} chip - Suggestion chip text or prompt object.
   * @return {Array<string>} - Cleaned suggestion chip text.
   */
  cleanRichSuggestion(chip) {
    return util.string.stripEmoji(typeof chip === 'string' ? chip : chip.text).trim();
  }

  /**
   * Build rich response basic card for an outcome.
   * @param {QuizOutcome} outcome - Outcome doc.
   * @return {?RichBasicCard} - BasicCard shape object or null.
   */
  buildOutcomeBasicCard(outcome) {
    const bodyText = outcome[Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME];
    const imageUrl = outcome[Alias.QUIZ_OUTCOMES.HORIZONTAL_IMAGE];
    const title = outcome[Alias.QUIZ_OUTCOMES.TITLE];
    if (!bodyText && !imageUrl) return null;
    const card = {imageFill: 'WHITE'};
    if (title) card.title = title;
    if (bodyText) card.text = bodyText;
    if (imageUrl) card.image = new Image({url: imageUrl, alt: title || 'outcome image'});
    return card;
  }

  /**
   * Continue the conv by asking a randomly fetched prompt.
   * @param {string} name - Prompt name.
   * @param {string[]} [suggestions] - An array of suggestions used for Rich Response.
   * @return {Promise} - Promise that resolves to continue the conv with a prompt.
   */
  askWithPrompt(name, suggestions) {
    return this.getRandomPrompt(name).then((prompt) =>
      this.ask({
        simple: prompt.speech,
        rich: [
          new Simple(prompt),
          ...(Array.isArray(suggestions)
            ? suggestions.map((str) => new Suggestion({title: util.string.stripEmoji(str)}))
            : [null]),
        ].filter(Boolean),
        immersive: [
          new Simple(prompt.speech),
          this.conv.$immersive
            .set('template', Template.SAY)
            .set('action', TemplateAction.RESET)
            .set('speech', prompt.speech)
            .build(),
        ],
      })
    );
  }

  /**
   * Closes the conv with a randomly fetched prompt.
   * @param {string} name - Prompt name.
   * @return {Promise} - Promise that resolves to close the conv with a prompt.
   */
  closeWithPrompt(name) {
    return this.getRandomPrompt(name).then((prompt) =>
      this.close({
        simple: prompt.speech,
        rich: [new Simple(prompt)],
        immersive: [
          new Simple(prompt.speech),
          this.conv.$immersive
            .set('suppressMic', true)
            .set('template', Template.TELL)
            .set('speech', prompt.speech)
            .build(),
        ],
      })
    );
  }

  /**
   * Continue conversation with constructed responses.
   * @param {ConvHelperResponses} responses - Simple, rich and immersive responses.
   */
  ask(responses) {
    this.respond('ask', responses);
  }

  /**
   * Closes conversation with constructed responses.
   * @param {ConvHelperResponses} responses - Simple, rich and immersive responses.
   */
  close(responses) {
    this.respond('close', responses);
  }

  /**
   * Responds to user by response type based on device capability.
   * @param {string} type - Response type ('ask', 'close')
   * @param {ConvHelperResponses} responses - Simple, rich and immersive responses.
   */
  respond(type, {simple, rich = [], immersive = []} = {}) {
    metric.jsonSize('conv.session.params', this.conv.session.params);
    if (this.conv.hasInteractiveCanvas && immersive.filter(Boolean).length > 0) {
      this.conv.add(...immersive);
    } else if (this.conv.hasScreen && rich.filter(Boolean).length > 0) {
      this.conv.add(...rich);
    } else {
      this.conv.add(simple);
    }

    if (type === 'close') {
      this.conv.scene.next = {name: 'actions.scene.END_CONVERSATION'};
    }
  }
}

module.exports = ConvHelper;
