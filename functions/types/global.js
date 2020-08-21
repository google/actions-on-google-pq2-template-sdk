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
 * Format arguments as replacement strings for prompts.
 * @typedef {Object} FormatArgs
 * @property {Array<string|Object>} textArgs - Replacement args for text property.
 * @property {Array<string|Object>} speechArgs - Replacement args for speech property.
 */

/**
 * @typedef {Object} ValidatorSchema
 * @property {string} type - One of supported SchemaType.
 * @property {Function} process - Preprocessor function before apply Joi validation.
 * @property {Joi} validate - Joi schema validation object.
 * @property {*} [default] - Default value to use if validation failed.
 * @property {Boolean} [optional] - True to not validate if value is an empty string.
 * @property {string} [alias] - Alias key to replace the original field key.
 */

/**
 * @typedef {Object} RichBasicCard
 * @property {string} display - Image display options, one of DEFAULT, WHITE, CROPPED.
 * @property {string} [text] - Body text.
 * @property {string} [title] - Title text.
 * @property {Image} [image] - Card image.
 */

/**
 * @typedef {Object} TransitionResponse
 * @property {string} simple - Voice only simple response.
 * @property {Array<Object>} rich - Chat UI rich responses.
 * @property {!ImmersiveResponse} immersive - Immersive canvas response.
 */

/**
 * @typedef {Object} QuizSessionState
 * @property {number} count - Index position of current question.
 * @property {number} limit - Number of questions per session.
 * @property {!Object<string, number>} traitToWeight - Trait to weight/score.
 * @property {Array<Question>} questions - Shuffled questions for new session.
 */

/**
 * @typedef {Object} QuizSettings
 * @property {boolean} playIntroConfirmation - True to ask intro confirmation before quiz starts.
 * @property {number} questionsPerQuiz - Number of questions per quiz.
 * @property {string} introTitle - Intro title text.
 * @property {string} introSubtitle - Intro subtitle text.
 * @property {string} introTitleColor - Intro title text color in HEX.
 * @property {string} introSubtitleColor - Intro subtitle text color in HEX.
 * @property {string} startButtonText - Intro slide start button display text.
 * @property {string} restartButtonText - Outcome slide restart button display text.
 * @property {string} textColor - Main body text color in HEX.
 * @property {string} font - Google hosted font in full URL.
 * @property {string} buttonNormalTextColor - Button normal text color in HEX.
 * @property {string} buttonNormalBackgroundColor - Button normal background color in HEX.
 * @property {string} buttonSelectedTextColor - Button selected text color in HEX.
 * @property {string} buttonSelectedBackgroundColor - Button selected background color in HEX.
 * @property {string} progressBarBackgroundColor - Progress bar background color in HEX.
 * @property {string} progressBarFillColor - Progress bar filled color in HEX.
 */

/**
 * @typedef {Object} QuizIntro
 * @property {string} text - Intro displayed text.
 * @property {string} [speech] - Intro spoken ssml text.
 * @property {string} [backgroundLandscape] - Intro landscape background image URL.
 * @property {string} [backgroundPortrait] - Intro portrait background image URL.
 */

/**
 * @typedef {Object} Question
 * @property {string} trait - Matching trait for the question.
 * @property {string} questionText - Question displayed text.
 * @property {string} [questionSpeech] - Question spoken ssml text.
 * @property {Array<string>} positiveAnswers - Positive acceptable answers.
 * @property {Array<string>} negativeAnswers - Negative acceptable answers.
 * @property {string} [positiveFollowupSpeech] - Positive followup spoken ssml text.
 * @property {string} [positiveFollowupText] - Positive followup displayed text.
 * @property {string} [negativeFollowupSpeech] - Negative followup spoken ssml text.
 * @property {string} [negativeFollowupText] - Negative followup displayed text.
 * @property {string} [backgroundLandscape] - Landscape background image URL.
 * @property {string} [backgroundPortrait] - Portrait background image URL.
 * @property {string} [positiveAnswerImage] - Positive answer suggestion image URL.
 * @property {string} [negativeAnswerImage] - Negative answer suggestion image URL.
 */

/**
 * @typedef {Object} QuizOutcome
 * @property {string} text - Outcome displayed text.
 * @property {string} [speech] - Outcome spoken ssml text.
 * @property {string} [positiveTraits] - Positive traits split by & symbol.
 * @property {string} [negativeTraits] - Negative traits split by & symbol.
 * @property {string} [title] - Outcome title.
 * @property {string} [imageLandscape] - Landscape outcome image URL.
 * @property {string} [imagePortrait] - Portrait outcome image URL.
 * @property {string} [backgroundLandscape] - Landscape outcome background imag URL.
 * @property {string} [backgroundPortrait] - Portrait outcome background imag URL.
 */

