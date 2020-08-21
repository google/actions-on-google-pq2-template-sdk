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

/**
 * @module constant
 * @desc Common enumeration constants.
 */

/**
 * Action names from ConversationV3 handlers.
 * @readonly
 */
const Action = {
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  SETUP_QUIZ: 'SETUP_QUIZ',
  START_SKIP_CONFIRMATION: 'START_SKIP_CONFIRMATION',
  START_CONFIRMATION: 'START_CONFIRMATION',
  START_YES: 'START_YES',
  START_NO: 'START_NO',
  START_HELP: 'START_HELP',
  START_REPEAT: 'START_REPEAT',
  START_NO_MATCH_1: 'START_NO_MATCH_1',
  START_NO_MATCH_2: 'START_NO_MATCH_2',
  START_NO_INPUT_1: 'START_NO_INPUT_1',
  START_NO_INPUT_2: 'START_NO_INPUT_2',
  QUESTION_REPEAT: 'QUESTION_REPEAT',
  ANSWER: 'ANSWER',
  ANSWER_ORDINAL: 'ANSWER_ORDINAL',
  ANSWER_BOTH_OR_NONE: 'ANSWER_BOTH_OR_NONE',
  ANSWER_HELP: 'ANSWER_HELP',
  ANSWER_SKIP: 'ANSWER_SKIP',
  ANSWER_NO_MATCH_1: 'ANSWER_NO_MATCH_1',
  ANSWER_NO_MATCH_2: 'ANSWER_NO_MATCH_2',
  ANSWER_MAX_NO_MATCH: 'ANSWER_MAX_NO_MATCH',
  ANSWER_NO_INPUT_1: 'ANSWER_NO_INPUT_1',
  ANSWER_NO_INPUT_2: 'ANSWER_NO_INPUT_2',
  ANSWER_MAX_NO_INPUT: 'ANSWER_MAX_NO_INPUT',
  RESTART_CONFIRMATION: 'RESTART_CONFIRMATION',
  RESTART_YES: 'RESTART_YES',
  RESTART_NO: 'RESTART_NO',
  RESTART_REPEAT: 'RESTART_REPEAT',
  PLAY_AGAIN_YES: 'PLAY_AGAIN_YES',
  PLAY_AGAIN_NO: 'PLAY_AGAIN_NO',
  PLAY_AGAIN_REPEAT: 'PLAY_AGAIN_REPEAT',
  QUIT_CONFIRMATION: 'QUIT_CONFIRMATION',
  QUIT_YES: 'QUIT_YES',
  QUIT_NO: 'QUIT_NO',
  QUIT_REPEAT: 'QUIT_REPEAT',
  GENERIC_NO_MATCH: 'GENERIC_NO_MATCH',
  GENERIC_MAX_NO_MATCH: 'GENERIC_MAX_NO_MATCH',
  GENERIC_NO_INPUT: 'GENERIC_NO_INPUT',
  GENERIC_MAX_NO_INPUT: 'GENERIC_MAX_NO_INPUT',
};

/**
 * ConversationV3 intents.
 * @readonly
 */
const Intent = {
  MAIN: 'actions.intent.MAIN',
  PLAY_GAME: 'actions.intent.PLAY_GAME',
  NO_MATCH: 'actions.intent.NO_MATCH',
  NO_INPUT: 'actions.intent.NO_INPUT',
  CANCEL: 'actions.intent.CANCEL',
  HELP: 'Help',
  YES: 'Yes',
  NO: 'No',
  ORDINAL_CHOICE: 'OrdinalChoice',
  BOTH_OR_NONE: 'BothOrNone',
  QUIT: 'Quit',
  REPEAT: 'Repeat',
  RESTART: 'Restart',
  SKIP: 'Skip',
  START: 'Start',
};

/**
 * ConversationV3 types.
 * @readonly
 */
const Type = {
  ANSWER: 'answer',
  COUNT: 'count',
};

/**
 * Enumerators used for answer type.
 * @readonly
 */
const Answer = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  FIRST: 'first',
  SECOND: 'second',
};

/**
 * Interactive Canvas response template slide types.
 * @readonly
 */
const Template = {
  /** Question and answer slide */
  QUESTION: 'template.question',
  /** Intro slide */
  INTRO: 'template.intro',
  /** Outcome slide */
  OUTCOME: 'template.outcome',
  /** Only say the ssml, no displayed slide */
  SAY: 'template.say',
  /** Tell the ssml, and close the session */
  TELL: 'template.tell',
};

/**
 * Interactive Canvas response template render actions.
 * @readonly
 */
