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

import {Component} from 'react';
import {connect} from 'react-redux';
import {
  addSlide,
  setConfig,
  setProgress,
  setFrozen,
  setOptionDeactive,
  setOptionActive,
} from '../action';
import {TemplateAction, TtsMark} from '../constant';

/**
 * @fileoverview React-redux wrapper for the AssistantHost. Relies on reducers
 * to manage state.
 * @example
 * const App = () => {
 *   return(
 *     <div>
 *      <Header />
 *      <AssistantHost/>
 *      <Footer />
 *     </div>
 *   );
 * }
 */

class AssistantHost extends Component {
  constructor(props) {
    super(props);
    this.canvas = window.interactiveCanvas;
    this.slides = [];
    this.index = 0;
  }

  componentDidMount() {
    this.setCallbacks();
  }

  setCallbacks() {
    const assistantCanvasCallbacks = {};

    assistantCanvasCallbacks.onUpdate = (slides) => {
      // Make slide addition async to allow previous slides to flip to reach the end.
      setTimeout(() => {
        this.slides = slides;
        this.index = 0;
        const slide = this.slides[this.index];

        if (slide.action) {
          switch (slide.action) {
            case TemplateAction.RESET:
              this.props.dispatch(setFrozen(false));
              this.props.dispatch(setOptionDeactive());
              break;
            case TemplateAction.FREEZE:
              this.props.dispatch(setFrozen(true));
              break;
            case TemplateAction.ACTIVE_0:
              this.props.dispatch(setFrozen(true));
              this.props.dispatch(setOptionActive(0));
              break;
            case TemplateAction.ACTIVE_1:
              this.props.dispatch(setFrozen(true));
              this.props.dispatch(setOptionActive(1));
              break;
            default:
              console.error('Unknown template action:', slide.action);
          }
        }
        if (slide.config) {
          this.props.dispatch(setConfig(slide.config));
        }
        if (slide.template) {
          this.props.dispatch(addSlide(slide));
        }
        if (slide.data && slide.data.progress) {
          this.props.dispatch(setProgress(slide.data.progress));
        }
      }, 0);
    };

    assistantCanvasCallbacks.onTtsMark = (markName) => {
      console.log({
        markName,
        slide:
          this.props.slides.length > 0
            ? this.props.slides[this.props.slides.length - 1].fields
            : null,
      });

      if (markName.slice(0, 4) === TtsMark.FLIP) {
        assistantCanvasCallbacks._flipSlide();
      } else if (markName === TtsMark.END || markName === TtsMark.ERROR) {
        while (this.index < this.slides.length - 1) {
          assistantCanvasCallbacks._flipSlide();
        }
      }
    };

    assistantCanvasCallbacks._flipSlide = () => {
      if (this.index >= this.slides.length - 1) return;
      const slide = this.slides[++this.index];
      if (slide && slide.template) {
        if (slide.action === TemplateAction.RESET) {
          this.props.dispatch(setOptionDeactive());
        }
        this.props.dispatch(setFrozen(true));
        this.props.dispatch(addSlide(slide));
        if (slide.data && slide.data.progress) {
          this.props.dispatch(setProgress(slide.data.progress));
        }
      }
    };

    // Called by the Interactive Canvas web app once it has loaded to register callbacks.
    this.canvas.ready(assistantCanvasCallbacks);
  }

  render() {
    return null;
  }
}

export default connect((state) => ({
  slides: state.slides,
  ssml: state.ssml,
}))(AssistantHost);
