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

const util = require('./util');
const {Alias, Prompt, TabType, SchemaType} = require('./constant.js');
const config = require('./config.js');

/**
 * Collection names.
 * @readonly
 */
const Collection = {
  QUIZ_INTRO: 'quiz_intro',
  QUIZ_Q_A: 'quiz_q_a',
  QUIZ_OUTCOMES: 'quiz_outcomes',
  QUIZ_SETTINGS: 'quiz_settings',
  GENERAL_PROMPTS: 'general_prompts',
};

/**
 * Document keys.
 * @readonly
 */
const Key = {
  QUIZ_INTRO: {
    DISPLAYED_INTRO: 'displayed_introduction',
    SPOKEN_INTRO: 'spoken_introduction',
    BACKGROUND_LANDSCAPE_IMAGE: 'quiz_intro_background_landscape_image',
    BACKGROUND_PORTRAIT_IMAGE: 'quiz_intro_background_portrait_image',
  },
  QUIZ_Q_A: {
    PERSONALITY_TRAIT: 'personality_trait',
    DISPLAYED_QUESTION: 'displayed_question',
    SPOKEN_QUESTION: 'spoken_question',
    POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS: 'positive_response_answers',
    NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS: 'negative_response_answers',
    POSITIVE_RESPONSE_SPOKEN_FOLLOWUP: 'positive_response_spoken_followup',
    POSITIVE_RESPONSE_DISPLAYED_FOLLOWUP: 'positive_response_displayed_followup',
    NEGATIVE_RESPONSE_SPOKEN_FOLLOWUP: 'negative_response_spoken_followup',
    NEGATIVE_RESPONSE_DISPLAYED_FOLLOWUP: 'negative_response_displayed_followup',
    BACKGROUND_LANDSCAPE_IMAGE: 'quiz_question_background_landscape_image',
    BACKGROUND_PORTRAIT_IMAGE: 'quiz_question_background_portrait_image',
    POSITIVE_ANSWER_IMAGE: 'positive_suggested_answer_image',
    NEGATIVE_ANSWER_IMAGE: 'negative_suggested_answer_image',
  },
  QUIZ_OUTCOMES: {
    DISPLAYED_OUTCOME: 'displayed_quiz_outcome',
    SPOKEN_OUTCOME: 'spoken_quiz_outcome',
    POSITIVE_OUTCOME_TRAITS: 'positive_outcome_matching_traits',
    NEGATIVE_OUTCOME_TRAITS: 'negative_outcome_matching_traits',
    TITLE: 'outcome_title',
    HORIZONTAL_IMAGE: 'horizontal_outcome_image',
    VERTICAL_IMAGE: 'vertical_outcome_image',
    BACKGROUND_LANDSCAPE_IMAGE: 'outcome_background_landscape_image',
    BACKGROUND_PORTRAIT_IMAGE: 'outcome_background_portrait_image',
  },
  QUIZ_SETTINGS: {
    PLAY_INTRO_CONFIRMATION: 'play_intro_confirmation',
    QUESTIONS_PER_QUIZ: 'number_of_questions_per_quiz',
    INTRO_TITLE: 'intro_title',
    INTRO_SUBTITLE: 'intro_subtitle',
    INTRO_TITLE_COLOR: 'intro_title_text_color',
    INTRO_SUBTITLE_COLOR: 'intro_subtitle_text_color',
    START_BUTTON_TEXT: 'start_button_text',
    RESTART_BUTTON_TEXT: 'restart_button_text',
    TEXT_COLOR: 'text_color',
    FONT: 'font',
    BUTTON_NORMAL_TEXT_COLOR: 'button_text_color',
    BUTTON_NORMAL_BACKGROUND_COLOR: 'button_background_color',
    BUTTON_SELECTED_TEXT_COLOR: 'selected_button_text_color',
    BUTTON_SELECTED_BACKGROUND_COLOR: 'selected_button_background_color',
    PROGRESS_BAR_BACKGROUND_COLOR: 'progress_bar_background_color',
    PROGRESS_BAR_FILL_COLOR: 'progress_bar_fill_color',
  },
  GENERAL_PROMPTS: {
    DISPLAYED_FLOW: 'displayed_flow',
    SPOKEN_FLOW: 'spoken_flow',
  },
};

/**
 * Field schema for transformation and validation of raw docs.
 * @readonly
 */
