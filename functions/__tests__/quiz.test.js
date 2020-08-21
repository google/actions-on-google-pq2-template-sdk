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

const Quiz = require('../quiz.js');
const config = require('../config.js');
const {Alias, Answer} = require('../constant.js');

describe('Quiz', function() {
  const positiveAnswers = ['p1', 'p2', 'p3'];
  const negativeAnswers = ['n1', 'n2', 'n3'];
  const createQuestions = (traitGroups) => {
    const questions = [];
    traitGroups.forEach(([trait, count]) => {
      for (let i = 0; i < count; ++i) {
        questions.push({
          [Alias.QUIZ_Q_A.PERSONALITY_TRAIT]: trait,
          [Alias.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS]: positiveAnswers,
          [Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS]: negativeAnswers,
        });
      }
    });
    return questions;
  };
  const createOutcomes = (traits) => {
    const outcomes = [];
    const count = 1 << traits.length; // 2^n power set
    for (let i = 0; i < count; ++i) {
      const positive = [];
      const negatives = [];
      for (let j = 0; j < traits.length; j++) {
        if (i & (1 << j)) {
          // bitwise translation to element position
          positive.push(traits[j]);
        } else {
          negatives.push(traits[j]);
        }
      }
      const displayedKey = traits
        .map((trait) => (negatives.includes(trait) ? '!' : '') + trait)
        .join(',');
      outcomes.push({
        [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: displayedKey,
        [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: positive.join(' & '),
        [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: negatives.join(' & '),
      });
    }
    return outcomes;
  };

  describe('initSessionState', function() {
    it('returns a QuizSessionState object', function() {
      const questions = createQuestions([['A', 4]]);
      const output = Quiz.initSessionState(questions, 3);
      expect(output.count).to.be.a('number');
      expect(output.limit).to.be.a('number');
      expect(output.questions).to.be.an('array');
      expect(output.traitToWeight).to.be.an('object');
    });

    it('converts trait prop of questions to lowercase', function() {
      const questions = createQuestions([['A', 4]]);
      const output = Quiz.initSessionState(questions, 4);
      output.questions.forEach((question) => {
        expect(question[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]).to.equal('a');
      });
    });

    it('has prop count initialized to 0', function() {
      const questions = createQuestions([['A', 4]]);
      const output = Quiz.initSessionState(questions, 3);
      expect(output.count).to.equal(0);
    });

    it('has prop limit set by questionsPerQuiz input', function() {
      const questions = createQuestions([['A', 10], ['B', 10], ['C', 10], ['D', 10]]);
      const output = Quiz.initSessionState(questions, 3);
      expect(output.limit).to.equal(3);
    });

    it('has prop limit not exceeding total questions size', function() {
      const questions = createQuestions([['A', 1], ['B', 1]]);
      const output = Quiz.initSessionState(questions, 3);
      expect(output.limit).to.equal(2);
    });

    it('has prop limit not exceeding config.MAX_QUESTIONS_PER_QUIZ', function() {
      const questions = createQuestions([['A', 10], ['B', 10], ['C', 10], ['D', 10]]);
      const output = Quiz.initSessionState(questions, 20);
      expect(output.limit).to.equal(config.MAX_QUESTIONS_PER_QUIZ);
    });

    it('has prop questions size set by questionsPerQuiz input', function() {
      const questions = createQuestions([['A', 10], ['B', 10], ['C', 10], ['D', 10]]);
      const output = Quiz.initSessionState(questions, 3);
      expect(output.questions).to.have.lengthOf(3);
    });

    it('has prop questions size not exceeding total questions size', function() {
      const questions = createQuestions([['A', 1], ['B', 1]]);
      const output = Quiz.initSessionState(questions, 3);
      expect(output.questions).to.have.lengthOf(2);
    });

    it('has prop questions size not exceeding config.MAX_QUESTIONS_PER_QUIZ', function() {
      const questions = createQuestions([['A', 10], ['B', 10], ['C', 10], ['D', 10]]);
      const output = Quiz.initSessionState(questions, 20);
      expect(output.questions).to.have.lengthOf(config.MAX_QUESTIONS_PER_QUIZ);
    });

    it('has prop questions shuffled by traits', function() {
      const questions = createQuestions([['A', 3], ['B', 3], ['C', 2], ['D', 1]]);
      const output = Quiz.initSessionState(questions, 9);
      const group1 = output.questions.slice(0, 4).map((q) => q[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]);
      expect(group1).to.have.members(['a', 'b', 'c', 'd']);
      const group2 = output.questions.slice(4, 7).map((q) => q[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]);
      expect(group2).to.have.members(['a', 'b', 'c']);
      const group3 = output.questions.slice(7, 9).map((q) => q[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]);
      expect(group3).to.have.members(['a', 'b']);
    });

    it('has prop traitToWeight with unique traits of value initialized to 0', function() {
      const questions = createQuestions([['A', 4], ['B', 3], ['C', 2], ['D', 1]]);
      const output = Quiz.initSessionState(questions, 10);
      expect(output.traitToWeight).to.eql({a: 0, b: 0, c: 0, d: 0});
    });
  });

  describe('getUniqueTraits', function() {
    it('returns an array of string', function() {
      const questions = createQuestions([['A', 4]]);
      const output = Quiz.getUniqueTraits(questions);
      expect(output).to.be.a('array');
      output.forEach((trait) => {
        expect(trait).to.be.a('string');
      });
    });

    it('returns an array of lowercased unique traits', function() {
      const questions = createQuestions([['A', 3], ['B', 3], ['C', 2], ['D', 1]]);
      const output = Quiz.getUniqueTraits(questions);
      expect(output).to.have.lengthOf(4);
      expect(output).to.have.members(['a', 'b', 'c', 'd']);
    });
  });

  describe('shuffleByTraits', function() {
    it('returns an array of shuffled question by trait groups', function() {
      const questions = createQuestions([['A', 3], ['B', 3], ['C', 2], ['D', 1]]);
      const output = Quiz.shuffleByTraits(questions);
      const group1 = output.slice(0, 4).map((q) => q[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]);
      expect(group1).to.have.members(['A', 'B', 'C', 'D']);
      const group2 = output.slice(4, 7).map((q) => q[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]);
      expect(group2).to.have.members(['A', 'B', 'C']);
      const group3 = output.slice(7, 9).map((q) => q[Alias.QUIZ_Q_A.PERSONALITY_TRAIT]);
      expect(group3).to.have.members(['A', 'B']);
    });

    it('does not mutate input questions', function() {
      const questions = createQuestions([['A', 3], ['B', 3], ['C', 2], ['D', 1]]);
      const questionsCopy = [...questions];
      Quiz.shuffleByTraits(questions);
      expect(questions).to.eql(questionsCopy);
    });
  });

  describe('matchAnswer', function() {
    it('returns a tuple of [trait, weight]', function() {
      const question = createQuestions([['A', 1]])[0];
      const output = Quiz.matchAnswer(question, 'p1');
      expect(output)
        .to.be.an('array')
        .of.lengthOf(2);
      expect(output[0]).to.be.an('string');
      expect(output[1]).to.be.an('number');
    });

    it('returns a positive weight for positive matched answer', function() {
      const question = createQuestions([['A', 1]])[0];
      const output = Quiz.matchAnswer(question, 'p1');
      expect(output[0]).to.equal('a');
      expect(output[1]).to.equal(1);
    });

    it('returns a negative weight for negative matched answer', function() {
      const question = createQuestions([['B', 1]])[0];
      const output = Quiz.matchAnswer(question, 'n1');
      expect(output[0]).to.equal('b');
      expect(output[1]).to.equal(-1);
    });

    it('returns a positive weight for matched Answer.POSITIVE constant', function() {
      const question = createQuestions([['C', 1]])[0];
      const output = Quiz.matchAnswer(question, Answer.POSITIVE);
      expect(output[0]).to.equal('c');
      expect(output[1]).to.equal(1);
    });

    it('returns a negative weight for matched Answer.NEGATIVE constant', function() {
      const question = createQuestions([['D', 1]])[0];
      const output = Quiz.matchAnswer(question, Answer.NEGATIVE);
      expect(output[0]).to.equal('d');
      expect(output[1]).to.equal(-1);
    });

    it('returns [null, null] for unmatched answer', function() {
      const question = createQuestions([['D', 1]])[0];
      const output = Quiz.matchAnswer(question, 'abc');
      expect(output[0]).to.be.null;
      expect(output[1]).to.be.null;
    });
  });

  describe('matchOutcome', function() {
    it('returns an outcome object', function() {
      const outcomes = createOutcomes(['A', 'B', 'C', 'D']);
      const output = Quiz.matchOutcome(outcomes, {A: 1, B: 1});
      expect(output).to.be.an('object');
      expect(output).to.have.ownProperty(Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME);
      expect(output).to.have.ownProperty(Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS);
      expect(output).to.have.ownProperty(Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS);
    });

    it('returns with highest overall weight', function() {
      const outcomes = createOutcomes(['A', 'B', 'C', 'D']);
      const output = Quiz.matchOutcome(outcomes, {A: 1, B: -1, C: 1, D: -1});
      expect(output[Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]).to.equal('A,!B,C,!D');
    });

    it('returns with a random outcome for tied outcome weights', function() {
      const outcomes = [
        {
          [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: 'A,B',
          [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: ['A', 'B'].join(' & '),
          [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: null,
        },
        {
          [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: '!C,!D',
          [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: null,
          [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: ['C', 'D'].join(' & '),
        },
        {
          [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: '!B,C',
          [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: 'C',
          [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: 'B',
        },
        {
          [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: '!A,D',
          [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: 'D',
          [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: 'A',
        },
      ];
      const outcomeTexts = new Set();
      for (let i = 0; i < 50; ++i) {
        outcomeTexts.add(
          Quiz.matchOutcome(outcomes, {A: 1, C: -1})[Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]
        );
      }
      expect(outcomeTexts.size).to.equal(2);
    });

    it('works with optional positive/negative outcome traits', function() {
      const outcomes = [
        {
          [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: 'A,B',
          [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: ['A', 'B'].join(' & '),
          [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: null,
        },
        {
          [Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]: '!C,!D',
          [Alias.QUIZ_OUTCOMES.POSITIVE_OUTCOME_TRAITS]: null,
          [Alias.QUIZ_OUTCOMES.NEGATIVE_OUTCOME_TRAITS]: ['C', 'D'].join(' & '),
        },
      ];
      const output = Quiz.matchOutcome(outcomes, {A: 1, B: 1});
      expect(output[Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME]).to.equal('A,B');
    });
  });
});
