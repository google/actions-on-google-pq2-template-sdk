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
const config = require('./config.js');
const {Answer, Alias} = require('./constant.js');

/**
 * @module quiz
 * @desc Quiz setup and outcome scoring logics
 */

/**
 * Initializes quiz game state for new session.
 * @param {Array<Question>} questions - Quiz questions.
 * @param {number} questionsPerQuiz - Number of questions per quiz from Quiz Settings.
 * @return {QuizSessionState} - Initialized quiz session state.
 * @static
 */
const initSessionState = (questions, questionsPerQuiz) => {
  const traitKey = Alias.QUIZ_Q_A.PERSONALITY_TRAIT;
  questions.forEach((question) => (question[traitKey] = question[traitKey].toLowerCase()));
  const numberOfQuestions = Math.min(
    questionsPerQuiz,
    questions.length,
    config.MAX_QUESTIONS_PER_QUIZ
  );
  return {
    count: 0,
    limit: numberOfQuestions,
    questions: shuffleByTraits(questions).slice(0, numberOfQuestions),
    traitToWeight: Object.assign(...getUniqueTraits(questions).map((trait) => ({[trait]: 0}))),
  };
};

/**
 * Get all unique traits from a pool of quiz questions.
 * @param {Array<Question>} questions - Quiz questions.
 * @return {Array<string>} - Unique traits in questions.
 * @static
 */
const getUniqueTraits = (questions) => {
  const traitKey = Alias.QUIZ_Q_A.PERSONALITY_TRAIT;
  return [...new Set(questions.map((question) => question[traitKey].toLowerCase()))];
};

/**
 * Shuffle questions grouped by unique sets of traits. This ensures questions with unique traits
 * are asked first before cycling to next set of questions with remaining unique traits.
 * For example, for a question pool with 3xA, 3xB, 2xC, 1xD traits => [A, A, A, B, B, B, C, C, D]
 * The shuffling logic will ensure the first group to be randomly ordered [ABCD] questions, followed
 * by a second group of randomly ordered [ABC] unused questions, followed by a final group of
 * randomly ordered [AB] unused questions.
 * @param {Array<Question>} questions - Quiz questions.
 * @return {Array<Question>} - Shuffled questions
 * @static
 */
const shuffleByTraits = (questions) => {
  const traitToQuestions = new Map();
  questions.forEach((question) => {
    const trait = question[Alias.QUIZ_Q_A.PERSONALITY_TRAIT].toLowerCase();
    if (!traitToQuestions.has(trait)) {
      traitToQuestions.set(trait, []);
    }
    traitToQuestions.get(trait).push(question);
  });

  const shuffledQuestions = [];
  while (traitToQuestions.size > 0 && shuffledQuestions.length < questions.length) {
    const randomUniqueTraits = util.array.shuffle([...traitToQuestions.keys()]);
    randomUniqueTraits.forEach((trait) => {
      shuffledQuestions.push(util.array.randomPop(traitToQuestions.get(trait)));
      if (traitToQuestions.get(trait).length === 0) {
        traitToQuestions.delete(trait);
      }
    });
  }
  return shuffledQuestions;
};

/**
 * Matches user response with positive or negative answers.
 * A positive answer will grant +1 to question trait, and a negative answer will grant -1.
 * @param {Question} question - Quiz question.
 * @param {string} [answer=''] - The raw answer a user has entered.
 * @return {[string, number]} - [trait, weight]
 * @static
 */
const matchAnswer = (question, answer = '') => {
  const clean = (ans) => util.string.stripEmoji(ans.toLowerCase().replace(/\s/g, ''));
  const trait = question[Alias.QUIZ_Q_A.PERSONALITY_TRAIT].toLowerCase();
  answer = clean(answer);
  const positiveAnswers = question[Alias.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS].map(clean);
  const negativeAnswers = question[Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS].map(clean);
  if (answer === Answer.POSITIVE || positiveAnswers.includes(answer)) {
    return [trait, 1];
  }
  if (answer === Answer.NEGATIVE || negativeAnswers.includes(answer)) {
    return [trait, -1];
  }
  return [null, null];
};

/**
 * Matches an outcome with highest overall weight score, calculated by its associated positive and
 * negative traits with weight scores accumulated from user choices to session questions.
 * If there is a tie in highest overall weight, then we pick a random outcome with highest weight.
 * @param {Array<QuizOutcome>} outcomes - Quiz outcomes.
 * @param {Object<string, number>} traitToWeight - Trait to weight.
 * @return {QuizOutcome} - Matched outcome with highest weight score.
 * @static
 */
const matchOutcome = (outcomes, traitToWeight) => {
  const parseTraits = (val) =>
    typeof val === 'string' ? val.split('&').map((trait) => trait.trim().toLowerCase()) : [];

  outcomes.forEach((outcome) => {
    outcome._positive = new Set(parseTraits(outcome[Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]));
    outcome._negative = new Set(parseTraits(outcome[Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]));
    outcome._score = 0;
  });
  Object.entries(traitToWeight).forEach(([trait, weight]) => {
    trait = trait.toLowerCase();
    outcomes.forEach((outcome) => {
      if (outcome._positive.has(trait)) {
        outcome._score += weight;
      }
      if (outcome._negative.has(trait)) {
        outcome._score -= weight;
      }
    });
  });
  const maxScore = Math.max(...outcomes.map((outcome) => outcome._score));
  return util.array.randomPick(outcomes.filter((outcome) => outcome._score === maxScore));
};

module.exports = {
  initSessionState,
  getUniqueTraits,
  shuffleByTraits,
  matchAnswer,
  matchOutcome,
};