const Schema = {
  QUIZ_INTRO: {
    [Key.QUIZ_INTRO.DISPLAYED_INTRO]: {
      alias: Alias.QUIZ_INTRO.DISPLAYED_INTRO,
      type: SchemaType.STRING,
    },
    [Key.QUIZ_INTRO.SPOKEN_INTRO]: {
      alias: Alias.QUIZ_INTRO.SPOKEN_INTRO,
      type: SchemaType.SSML,
      optional: true,
    },
    [Key.QUIZ_INTRO.BACKGROUND_LANDSCAPE_IMAGE]: {
      alias: Alias.QUIZ_INTRO.BACKGROUND_LANDSCAPE_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_INTRO.BACKGROUND_PORTRAIT_IMAGE]: {
      alias: Alias.QUIZ_INTRO.BACKGROUND_PORTRAIT_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
  },

  QUIZ_Q_A: {
    [Key.QUIZ_Q_A.PERSONALITY_TRAIT]: {
      alias: Alias.QUIZ_Q_A.PERSONALITY_TRAIT,
      type: SchemaType.STRING,
    },
    [Key.QUIZ_Q_A.DISPLAYED_QUESTION]: {
      alias: Alias.QUIZ_Q_A.DISPLAYED_QUESTION,
      type: SchemaType.STRING,
    },
    [Key.QUIZ_Q_A.SPOKEN_QUESTION]: {
      alias: Alias.QUIZ_Q_A.SPOKEN_QUESTION,
      type: SchemaType.SSML,
      optional: true,
    },
    [Key.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS]: {
      alias: Alias.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS,
      type: SchemaType.STRING_LIST,
    },
    [Key.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS]: {
      alias: Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS,
      type: SchemaType.STRING_LIST,
    },
    [Key.QUIZ_Q_A.POSITIVE_RESPONSE_SPOKEN_FOLLOWUP]: {
      alias: Alias.QUIZ_Q_A.POSITIVE_RESPONSE_SPOKEN_FOLLOWUP,
      type: SchemaType.SSML,
      optional: true,
    },
    [Key.QUIZ_Q_A.POSITIVE_RESPONSE_DISPLAYED_FOLLOWUP]: {
      alias: Alias.QUIZ_Q_A.POSITIVE_RESPONSE_DISPLAYED_FOLLOWUP,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_Q_A.NEGATIVE_RESPONSE_SPOKEN_FOLLOWUP]: {
      alias: Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_SPOKEN_FOLLOWUP,
      type: SchemaType.SSML,
      optional: true,
    },
    [Key.QUIZ_Q_A.NEGATIVE_RESPONSE_DISPLAYED_FOLLOWUP]: {
      alias: Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_DISPLAYED_FOLLOWUP,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_Q_A.BACKGROUND_LANDSCAPE_IMAGE]: {
      alias: Alias.QUIZ_Q_A.BACKGROUND_LANDSCAPE_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_Q_A.BACKGROUND_PORTRAIT_IMAGE]: {
      alias: Alias.QUIZ_Q_A.BACKGROUND_PORTRAIT_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_Q_A.POSITIVE_ANSWER_IMAGE]: {
      alias: Alias.QUIZ_Q_A.POSITIVE_ANSWER_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_Q_A.NEGATIVE_ANSWER_IMAGE]: {
      alias: Alias.QUIZ_Q_A.NEGATIVE_ANSWER_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
  },

  QUIZ_OUTCOMES: {
    [Key.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: {
      alias: Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME,
      type: SchemaType.STRING,
    },
    [Key.QUIZ_OUTCOMES.SPOKEN_OUTCOME]: {
      alias: Alias.QUIZ_OUTCOMES.SPOKEN_OUTCOME,
      type: SchemaType.SSML,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: {
      alias: Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: {
      alias: Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.TITLE]: {
      alias: Alias.QUIZ_OUTCOMES.TITLE,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.HORIZONTAL_IMAGE]: {
      alias: Alias.QUIZ_OUTCOMES.HORIZONTAL_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.VERTICAL_IMAGE]: {
      alias: Alias.QUIZ_OUTCOMES.VERTICAL_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.BACKGROUND_LANDSCAPE_IMAGE]: {
      alias: Alias.QUIZ_OUTCOMES.BACKGROUND_LANDSCAPE_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
    [Key.QUIZ_OUTCOMES.BACKGROUND_PORTRAIT_IMAGE]: {
      alias: Alias.QUIZ_OUTCOMES.BACKGROUND_PORTRAIT_IMAGE,
      type: SchemaType.IMAGE,
      optional: true,
    },
  },

  QUIZ_SETTINGS: {
    [Key.QUIZ_SETTINGS.PLAY_INTRO_CONFIRMATION]: {
      alias: Alias.QUIZ_SETTINGS.PLAY_INTRO_CONFIRMATION,
      type: SchemaType.BOOLEAN,
      default: config.PLAY_INTRO_CONFIRMATION_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ]: {
      alias: Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ,
      type: SchemaType.INTEGER,
      default: config.QUESTIONS_PER_QUIZ_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.INTRO_TITLE]: {
      alias: Alias.QUIZ_SETTINGS.INTRO_TITLE,
      type: SchemaType.STRING,
      default: config.INTRO_TITLE_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.INTRO_SUBTITLE]: {
      alias: Alias.QUIZ_SETTINGS.INTRO_SUBTITLE,
      type: SchemaType.STRING,
      default: config.INTRO_SUBTITLE_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.INTRO_TITLE_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.INTRO_TITLE_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.INTRO_TITLE_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.INTRO_SUBTITLE_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.INTRO_SUBTITLE_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.INTRO_SUBTITLE_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.START_BUTTON_TEXT]: {
      alias: Alias.QUIZ_SETTINGS.START_BUTTON_TEXT,
      type: SchemaType.STRING,
      default: config.START_BUTTON_TEXT_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.RESTART_BUTTON_TEXT]: {
      alias: Alias.QUIZ_SETTINGS.RESTART_BUTTON_TEXT,
      type: SchemaType.STRING,
      default: config.RESTART_BUTTON_TEXT_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.TEXT_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.TEXT_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.TEXT_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.FONT]: {
      alias: Alias.QUIZ_SETTINGS.FONT,
      type: SchemaType.GOOGLE_FONT,
      default: config.FONT_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.BUTTON_NORMAL_TEXT_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.BUTTON_NORMAL_TEXT_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.BUTTON_NORMAL_TEXT_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.BUTTON_NORMAL_BACKGROUND_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.BUTTON_NORMAL_BACKGROUND_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.BUTTON_NORMAL_BACKGROUND_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.BUTTON_SELECTED_TEXT_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.BUTTON_SELECTED_TEXT_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.BUTTON_SELECTED_TEXT_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.BUTTON_SELECTED_BACKGROUND_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.BUTTON_SELECTED_BACKGROUND_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.BUTTON_SELECTED_BACKGROUND_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.PROGRESS_BAR_BACKGROUND_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.PROGRESS_BAR_BACKGROUND_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.PROGRESS_BAR_BACKGROUND_COLOR_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.PROGRESS_BAR_FILL_COLOR]: {
      alias: Alias.QUIZ_SETTINGS.PROGRESS_BAR_FILL_COLOR,
      type: SchemaType.COLOR_HEX,
      default: config.PROGRESS_BAR_FILL_COLOR_DEFAULT,
    },
  },

  GENERAL_PROMPTS: {
    [Key.GENERAL_PROMPTS.DISPLAYED_FLOW]: {
      type: SchemaType.STRING,
    },
    [Key.GENERAL_PROMPTS.SPOKEN_FLOW]: {
      type: SchemaType.SSML,
      optional: true,
    },
  },
};

/**
 * Prompt variant configuration in structured-type schema.
 * Prompts with multiple entries have separate keys, we will append variant suffixes during
 * database fetch.
 * @readonly
 */
const PromptVariant = {
  [Prompt.INTRO_CONFIRMATION]: {
    key: 'intro_confirmation_question',
    variant: 3,
  },
  [Prompt.INTRO_CONFIRMATION_POSITIVE]: {
    key: 'intro_confirmation_positive',
    variant: 0,
  },
  [Prompt.INTRO_CONFIRMATION_NEGATIVE]: {
    key: 'intro_confirmation_negative',
    variant: 0,
  },
  [Prompt.INTRO_POSITIVE_RESPONSE]: {
    key: 'intro_positive_response',
    variant: 3,
  },
  [Prompt.INTRO_NEGATIVE_RESPONSE]: {
    key: 'intro_negative_response',
    variant: 3,
  },
  [Prompt.INTRO_NO_MATCH_1]: {
    key: 'intro_no_match_first',
    variant: 3,
  },
  [Prompt.INTRO_NO_MATCH_2]: {
    key: 'intro_no_match_second',
    variant: 3,
  },
  [Prompt.INTRO_NO_INPUT_1]: {
    key: 'intro_no_input_first',
    variant: 3,
  },
  [Prompt.INTRO_NO_INPUT_2]: {
    key: 'intro_no_input_second',
    variant: 3,
  },
  [Prompt.START_REPEAT]: {
    key: 'start_repeat',
    variant: 3,
  },
  [Prompt.START_HELP]: {
    key: 'start_help',
    variant: 0,
  },
  [Prompt.TRANSITIONS_REGULAR]: {
    key: 'transitions_regular',
    variant: 3,
  },
  [Prompt.TRANSITIONS_FINAL]: {
    key: 'transitions_final',
    variant: 3,
  },
  [Prompt.QUESTION_REPEAT]: {
    key: 'question_repeat',
    variant: 3,
  },
  [Prompt.ANSWER_HELP]: {
    key: 'answer_help',
    variant: 0,
  },
  [Prompt.ANSWER_NO_MATCH_1]: {
    key: 'answer_no_match_first',
    variant: 3,
  },
  [Prompt.ANSWER_NO_MATCH_2]: {
    key: 'answer_no_match_second',
    variant: 3,
  },
  [Prompt.ANSWER_MAX_NO_MATCH]: {
    key: 'answer_max_no_match',
    variant: 3,
  },
  [Prompt.ANSWER_NO_INPUT_1]: {
    key: 'answer_no_input_first',
    variant: 3,
  },
  [Prompt.ANSWER_NO_INPUT_2]: {
    key: 'answer_no_input_second',
    variant: 3,
  },
  [Prompt.ANSWER_MAX_NO_INPUT]: {
    key: 'answer_max_no_input',
    variant: 3,
  },
  [Prompt.OUTCOME_INTRO]: {
    key: 'outcome_intro',
    variant: 3,
  },
  [Prompt.END_OF_GAME]: {
    key: 'end_of_game',
    variant: 3,
  },
  [Prompt.END_OF_GAME_PLAY_AGAIN_YES]: {
    key: 'end_of_game_play_again_yes',
    variant: 0,
  },
  [Prompt.END_OF_GAME_PLAY_AGAIN_NO]: {
    key: 'end_of_game_play_again_no',
    variant: 0,
  },
  [Prompt.RESTART_CONFIRMATION]: {
    key: 'restart_confirmation',
    variant: 3,
  },
  [Prompt.RESTART_YES_RESPONSE]: {
    key: 'restart_yes_response',
    variant: 3,
  },
  [Prompt.RESTART_NO_RESPONSE]: {
    key: 'restart_no_response',
    variant: 3,
  },
  [Prompt.SKIP]: {
    key: 'skip',
    variant: 3,
  },
  [Prompt.QUIT_CONFIRMATION]: {
    key: 'quit_confirmation',
    variant: 3,
  },
  [Prompt.CONTINUE_TO_PLAY]: {
    key: 'continue_to_play',
    variant: 3,
  },
  [Prompt.ACKNOWLEDGE_QUIT]: {
    key: 'acknowledge_quit',
    variant: 3,
  },
  [Prompt.GENERIC_NO_MATCH]: {
    key: 'generic_no_match',
    variant: 3,
  },
  [Prompt.GENERIC_MAX_NO_MATCH]: {
    key: 'generic_max_no_match',
    variant: 3,
  },
  [Prompt.GENERIC_NO_INPUT]: {
    key: 'generic_no_input',
    variant: 3,
  },
  [Prompt.GENERIC_MAX_NO_INPUT]: {
    key: 'generic_max_no_input',
    variant: 3,
  },
  [Prompt.QUESTION_OR]: {
    key: 'question_or',
    variant: 0,
  },
  [Prompt.GENERIC_YES]: {
    key: 'generic_yes',
    variant: 0,
  },
  [Prompt.GENERIC_NO]: {
    key: 'generic_no',
    variant: 0,
  },
  [Prompt.GENERIC_NO_MATCH_NONANSWER]: {
    key: 'generic_no_match_nonanswer',
    variant: 3,
  },
};

/**
 * Configuration and aliases for each sheet tab.
 * @readonly
 */
const Tab = {
  QUIZ_INTRO: {
    type: TabType.ARRAY,
    key: Key.QUIZ_INTRO,
    schema: Schema.QUIZ_INTRO,
  },
  QUIZ_Q_A: {
    type: TabType.ARRAY,
    key: Key.QUIZ_Q_A,
    schema: Schema.QUIZ_Q_A,
  },
  QUIZ_OUTCOMES: {
    type: TabType.ARRAY,
    key: Key.QUIZ_OUTCOMES,
    schema: Schema.QUIZ_OUTCOMES,
  },
  QUIZ_SETTINGS: {
    type: TabType.DICTIONARY,
    key: Key.QUIZ_SETTINGS,
    valueKey: 'value',
    schema: Schema.QUIZ_SETTINGS,
    default: util.object.mapValues(Schema.QUIZ_SETTINGS, (val) => val.default),
  },
  GENERAL_PROMPTS: {
    type: TabType.DICTIONARY,
    key: Key.GENERAL_PROMPTS,
    schema: Schema.GENERAL_PROMPTS,
    config: PromptVariant,
    structuredType: true,
    variantSuffix: '_variant_',
  },
};

module.exports = {
  Collection,
  Key,
  Schema,
  PromptVariant,
  Tab,
};