const TemplateAction = {
  /** Reset the UI state */
  RESET: 'template.action.reset',
  /** Freeze UI controls */
  FREEZE: 'template.action.freeze',
  /** Set positive choice button to active */
  ACTIVE_0: 'template.action.positive',
  /** Set negative choice button to active */
  ACTIVE_1: 'template.action.negative',
};

/**
 * SSML TTS status marks from Interactive Canvas API.
 * @readonly
 */
const TtsMark = {
  START: 'START',
  END: 'END',
  ERROR: 'ERROR',
  FLIP: 'FLIP',
};

/**
 * Conversation environments
 * @readonly
 */
const ConvEnv = {
  PREVIEW: 'preview',
  PRODUCTION: 'production',
};

/**
 * Spreadsheet tab Types
 * Array: each row is an independent doc
 * Dictionary: rows are grouped together by a key column
 * @readonly
 */
const TabType = {
  ARRAY: 'ARRAY',
  DICTIONARY: 'DICTIONARY',
};

/**
 * Type override mode
 * @readonly
 */
const TypeOverrideMode = {
  TYPE_MERGE: 'TYPE_MERGE',
  TYPE_REPLACE: 'TYPE_REPLACE',
  TYPE_UNSPECIFIED: 'TYPE_UNSPECIFIED',
};

/**
 * Validation schema types
 * @readonly
 */
const SchemaType = {
  CUSTOM: 'CUSTOM',
  BOOLEAN: 'BOOLEAN',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  SSML: 'SSML',
  STRING: 'STRING',
  STRING_LIST: 'STRING_LIST',
  IMAGE: 'IMAGE',
  URL: 'URL',
  GOOGLE_FONT: 'GOOGLE_FONT',
  COLOR_HEX: 'COLOR_HEX',
  DATE: 'DATE',
};

/**
 * Alias keys for Firestore documents. Fulfillment will refer fetched doc by alias keys.
 * @readonly
 */
const Alias = {
  QUIZ_INTRO: {
    DISPLAYED_INTRO: 'text',
    SPOKEN_INTRO: 'speech',
    BACKGROUND_LANDSCAPE_IMAGE: 'backgroundLandscape',
    BACKGROUND_PORTRAIT_IMAGE: 'backgroundPortrait',
  },
  QUIZ_Q_A: {
    PERSONALITY_TRAIT: 'trait',
    DISPLAYED_QUESTION: 'questionText',
    SPOKEN_QUESTION: 'questionSpeech',
    POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS: 'positiveAnswers',
    NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS: 'negativeAnswers',
    POSITIVE_RESPONSE_SPOKEN_FOLLOWUP: 'positiveFollowupSpeech',
    POSITIVE_RESPONSE_DISPLAYED_FOLLOWUP: 'positiveFollowupText',
    NEGATIVE_RESPONSE_SPOKEN_FOLLOWUP: 'negativeFollowupSpeech',
    NEGATIVE_RESPONSE_DISPLAYED_FOLLOWUP: 'negativeFollowupText',
    BACKGROUND_LANDSCAPE_IMAGE: 'backgroundLandscape',
    BACKGROUND_PORTRAIT_IMAGE: 'backgroundPortrait',
    POSITIVE_ANSWER_IMAGE: 'positiveAnswerImage',
    NEGATIVE_ANSWER_IMAGE: 'negativeAnswerImage',
  },
  QUIZ_OUTCOMES: {
    DISPLAYED_OUTCOME: 'text',
    SPOKEN_OUTCOME: 'speech',
    POSITIVE_OUTCOME_TRAITS: 'positiveTraits',
    NEGATIVE_OUTCOME_TRAITS: 'negativeTraits',
    TITLE: 'title',
    HORIZONTAL_IMAGE: 'imageLandscape',
    VERTICAL_IMAGE: 'imagePortrait',
    BACKGROUND_LANDSCAPE_IMAGE: 'backgroundLandscape',
    BACKGROUND_PORTRAIT_IMAGE: 'backgroundPortrait',
  },
  QUIZ_SETTINGS: {
    PLAY_INTRO_CONFIRMATION: 'playIntroConfirmation',
    QUESTIONS_PER_QUIZ: 'questionsPerQuiz',
    INTRO_TITLE: 'introTitle',
    INTRO_SUBTITLE: 'introSubtitle',
    INTRO_TITLE_COLOR: 'introTitleColor',
    INTRO_SUBTITLE_COLOR: 'introSubtitleColor',
    START_BUTTON_TEXT: 'startButtonText',
    RESTART_BUTTON_TEXT: 'restartButtonText',
    TEXT_COLOR: 'textColor',
    FONT: 'font',
    BUTTON_NORMAL_TEXT_COLOR: 'buttonNormalTextColor',
    BUTTON_NORMAL_BACKGROUND_COLOR: 'buttonNormalBackgroundColor',
    BUTTON_SELECTED_TEXT_COLOR: 'buttonSelectedTextColor',
    BUTTON_SELECTED_BACKGROUND_COLOR: 'buttonSelectedBackgroundColor',
    PROGRESS_BAR_BACKGROUND_COLOR: 'progressBarBackgroundColor',
    PROGRESS_BAR_FILL_COLOR: 'progressBarFillColor',
  },
  GENERAL_PROMPTS: {
    DISPLAYED_FLOW: 'text',
    SPOKEN_FLOW: 'speech',
  },
};

