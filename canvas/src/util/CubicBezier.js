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
 * @fileoverview CubicBezier class
 */

export default class CubicBezier {
  constructor(p1x = 0, p1y = 0, p2x = 1, p2y = 1) {
    this.p1x = p1x;
    this.p1y = p1y;
    this.p2x = p2x;
    this.p2y = p2y;
    this.cx = 3.0 * this.p1x;
    this.cy = 3.0 * this.p1y;
    this.bx = 3.0 * (this.p2x - this.p1x) - this.cx;
    this.by = 3.0 * (this.p2y - this.p1y) - this.cy;
    this.ax = 1.0 - this.cx - this.bx;
    this.ay = 1.0 - this.cy - this.by;
    this.ease = this.ease.bind(this);
  }

  static config(p1x = 0, p1y = 0, p2x = 1, p2y = 1) {
    return new CubicBezier(p1x, p1y, p2x, p2y).ease;
  }

  ease(time, start, change, duration) {
    return this.solve(time, this.getEpsilon(duration));
  }

  getEpsilon(duration = 400) {
    return 1 / (200 * duration);
  }

  solve(x, epsilon) {
    return this.sampleCurveY(this.solveCurveX(x, epsilon));
  }

  solveCurveX(x, epsilon) {
    for (let i = 0, t2 = x; i < 8; i++) {
      const x2 = this.sampleCurveX(t2) - x;
      if (Math.abs(x2) < epsilon) return t2;
      const d2 = this.sampleDerivX(t2);
      if (Math.abs(d2) < epsilon) break;
      t2 = t2 - x2 / d2;
    }
    let t0 = 0.0;
    let t1 = 1.0;
    let t2 = x;
    if (t2 < t0) return t0;
    if (t2 > t1) return t1;
    while (t0 < t1) {
      const x2 = this.sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon) return t2;
      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2;
  }

  sampleCurveX(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  }

  sampleCurveY(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  }

  sampleDerivX(t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  }
}
