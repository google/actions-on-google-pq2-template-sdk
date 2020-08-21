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

const {Card, Simple, Suggestion} = require('@assistant/conversation');

const util = require('./util');
const config = require('./config.js');
const {Action, Answer, Template, TemplateAction, Alias, Prompt, Type} = require('./constant.js');
const CanvasBuilder = require('./canvas-builder.js');
const Quiz = require('./quiz.js');

/**
 * Fulfillment class to handle supported ConversationV3 actions.
 */
class Fulfillment {
  /**
   * @return {Fulfillment}
   */
  static create() {
    return new Fulfillment();
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.LOAD_SETTINGS](conv) {
    const quizSettings = await conv.$helper.getQuizSettings();
    conv.$helper.updateConvDataQuizSettings(quizSettings);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.SETUP_QUIZ](conv) {
    const quizQuestions = await conv.$helper.getAllQuizQuestions();
    const initQuizState = Quiz.initSessionState(
      quizQuestions,
      conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ]
    );
    conv.session.params.data = {...conv.session.params.data, ...initQuizState};
    conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ] =
      conv.session.params.data.limit;
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_SKIP_CONFIRMATION](conv) {
    const quizIntro = await conv.$helper.getRandomQuizIntro();
    const introSimple = util.response.toSimple(
      quizIntro,
      Alias.QUIZ_INTRO.DISPLAYED_INTRO,
      Alias.QUIZ_INTRO.SPOKEN_INTRO
    );
    const transition = {
      simple: introSimple.speech,
      rich: [new Simple(introSimple)],
      immersive: CanvasBuilder.create(conv.hasInteractiveCanvas, {
        url: config.IMMERSIVE_URL,
        template: Template.INTRO,
        action: TemplateAction.RESET,
        speech: introSimple.speech,
        data: {
          header: conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.INTRO_TITLE],
          body: conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.INTRO_SUBTITLE],
          progress: -1,
          background: {
            landscape: quizIntro[Alias.QUIZ_INTRO.BACKGROUND_LANDSCAPE_IMAGE],
            portrait: quizIntro[Alias.QUIZ_INTRO.BACKGROUND_PORTRAIT_IMAGE],
          },
        },
        config: {...conv.session.params.data.quizSettings},
      }),
    };
    return this.question(conv, transition);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_CONFIRMATION](conv) {
    const [
      quizIntro,
      introConfirmationPrompt,
      {text: introConfirmationPositiveChip},
      {text: introConfirmationNegativeChip},
    ] = await Promise.all([
      conv.$helper.getRandomQuizIntro(),
      conv.$helper.getRandomPrompt(Prompt.INTRO_CONFIRMATION),
      conv.$helper.getRandomPrompt(Prompt.INTRO_CONFIRMATION_POSITIVE),
      conv.$helper.getRandomPrompt(Prompt.INTRO_CONFIRMATION_NEGATIVE),
    ]);

    const introSimple = util.response.toSimple(
      quizIntro,
      Alias.QUIZ_INTRO.DISPLAYED_INTRO,
      Alias.QUIZ_INTRO.SPOKEN_INTRO
    );
    const ssml = util.ssml.merge([introSimple.speech, introConfirmationPrompt.speech]);
    conv.$immersive = CanvasBuilder.create(conv.hasInteractiveCanvas, {
      url: config.IMMERSIVE_URL,
      template: Template.INTRO,
      action: TemplateAction.RESET,
      speech: ssml,
      data: {
        header: conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.INTRO_TITLE],
        body: conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.INTRO_SUBTITLE],
        progress: -1,
        background: {
          landscape: quizIntro[Alias.QUIZ_INTRO.BACKGROUND_LANDSCAPE_IMAGE],
          portrait: quizIntro[Alias.QUIZ_INTRO.BACKGROUND_PORTRAIT_IMAGE],
        },
      },
      suggestions: [
        {
          text: conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.START_BUTTON_TEXT],
          speech: introConfirmationPositiveChip,
        },
      ],
      config: {...conv.session.params.data.quizSettings},
    });

    return conv.$helper.ask({
      simple: ssml,
      rich: [
        new Simple(introSimple),
        new Simple(introConfirmationPrompt),
        new Suggestion({title: conv.$helper.cleanRichSuggestion(introConfirmationPositiveChip)}),
        new Suggestion({title: conv.$helper.cleanRichSuggestion(introConfirmationNegativeChip)}),
      ],
      immersive: [new Simple(ssml), conv.$immersive.build()],
    });
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_YES](conv) {
    const introPositivePrompt = await conv.$helper.getRandomPrompt(Prompt.INTRO_POSITIVE_RESPONSE);
    const transition = {
      simple: introPositivePrompt.speech,
      rich: [new Simple(introPositivePrompt)],
      immersive: CanvasBuilder.create(conv.hasInteractiveCanvas, {
        template: Template.SAY,
        action: TemplateAction.ACTIVE_0,
        speech: introPositivePrompt.speech,
        data: {progress: -1},
        config: {[Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ]: conv.session.params.data.limit},
      }),
    };
    return this.question(conv, transition);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_NO](conv) {
    return conv.$helper.closeWithPrompt(Prompt.INTRO_NEGATIVE_RESPONSE);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_HELP](conv) {
    const suggestions = await conv.$helper.buildPromptRichSuggestions([
      Prompt.INTRO_CONFIRMATION_POSITIVE,
      Prompt.INTRO_CONFIRMATION_NEGATIVE,
    ]);
    return conv.$helper.askWithPrompt(Prompt.START_HELP, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_REPEAT](conv) {
    const suggestions = await conv.$helper.buildPromptRichSuggestions([
      Prompt.INTRO_CONFIRMATION_POSITIVE,
      Prompt.INTRO_CONFIRMATION_NEGATIVE,
    ]);
    return conv.$helper.askWithPrompt(Prompt.START_REPEAT, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_NO_MATCH_1](conv) {
    const suggestions = await conv.$helper.buildPromptRichSuggestions([
      Prompt.INTRO_CONFIRMATION_POSITIVE,
      Prompt.INTRO_CONFIRMATION_NEGATIVE,
    ]);
    return conv.$helper.askWithPrompt(Prompt.INTRO_NO_MATCH_1, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_NO_MATCH_2](conv) {
    const suggestions = await conv.$helper.buildPromptRichSuggestions([
      Prompt.INTRO_CONFIRMATION_POSITIVE,
      Prompt.INTRO_CONFIRMATION_NEGATIVE,
    ]);
    return conv.$helper.askWithPrompt(Prompt.INTRO_NO_MATCH_2, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_NO_INPUT_1](conv) {
    return conv.$helper.askWithPrompt(Prompt.INTRO_NO_INPUT_1);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.START_NO_INPUT_2](conv) {
    return conv.$helper.askWithPrompt(Prompt.INTRO_NO_INPUT_2);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.QUESTION_REPEAT](conv) {
    const repeatPrompt = await conv.$helper.getRandomPrompt(Prompt.QUESTION_REPEAT);

    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const question = conv.$helper.getCurrentQuestion();
    const questionSimple = util.response.toSimple(
      question,
      Alias.QUIZ_Q_A.DISPLAYED_QUESTION,
      Alias.QUIZ_Q_A.SPOKEN_QUESTION
    );
    const ssml = util.ssml.merge([repeatPrompt.speech, questionSimple.speech]);

    return conv.$helper.ask({
      simple: ssml,
      rich: [
        new Simple(repeatPrompt),
        new Simple(questionSimple),
        ...conv.$helper.getQuestionRichSuggestions().map((chip) => new Suggestion({title: chip})),
      ],
      immersive: [
        new Simple(ssml),
        conv.$immersive
          .set('template', Template.SAY)
          .set('speech', ssml)
          .build(),
      ],
    });
  }

  /**
   * @param {ConversationV3} conv
   * @param {string} [answer]
   * @return {Promise}
   */
  async [Action.ANSWER](conv, answer) {
    answer = answer || conv.$helper.getAndClearUserAnswer();
    const question = conv.$helper.getCurrentQuestion();
    const [trait, weight] = Quiz.matchAnswer(question, answer);
    conv.session.params.data.traitToWeight[trait] += weight;

    const followupSimple = util.response.toSimple(
      question,
      ...(weight > 0
        ? [
            Alias.QUIZ_Q_A.POSITIVE_RESPONSE_DISPLAYED_FOLLOWUP,
            Alias.QUIZ_Q_A.POSITIVE_RESPONSE_SPOKEN_FOLLOWUP,
          ]
        : [
            Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_DISPLAYED_FOLLOWUP,
            Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_SPOKEN_FOLLOWUP,
          ])
    );
    let transition;
    if (followupSimple.speech) {
      transition = {
        simple: followupSimple.speech,
        rich: [],
        immersive: CanvasBuilder.create(conv.hasInteractiveCanvas, {
          template: Template.SAY,
          action: weight > 0 ? TemplateAction.ACTIVE_0 : TemplateAction.ACTIVE_1,
          speech: followupSimple.speech,
        }),
      };
      if (followupSimple.text) {
        transition.rich.push(new Simple(followupSimple));
      }
    }

    return ++conv.session.params.data.count >= conv.session.params.data.limit
      ? this.outcome(conv, transition)
      : this.question(conv, transition);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_ORDINAL](conv) {
    if (!conv.intent.params[Type.COUNT] || !conv.intent.params[Type.COUNT].resolved) {
      return this[Action.ANSWER_NO_MATCH_1](conv);
    }
    return this[Action.ANSWER](
      conv,
      conv.intent.params[Type.COUNT].resolved === Answer.FIRST ? Answer.POSITIVE : Answer.NEGATIVE
    );
  }

  /**
   * Asks the user a question, in the order of questions for this session.
   * @param {ConversationV3} conv
   * @param {TransitionResponse} [transition]
   * @return {Promise}
   */
  async question(conv, transition) {
    let transitionPrompt = {speech: '', text: ''}; // Default (first question) - no transition
    if (conv.session.params.data.count > 0) {
      transitionPrompt = await conv.$helper.getRandomPrompt(
        conv.session.params.data.count < conv.session.params.data.limit - 1
          ? Prompt.TRANSITIONS_REGULAR // Second to before last question
          : Prompt.TRANSITIONS_FINAL // Last question
      );
    }

    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const question = conv.$helper.getCurrentQuestion();
    const questionSimple = util.response.toSimple(
      question,
      Alias.QUIZ_Q_A.DISPLAYED_QUESTION,
      Alias.QUIZ_Q_A.SPOKEN_QUESTION
    );
    const speeches = [transitionPrompt.speech, questionSimple.speech];
    const positiveSuggestionText = question[Alias.QUIZ_Q_A.POSITIVE_RESPONSE_ACCEPTABLE_ANSWERS][0];
    const negativeSuggestionText = question[Alias.QUIZ_Q_A.NEGATIVE_RESPONSE_ACCEPTABLE_ANSWERS][0];

    const canvasSpeeches = [util.ssml.merge([transitionPrompt.speech, questionSimple.speech])];

    const immersiveQuestion = CanvasBuilder.create(conv.hasInteractiveCanvas, {
      template: Template.QUESTION,
      action: TemplateAction.RESET,
      speech: util.ssml.merge([transitionPrompt.speech, questionSimple.speech]),
      data: {
        body: questionSimple.text,
        progress: conv.session.params.data.count,
        background: {
          landscape: question[Alias.QUIZ_Q_A.BACKGROUND_LANDSCAPE_IMAGE],
          portrait: question[Alias.QUIZ_Q_A.BACKGROUND_PORTRAIT_IMAGE],
        },
      },
      suggestions: [
        {
          image: question[Alias.QUIZ_Q_A.POSITIVE_ANSWER_IMAGE],
          text: positiveSuggestionText,
          speech: util.string.stripEmoji(positiveSuggestionText),
        },
        {
          image: question[Alias.QUIZ_Q_A.NEGATIVE_ANSWER_IMAGE],
          text: negativeSuggestionText,
          speech: util.string.stripEmoji(negativeSuggestionText),
        },
      ],
    });

    conv.$immersive = immersiveQuestion;
    const hasValidTransition = conv.$helper.isValidTransition(transition);
    if (hasValidTransition) {
      conv.$immersive = transition.immersive;
      conv.$immersive.set('next', immersiveQuestion);
      speeches.unshift(transition.simple);
      canvasSpeeches.unshift(transition.simple);
    }

    return conv.$helper.ask({
      simple: util.ssml.merge(speeches),
      rich: [
        ...(hasValidTransition ? transition.rich : []),
        new Simple(util.response.mergeSimple(transitionPrompt, questionSimple)),
        new Suggestion({title: conv.$helper.cleanRichSuggestion(positiveSuggestionText)}),
        new Suggestion({title: conv.$helper.cleanRichSuggestion(negativeSuggestionText)}),
      ],
      immersive: [new Simple(util.ssml.mergeWithMark(canvasSpeeches)), conv.$immersive.build()],
    });
  }

  /**
   * Get the outcome of the quiz; sums the trait weights and match to closest outcome.
   * @param {ConversationV3} conv
   * @param {TransitionResponse} [transition]
   * @return {Promise}
   */
  async outcome(conv, transition) {
    const [
      quizOutcomes,
      outcomeIntroPrompt,
      endOfGamePrompt,
      {text: endOfGamePlayAgainYesChip},
      {text: endOfGamePlayAgainNoChip},
    ] = await Promise.all([
      conv.$helper.getAllQuizOutcomes(),
      conv.$helper.getRandomPrompt(Prompt.OUTCOME_INTRO),
      conv.$helper.getRandomPrompt(Prompt.END_OF_GAME),
      conv.$helper.getRandomPrompt(Prompt.END_OF_GAME_PLAY_AGAIN_YES),
      conv.$helper.getRandomPrompt(Prompt.END_OF_GAME_PLAY_AGAIN_NO),
    ]);

    const quizOutcome = Quiz.matchOutcome(quizOutcomes, conv.session.params.data.traitToWeight);
    const outcomeSimple = util.response.toSimple(
      quizOutcome,
      Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME,
      Alias.QUIZ_OUTCOMES.SPOKEN_OUTCOME
    );
    // "Ok, you are a {outcome}... Do you want to play again?"
    const outcomeSlide = CanvasBuilder.create(conv.hasInteractiveCanvas, {
      template: Template.OUTCOME,
      action: TemplateAction.RESET,
      speech: util.ssml.merge([outcomeSimple.speech, endOfGamePrompt.speech]),
      data: {
        body: quizOutcome[Alias.QUIZ_OUTCOMES.TITLE],
        small: quizOutcome[Alias.QUIZ_OUTCOMES.DISPLAYED_OUTCOME],
        image: {
          landscape: quizOutcome[Alias.QUIZ_OUTCOMES.VERTICAL_IMAGE],
          portrait: quizOutcome[Alias.QUIZ_OUTCOMES.HORIZONTAL_IMAGE],
        },
        background: {
          landscape: quizOutcome[Alias.QUIZ_OUTCOMES.BACKGROUND_LANDSCAPE_IMAGE],
          portrait: quizOutcome[Alias.QUIZ_OUTCOMES.BACKGROUND_PORTRAIT_IMAGE],
        },
      },
      suggestions: [
        {
          text: conv.session.params.data.quizSettings[Alias.QUIZ_SETTINGS.RESTART_BUTTON_TEXT],
          speech: endOfGamePlayAgainYesChip,
        },
      ],
    });
    // "Let me think about that... I have it!"
    const outcomeIntroSlide = CanvasBuilder.create(conv.hasInteractiveCanvas, {
      template: Template.SAY,
      speech: outcomeIntroPrompt.speech,
      data: {},
      next: outcomeSlide,
    });

    const isValidOutcomeIntro = outcomeIntroPrompt.speech.length > '<speak></speak>'.length;
    const startSlide = isValidOutcomeIntro ? outcomeIntroSlide : outcomeSlide;
    startSlide.add('data', {progress: conv.session.params.data.limit});
    conv.$immersive = startSlide;

    const outcomeBasicCard = conv.$helper.buildOutcomeBasicCard(quizOutcome);
    // Show outcome title in SimpleResponse chat bubble if no BasicCard.
    const outcomeText = outcomeBasicCard ? '' : quizOutcome[Alias.QUIZ_OUTCOMES.TITLE] || '';
    let combinedSimple = {
      speech: util.ssml.merge([outcomeIntroPrompt.speech, outcomeSimple.speech]),
      text: [outcomeIntroPrompt.text, outcomeText].join('  \n\n').trim(),
    };
    const speeches = [outcomeIntroPrompt.speech, outcomeSimple.speech, endOfGamePrompt.speech];

    const canvasSpeeches = [
      outcomeIntroPrompt.speech,
      util.ssml.merge([outcomeSimple.speech, endOfGamePrompt.speech]),
    ];

    // Check for previous transition slide from argument.
    if (conv.$helper.isValidTransition(transition)) {
      conv.$immersive = transition.immersive;
      conv.$immersive.set('next', startSlide);
      speeches.unshift(transition.simple);

      canvasSpeeches.unshift(transition.simple);

      if (transition.rich[0] instanceof Simple) {
        const transitionSimple = {
          text: transition.rich[0].text,
          speech: transition.rich[0].speech,
        };
        combinedSimple = util.response.mergeSimple(transitionSimple, combinedSimple);
      }
    }

    return conv.$helper.ask({
      simple: util.ssml.merge(speeches),
      rich: [
        new Simple(combinedSimple),
        ...(outcomeBasicCard ? [new Card(outcomeBasicCard)] : []),
        new Simple(endOfGamePrompt),
        new Suggestion({title: conv.$helper.cleanRichSuggestion(endOfGamePlayAgainYesChip)}),
        new Suggestion({title: conv.$helper.cleanRichSuggestion(endOfGamePlayAgainNoChip)}),
      ],
      immersive: [new Simple(util.ssml.mergeWithMark(canvasSpeeches)), conv.$immersive.build()],
    });
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_BOTH_OR_NONE](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const suggestions = conv.$helper.getQuestionRichSuggestions();
    return conv.$helper.askWithPrompt(Prompt.GENERIC_NO_MATCH_NONANSWER, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_HELP](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const suggestions = conv.$helper.getQuestionRichSuggestions();
    return conv.$helper.askWithPrompt(Prompt.ANSWER_HELP, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_SKIP](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const suggestions = conv.$helper.getQuestionRichSuggestions();
    return conv.$helper.askWithPrompt(Prompt.SKIP, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_NO_MATCH_1](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const suggestions = conv.$helper.getQuestionRichSuggestions();
    return conv.$helper.askWithPrompt(Prompt.ANSWER_NO_MATCH_1, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_NO_MATCH_2](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const suggestions = conv.$helper.getQuestionRichSuggestions();
    return conv.$helper.askWithPrompt(Prompt.ANSWER_NO_MATCH_2, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_MAX_NO_MATCH](conv) {
    return conv.$helper.closeWithPrompt(Prompt.ANSWER_MAX_NO_MATCH);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_NO_INPUT_1](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    return conv.$helper.askWithPrompt(Prompt.ANSWER_NO_INPUT_1);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_NO_INPUT_2](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    return conv.$helper.askWithPrompt(Prompt.ANSWER_NO_INPUT_2);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.ANSWER_MAX_NO_INPUT](conv) {
    return conv.$helper.closeWithPrompt(Prompt.ANSWER_MAX_NO_INPUT);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.RESTART_CONFIRMATION](conv) {
    const suggestions = await conv.$helper.buildPromptRichSuggestions([
      Prompt.END_OF_GAME_PLAY_AGAIN_YES,
      Prompt.END_OF_GAME_PLAY_AGAIN_NO,
    ]);
    return conv.$helper.askWithPrompt(Prompt.RESTART_CONFIRMATION, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.RESTART_YES](conv) {
    const [restartYesPrompt] = await Promise.all([
      conv.$helper.getRandomPrompt(Prompt.RESTART_YES_RESPONSE),
      this[Action.SETUP_QUIZ](conv),
    ]);
    const transition = {
      simple: restartYesPrompt.speech,
      rich: [new Simple(restartYesPrompt)],
      immersive: CanvasBuilder.create(conv.hasInteractiveCanvas, {
        template: Template.SAY,
        action: TemplateAction.RESET,
        speech: restartYesPrompt.speech,
        data: {progress: -1},
        config: {[Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ]: conv.session.params.data.limit},
      }),
    };
    return this.question(conv, transition);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.RESTART_NO](conv) {
    return this[Action.QUIT_NO](conv);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.RESTART_REPEAT](conv) {
    return this[Action.RESTART_CONFIRMATION](conv);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.PLAY_AGAIN_YES](conv) {
    const [restartYesPrompt] = await Promise.all([
      conv.$helper.getRandomPrompt(Prompt.RESTART_YES_RESPONSE),
      this[Action.SETUP_QUIZ](conv),
    ]);
    const transition = {
      simple: restartYesPrompt.speech,
      rich: [new Simple(restartYesPrompt)],
      immersive: CanvasBuilder.create(conv.hasInteractiveCanvas, {
        template: Template.SAY,
        action: TemplateAction.ACTIVE_0,
        speech: restartYesPrompt.speech,
        data: {progress: -1},
        config: {[Alias.QUIZ_SETTINGS.QUESTIONS_PER_QUIZ]: conv.session.params.data.limit},
      }),
    };
    return this.question(conv, transition);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.PLAY_AGAIN_NO](conv) {
    return conv.$helper.closeWithPrompt(Prompt.RESTART_NO_RESPONSE);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.PLAY_AGAIN_REPEAT](conv) {
    return this[Action.RESTART_CONFIRMATION](conv);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.QUIT_CONFIRMATION](conv) {
    const suggestions = await conv.$helper.buildPromptRichSuggestions([
      Prompt.GENERIC_YES,
      Prompt.GENERIC_NO,
    ]);
    return conv.$helper.askWithPrompt(Prompt.QUIT_CONFIRMATION, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.QUIT_YES](conv) {
    return conv.$helper.closeWithPrompt(Prompt.ACKNOWLEDGE_QUIT);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.QUIT_NO](conv) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    const suggestions = conv.$helper.getQuestionRichSuggestions();
    return conv.$helper.askWithPrompt(Prompt.CONTINUE_TO_PLAY, suggestions);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.QUIT_REPEAT](conv) {
    return this[Action.QUIT_CONFIRMATION](conv);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.GENERIC_NO_MATCH](conv) {
    return conv.$helper.askWithPrompt(Prompt.GENERIC_NO_MATCH);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.GENERIC_MAX_NO_MATCH](conv) {
    return conv.$helper.closeWithPrompt(Prompt.GENERIC_MAX_NO_MATCH);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.GENERIC_NO_INPUT](conv) {
    return conv.$helper.askWithPrompt(Prompt.GENERIC_NO_INPUT);
  }

  /**
   * @param {ConversationV3} conv
   * @return {Promise}
   */
  async [Action.GENERIC_MAX_NO_INPUT](conv) {
    return conv.$helper.closeWithPrompt(Prompt.GENERIC_MAX_NO_INPUT);
  }
}

module.exports = Fulfillment;