/**
 * General prompts choices.
 * @readonly
 */
const Prompt = {
  INTRO_CONFIRMATION: 'INTRO_CONFIRMATION',
  INTRO_CONFIRMATION_POSITIVE: 'INTRO_CONFIRMATION_POSITIVE',
  INTRO_CONFIRMATION_NEGATIVE: 'INTRO_CONFIRMATION_NEGATIVE',
  INTRO_POSITIVE_RESPONSE: 'INTRO_POSITIVE_RESPONSE',
  INTRO_NEGATIVE_RESPONSE: 'INTRO_NEGATIVE_RESPONSE',
  INTRO_NO_MATCH_1: 'INTRO_NO_MATCH_1',
  INTRO_NO_MATCH_2: 'INTRO_NO_MATCH_2',
  INTRO_NO_INPUT_1: 'INTRO_NO_INPUT_1',
  INTRO_NO_INPUT_2: 'INTRO_NO_INPUT_2',
  START_REPEAT: 'START_REPEAT',
  START_HELP: 'START_HELP',
  TRANSITIONS_REGULAR: 'TRANSITIONS_REGULAR',
  TRANSITIONS_FINAL: 'TRANSITIONS_FINAL',
  QUESTION_REPEAT: 'QUESTION_REPEAT',
  ANSWER_HELP: 'ANSWER_HELP',
  ANSWER_NO_MATCH_1: 'ANSWER_NO_MATCH_1',
  ANSWER_NO_MATCH_2: 'ANSWER_NO_MATCH_2',
  ANSWER_MAX_NO_MATCH: 'ANSWER_MAX_NO_MATCH',
  ANSWER_NO_INPUT_1: 'ANSWER_NO_INPUT_1',
  ANSWER_NO_INPUT_2: 'ANSWER_NO_INPUT_2',
  ANSWER_MAX_NO_INPUT: 'ANSWER_MAX_NO_INPUT',
  OUTCOME_INTRO: 'OUTCOME_INTRO',
  END_OF_GAME: 'END_OF_GAME',
  END_OF_GAME_PLAY_AGAIN_YES: 'END_OF_GAME_PLAY_AGAIN_YES',
  END_OF_GAME_PLAY_AGAIN_NO: 'END_OF_GAME_PLAY_AGAIN_NO',
  RESTART_CONFIRMATION: 'RESTART_CONFIRMATION',
  RESTART_YES_RESPONSE: 'RESTART_YES_RESPONSE',
  RESTART_NO_RESPONSE: 'RESTART_NO_RESPONSE',
  SKIP: 'SKIP',
  QUIT_CONFIRMATION: 'QUIT_CONFIRMATION',
  CONTINUE_TO_PLAY: 'CONTINUE_TO_PLAY',
  ACKNOWLEDGE_QUIT: 'ACKNOWLEDGE_QUIT',
  GENERIC_NO_MATCH: 'GENERIC_NO_MATCH',
  GENERIC_MAX_NO_MATCH: 'GENERIC_MAX_NO_MATCH',
  GENERIC_NO_INPUT: 'GENERIC_NO_INPUT',
  GENERIC_MAX_NO_INPUT: 'GENERIC_MAX_NO_INPUT',
  QUESTION_OR: 'QUESTION_OR',
  GENERIC_YES: 'GENERIC_YES',
  GENERIC_NO: 'GENERIC_NO',
  GENERIC_NO_MATCH_NONANSWER: 'GENERIC_NO_MATCH_NONANSWER',
};

module.exports = {
  Action,
  Intent,
  Type,
  Answer,
  Template,
  TemplateAction,
  TtsMark,
  ConvEnv,
  TabType,
  TypeOverrideMode,
  SchemaType,
  Alias,
  Prompt,
};
