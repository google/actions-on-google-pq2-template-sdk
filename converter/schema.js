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

/**
 * @fileoverview Schema constants for Personality Quiz 2 data sheet.
 */

/**
 * Spreadsheet tab Types
 * ARRAY: each row is an independent doc
 * DICTIONARY: rows are grouped together by a key column
 */
const TabType = {
  ARRAY: 'ARRAY',
  DICTIONARY: 'DICTIONARY',
};

/**
 * Converted output type
 */
const OutputType = {
  JSON: 'json',
  YAML: 'yaml',
};

/**
 * Spreadsheet tab definitions
 */
const Tab = {
  QUIZ_INTRO: {
    name: 'quiz_intro',
    displayName: 'Quiz Intro',
    type: TabType.ARRAY,
    outputType: OutputType.JSON,
    excludeRows: [1, 3],
    columns: [
      {
        name: 'displayed_introduction',
        displayName: 'Displayed Introduction',
        isRequired: true,
      },
      {
        name: 'spoken_introduction',
        displayName: 'Spoken Introduction',
      },
      {
        name: 'quiz_intro_background_landscape_image',
        displayName: 'Quiz Intro Background Landscape Image',
      },
      {
        name: 'quiz_intro_background_portrait_image',
        displayName: 'Quiz Intro Background Portrait Image',
      },
    ],
  },
  QUIZ_Q_A: {
    name: 'quiz_q_a',
    displayName: 'Quiz Q&A',
    type: TabType.ARRAY,
    outputType: OutputType.JSON,
    excludeRows: [1, 3],
    columns: [
      {
        name: 'personality_trait',
        displayName: 'Personality Trait',
        isRequired: true,
      },
      {
        name: 'displayed_question',
        displayName: 'Displayed Question',
        isRequired: true,
      },
      {
        name: 'positive_response_answers',
        displayName: 'Positive Response Answers',
        isRequired: true,
        isRepeated: true,
      },
      {
        name: 'negative_response_answers',
        displayName: 'Negative Response Answers',
        isRequired: true,
        isRepeated: true,
      },
      {
        name: 'spoken_question',
        displayName: 'Spoken Question',
      },
      {
        name: 'positive_response_spoken_followup',
        displayName: 'Positive Response Spoken Followup',
      },
      {
        name: 'positive_response_displayed_followup',
        displayName: 'Positive Response Displayed Followup',
      },
      {
        name: 'negative_response_spoken_followup',
        displayName: 'Negative Response Spoken Followup',
      },
      {
        name: 'negative_response_displayed_followup',
        displayName: 'Negative Response Displayed Followup',
      },
      {
        name: 'quiz_question_background_landscape_image',
        displayName: 'Quiz Question Background Landscape Image',
      },
      {
        name: 'quiz_question_background_portrait_image',
        displayName: 'Quiz Question Background Portrait Image',
      },
      {
        name: 'positive_suggested_answer_image',
        displayName: 'Positive Suggested Answer Image',
      },
      {
        name: 'negative_suggested_answer_image',
        displayName: 'Negative Suggested Answer Image',
      },
    ],
  },
  QUIZ_OUTCOMES: {
    name: 'quiz_outcomes',
    displayName: 'Quiz Outcomes',
    type: TabType.ARRAY,
    outputType: OutputType.JSON,
    excludeRows: [1, 3],
    columns: [
      {
        name: 'displayed_quiz_outcome',
        displayName: 'Displayed Quiz Outcome',
        isRequired: true,
      },
      {
        name: 'positive_outcome_matching_traits',
        displayName: 'Positive Outcome Matching Traits',
      },
      {
        name: 'negative_outcome_matching_traits',
        displayName: 'Negative Outcome Matching Traits',
      },
      {
        name: 'spoken_quiz_outcome',
        displayName: 'Spoken Quiz Outcome',
      },
      {
        name: 'horizontal_outcome_image',
        displayName: 'Horizontal Outcome Image',
      },
      {
        name: 'vertical_outcome_image',
        displayName: 'Vertical Outcome Image',
      },
      {
        name: 'outcome_background_landscape_image',
        displayName: 'Outcome Background Landscape Image',
      },
      {
        name: 'outcome_background_portrait_image',
        displayName: 'Outcome Background Portrait Image',
      },
      {
        name: 'outcome_title',
        displayName: 'Outcome Title',
      },
    ],
  },
  QUIZ_SETTINGS: {
    name: 'quiz_settings',
    displayName: 'Quiz Settings',
    type: TabType.DICTIONARY,
    outputType: OutputType.JSON,
    excludeRows: [1, 3],
    columns: [
      {
        name: 'parameter_name',
        displayName: 'Parameter Name',
        isKey: true,
      },
      {
        name: 'value',
        displayName: 'Value',
      },
    ],
    keys: [
      {
        name: 'play_intro_confirmation',
        displayName: 'Play Intro Confirmation',
      },
      {
        name: 'number_of_questions_per_quiz',
        displayName: 'Number of Questions Per Quiz',
      },
      {
        name: 'intro_title',
        displayName: 'Intro Title',
      },
      {
        name: 'intro_subtitle',
        displayName: 'Intro Subtitle',
      },
      {
        name: 'intro_title_text_color',
        displayName: 'Intro Title Text Color',
      },
      {
        name: 'intro_subtitle_text_color',
        displayName: 'Intro Subtitle Text Color',
      },
      {
        name: 'start_button_text',
        displayName: 'Start Button Text',
      },
      {
        name: 'restart_button_text',
        displayName: 'Restart Button Text',
      },
      {
        name: 'text_color',
        displayName: 'Text Color',
      },
      {
        name: 'font',
        displayName: 'Font',
      },
      {
        name: 'button_text_color',
        displayName: 'Button Text Color',
      },
      {
        name: 'button_background_color',
        displayName: 'Button Background Color',
      },
      {
        name: 'selected_button_text_color',
        displayName: 'Selected Button Text Color',
      },
      {
        name: 'selected_button_background_color',
        displayName: 'Selected Button Background Color',
      },
      {
        name: 'progress_bar_background_color',
        displayName: 'Progress Bar Background Color',
      },
      {
        name: 'progress_bar_fill_color',
        displayName: 'Progress Bar Fill Color',
      },
    ],
  },
  GENERAL_PROMPTS: {
    name: 'general_prompts',
    displayName: 'General Prompts',
    type: TabType.DICTIONARY,
    outputType: OutputType.JSON,
    excludeRows: [1, 3],
    columns: [
      {
        name: 'prompt_section',
        displayName: 'Prompt Section',
        isKey: true,
      },
      {
        name: 'displayed_flow',
        displayName: 'Displayed Flow',
      },
      {
        name: 'spoken_flow',
        displayName: 'Spoken Flow',
      },
    ],
    keys: [
      {
        name: 'intro_confirmation_question_variant_1',
        displayName: 'INTRO-CONFIRMATION-QUESTION-VARIANT-1',
      },
      {
        name: 'intro_confirmation_question_variant_2',
        displayName: 'INTRO-CONFIRMATION-QUESTION-VARIANT-2',
      },
      {
        name: 'intro_confirmation_question_variant_3',
        displayName: 'INTRO-CONFIRMATION-QUESTION-VARIANT-3',
      },
      {
        name: 'intro_confirmation_positive',
        displayName: 'INTRO-CONFIRMATION-POSITIVE',
      },
      {
        name: 'intro_confirmation_negative',
        displayName: 'INTRO-CONFIRMATION-NEGATIVE',
      },
      {
        name: 'intro_positive_response_variant_1',
        displayName: 'INTRO-POSITIVE-RESPONSE-VARIANT-1',
      },
      {
        name: 'intro_positive_response_variant_2',
        displayName: 'INTRO-POSITIVE-RESPONSE-VARIANT-2',
      },
      {
        name: 'intro_positive_response_variant_3',
        displayName: 'INTRO-POSITIVE-RESPONSE-VARIANT-3',
      },
      {
        name: 'intro_negative_response_variant_1',
        displayName: 'INTRO-NEGATIVE-RESPONSE-VARIANT-1',
      },
      {
        name: 'intro_negative_response_variant_2',
        displayName: 'INTRO-NEGATIVE-RESPONSE-VARIANT-2',
      },
      {
        name: 'intro_negative_response_variant_3',
        displayName: 'INTRO-NEGATIVE-RESPONSE-VARIANT-3',
      },
      {
        name: 'intro_no_match_first_variant_1',
        displayName: 'INTRO-NO-MATCH-FIRST-VARIANT-1',
      },
      {
        name: 'intro_no_match_first_variant_2',
        displayName: 'INTRO-NO-MATCH-FIRST-VARIANT-2',
      },
      {
        name: 'intro_no_match_first_variant_3',
        displayName: 'INTRO-NO-MATCH-FIRST-VARIANT-3',
      },
      {
        name: 'intro_no_match_second_variant_1',
        displayName: 'INTRO-NO-MATCH-SECOND-VARIANT-1',
      },
      {
        name: 'intro_no_match_second_variant_2',
        displayName: 'INTRO-NO-MATCH-SECOND-VARIANT-2',
      },
      {
        name: 'intro_no_match_second_variant_3',
        displayName: 'INTRO-NO-MATCH-SECOND-VARIANT-3',
      },
      {
        name: 'transitions_regular_variant_1',
        displayName: 'TRANSITIONS-REGULAR-VARIANT-1',
      },
      {
        name: 'transitions_regular_variant_2',
        displayName: 'TRANSITIONS-REGULAR-VARIANT-2',
      },
      {
        name: 'transitions_regular_variant_3',
        displayName: 'TRANSITIONS-REGULAR-VARIANT-3',
      },
      {
        name: 'transitions_final_variant_1',
        displayName: 'TRANSITIONS-FINAL-VARIANT-1',
      },
      {
        name: 'transitions_final_variant_2',
        displayName: 'TRANSITIONS-FINAL-VARIANT-2',
      },
      {
        name: 'transitions_final_variant_3',
        displayName: 'TRANSITIONS-FINAL-VARIANT-3',
      },
      {
        name: 'intro_no_input_first_variant_1',
        displayName: 'INTRO-NO-INPUT-FIRST-VARIANT-1',
      },
      {
        name: 'intro_no_input_first_variant_2',
        displayName: 'INTRO-NO-INPUT-FIRST-VARIANT-2',
      },
      {
        name: 'intro_no_input_first_variant_3',
        displayName: 'INTRO-NO-INPUT-FIRST-VARIANT-3',
      },
      {
        name: 'intro_no_input_second_variant_1',
        displayName: 'INTRO-NO-INPUT-SECOND-VARIANT-1',
      },
      {
        name: 'intro_no_input_second_variant_2',
        displayName: 'INTRO-NO-INPUT-SECOND-VARIANT-2',
      },
      {
        name: 'intro_no_input_second_variant_3',
        displayName: 'INTRO-NO-INPUT-SECOND-VARIANT-3',
      },
      {
        name: 'answer_no_match_first_variant_1',
        displayName: 'ANSWER-NO-MATCH-FIRST-VARIANT-1',
      },
      {
        name: 'answer_no_match_first_variant_2',
        displayName: 'ANSWER-NO-MATCH-FIRST-VARIANT-2',
      },
      {
        name: 'answer_no_match_first_variant_3',
        displayName: 'ANSWER-NO-MATCH-FIRST-VARIANT-3',
      },
      {
        name: 'answer_no_match_second_variant_1',
        displayName: 'ANSWER-NO-MATCH-SECOND-VARIANT-1',
      },
      {
        name: 'answer_no_match_second_variant_2',
        displayName: 'ANSWER-NO-MATCH-SECOND-VARIANT-2',
      },
      {
        name: 'answer_no_match_second_variant_3',
        displayName: 'ANSWER-NO-MATCH-SECOND-VARIANT-3',
      },
      {
        name: 'answer_max_no_match_variant_1',
        displayName: 'ANSWER-MAX-NO-MATCH-VARIANT-1',
      },
      {
        name: 'answer_max_no_match_variant_2',
        displayName: 'ANSWER-MAX-NO-MATCH-VARIANT-2',
      },
      {
        name: 'answer_max_no_match_variant_3',
        displayName: 'ANSWER-MAX-NO-MATCH-VARIANT-3',
      },
      {
        name: 'answer_no_input_first_variant_1',
        displayName: 'ANSWER-NO-INPUT-FIRST-VARIANT-1',
      },
      {
        name: 'answer_no_input_first_variant_2',
        displayName: 'ANSWER-NO-INPUT-FIRST-VARIANT-2',
      },
      {
        name: 'answer_no_input_first_variant_3',
        displayName: 'ANSWER-NO-INPUT-FIRST-VARIANT-3',
      },
      {
        name: 'answer_no_input_second_variant_1',
        displayName: 'ANSWER-NO-INPUT-SECOND-VARIANT-1',
      },
      {
        name: 'answer_no_input_second_variant_2',
        displayName: 'ANSWER-NO-INPUT-SECOND-VARIANT-2',
      },
      {
        name: 'answer_no_input_second_variant_3',
        displayName: 'ANSWER-NO-INPUT-SECOND-VARIANT-3',
      },
      {
        name: 'answer_max_no_input_variant_1',
        displayName: 'ANSWER-MAX-NO-INPUT-VARIANT-1',
      },
      {
        name: 'answer_max_no_input_variant_2',
        displayName: 'ANSWER-MAX-NO-INPUT-VARIANT-2',
      },
      {
        name: 'answer_max_no_input_variant_3',
        displayName: 'ANSWER-MAX-NO-INPUT-VARIANT-3',
      },
      {
        name: 'outcome_intro_variant_1',
        displayName: 'OUTCOME-INTRO-VARIANT-1',
      },
      {
        name: 'outcome_intro_variant_2',
        displayName: 'OUTCOME-INTRO-VARIANT-2',
      },
      {
        name: 'outcome_intro_variant_3',
        displayName: 'OUTCOME-INTRO-VARIANT-3',
      },
      {
        name: 'end_of_game_variant_1',
        displayName: 'END-OF-GAME-VARIANT-1',
      },
      {
        name: 'end_of_game_variant_2',
        displayName: 'END-OF-GAME-VARIANT-2',
      },
      {
        name: 'end_of_game_variant_3',
        displayName: 'END-OF-GAME-VARIANT-3',
      },
      {
        name: 'end_of_game_play_again_yes',
        displayName: 'END-OF-GAME-PLAY-AGAIN-YES',
      },
      {
        name: 'end_of_game_play_again_no',
        displayName: 'END-OF-GAME-PLAY-AGAIN-NO',
      },
      {
        name: 'restart_no_response_variant_1',
        displayName: 'RESTART-NO-RESPONSE-VARIANT-1',
      },
      {
        name: 'restart_no_response_variant_2',
        displayName: 'RESTART-NO-RESPONSE-VARIANT-2',
      },
      {
        name: 'restart_no_response_variant_3',
        displayName: 'RESTART-NO-RESPONSE-VARIANT-3',
      },
      {
        name: 'start_repeat_variant_1',
        displayName: 'START-REPEAT-VARIANT-1',
      },
      {
        name: 'start_repeat_variant_2',
        displayName: 'START-REPEAT-VARIANT-2',
      },
      {
        name: 'start_repeat_variant_3',
        displayName: 'START-REPEAT-VARIANT-3',
      },
      {
        name: 'skip_variant_1',
        displayName: 'SKIP-VARIANT-1',
      },
      {
        name: 'skip_variant_2',
        displayName: 'SKIP-VARIANT-2',
      },
      {
        name: 'skip_variant_3',
        displayName: 'SKIP-VARIANT-3',
      },
      {
        name: 'start_help',
        displayName: 'START-HELP',
      },
      {
        name: 'question_repeat_variant_1',
        displayName: 'QUESTION-REPEAT-VARIANT-1',
      },
      {
        name: 'question_repeat_variant_2',
        displayName: 'QUESTION-REPEAT-VARIANT-2',
      },
      {
        name: 'question_repeat_variant_3',
        displayName: 'QUESTION-REPEAT-VARIANT-3',
      },
      {
        name: 'answer_help',
        displayName: 'ANSWER-HELP',
      },
      {
        name: 'quit_confirmation_variant_1',
        displayName: 'QUIT-CONFIRMATION-VARIANT-1',
      },
      {
        name: 'quit_confirmation_variant_2',
        displayName: 'QUIT-CONFIRMATION-VARIANT-2',
      },
      {
        name: 'quit_confirmation_variant_3',
        displayName: 'QUIT-CONFIRMATION-VARIANT-3',
      },
      {
        name: 'continue_to_play_variant_1',
        displayName: 'CONTINUE-TO-PLAY-VARIANT-1',
      },
      {
        name: 'continue_to_play_variant_2',
        displayName: 'CONTINUE-TO-PLAY-VARIANT-2',
      },
      {
        name: 'continue_to_play_variant_3',
        displayName: 'CONTINUE-TO-PLAY-VARIANT-3',
      },
      {
        name: 'acknowledge_quit_variant_1',
        displayName: 'ACKNOWLEDGE-QUIT-VARIANT-1',
      },
      {
        name: 'acknowledge_quit_variant_2',
        displayName: 'ACKNOWLEDGE-QUIT-VARIANT-2',
      },
      {
        name: 'acknowledge_quit_variant_3',
        displayName: 'ACKNOWLEDGE-QUIT-VARIANT-3',
      },
      {
        name: 'restart_confirmation_variant_1',
        displayName: 'RESTART-CONFIRMATION-VARIANT-1',
      },
      {
        name: 'restart_confirmation_variant_2',
        displayName: 'RESTART-CONFIRMATION-VARIANT-2',
      },
      {
        name: 'restart_confirmation_variant_3',
        displayName: 'RESTART-CONFIRMATION-VARIANT-3',
      },
      {
        name: 'restart_yes_response_variant_1',
        displayName: 'RESTART-YES-RESPONSE-VARIANT-1',
      },
      {
        name: 'restart_yes_response_variant_2',
        displayName: 'RESTART-YES-RESPONSE-VARIANT-2',
      },
      {
        name: 'restart_yes_response_variant_3',
        displayName: 'RESTART-YES-RESPONSE-VARIANT-3',
      },
      {
        name: 'generic_no_match_variant_1',
        displayName: 'GENERIC-NO-MATCH-VARIANT-1',
      },
      {
        name: 'generic_no_match_variant_2',
        displayName: 'GENERIC-NO-MATCH-VARIANT-2',
      },
      {
        name: 'generic_no_match_variant_3',
        displayName: 'GENERIC-NO-MATCH-VARIANT-3',
      },
      {
        name: 'generic_max_no_match_variant_1',
        displayName: 'GENERIC-MAX-NO-MATCH-VARIANT-1',
      },
      {
        name: 'generic_max_no_match_variant_2',
        displayName: 'GENERIC-MAX-NO-MATCH-VARIANT-2',
      },
      {
        name: 'generic_max_no_match_variant_3',
        displayName: 'GENERIC-MAX-NO-MATCH-VARIANT-3',
      },
      {
        name: 'generic_no_input_variant_1',
        displayName: 'GENERIC-NO-INPUT-VARIANT-1',
      },
      {
        name: 'generic_no_input_variant_2',
        displayName: 'GENERIC-NO-INPUT-VARIANT-2',
      },
      {
        name: 'generic_no_input_variant_3',
        displayName: 'GENERIC-NO-INPUT-VARIANT-3',
      },
      {
        name: 'generic_max_no_input_variant_1',
        displayName: 'GENERIC-MAX-NO-INPUT-VARIANT-1',
      },
      {
        name: 'generic_max_no_input_variant_2',
        displayName: 'GENERIC-MAX-NO-INPUT-VARIANT-2',
      },
      {
        name: 'generic_max_no_input_variant_3',
        displayName: 'GENERIC-MAX-NO-INPUT-VARIANT-3',
      },
      {
        name: 'question_or',
        displayName: 'QUESTION-OR',
      },
      {
        name: 'generic_yes',
        displayName: 'GENERIC-YES',
      },
      {
        name: 'generic_no',
        displayName: 'GENERIC-NO',
      },
      {
        name: 'generic_no_match_nonanswer_variant_1',
        displayName: 'GENERIC-NO-MATCH-NONANSWER-VARIANT-1',
      },
      {
        name: 'generic_no_match_nonanswer_variant_2',
        displayName: 'GENERIC-NO-MATCH-NONANSWER-VARIANT-2',
      },
      {
        name: 'generic_no_match_nonanswer_variant_3',
        displayName: 'GENERIC-NO-MATCH-NONANSWER-VARIANT-3',
      },
    ],
  },
};

module.exports = {
  TabType,
  OutputType,
  Tab,
};
