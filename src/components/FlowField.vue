<template>
  <div class="p5Canvas"></div>
</template>

<script>
import P5 from "p5";
import { isSmartPhone } from "../assets/scripts";
import { executeAfterTimeout } from "../store/state";
import { onMounted } from "vue";

export default {
  setup() {
    onMounted(() => {
      executeAfterTimeout();
    }),
      console.log("hello");
    let p5Canvas = null;
    let w = window.innerWidth;
    let h = window.innerHeight;

    let POINTS = [];
    let SCALAR = 0.005;

    const OPTIMAL_RADIUS = 220;
    const RADIUS = isSmartPhone() ? window.innerWidth : OPTIMAL_RADIUS;
    const COLORS = { r1: 0, r2: 0, g1: 0, g2: 0, b1: 0, b2: 0 };
    const DOCKER_HEIGHT = 80;

    const sketch = (p5) => {
      p5.setup = () => {
        p5.createCanvas(w, h);
        p5.background(30, 30, 30);
        p5.angleMode(p5.DEGREES);
        p5.noiseDetail(2);
        p5.resetSketch();
      };

      p5.resetSketch = () => {
        p5.background(30, 30, 30);
        p5.frameCount = 0;
        const DENSITY = 80;
        const SPACE = p5.width / DENSITY;

        const POINT_LIMIT = {
          startX: p5.width / 2 - RADIUS,
          endX: p5.width / 2 + RADIUS,
          startY: (p5.height - DOCKER_HEIGHT) / 2 - RADIUS,
          endY: (p5.height - DOCKER_HEIGHT) / 2 + RADIUS,
        };

        if (POINTS.length !== 0) POINTS = [];
        for (let x = POINT_LIMIT.startX; x < POINT_LIMIT.endX; x += SPACE) {
          for (let y = POINT_LIMIT.startY; y < POINT_LIMIT.endY; y += SPACE) {
            let p = p5.createVector(x + p5.random(-10, 10), y + p5.random(-10, 10));
            POINTS.push(p);
          }
        }

        POINTS = p5.shuffle(POINTS, true);

        // Adding more randomness in the flow field
        for (const color in COLORS) COLORS[color] = p5.random(255);
        SCALAR = p5.random(SCALAR, 0.01);
      };

      p5.draw = () => {
        if (POINTS.length === 0) return;

        p5.noStroke();
        p5.fill(255);

        const POINTS_PER_FRAME = 1;
        const MAX_POINTS_RENDERED = p5.frameCount <= POINTS.length ? p5.frameCount * POINTS_PER_FRAME : POINTS.length;

        for (let i = 0; i < MAX_POINTS_RENDERED; i++) {
          // when mouseClicked() too fast, need to check
          if (POINTS.length === 0) continue;
          const angle = p5.map(p5.noise(POINTS[i].x * SCALAR, POINTS[i].y * SCALAR), 0, 1, 0, 720);

          let r = p5.map(POINTS[i].x, 0, p5.width, COLORS.r1, COLORS.r2);
          let g = p5.map(POINTS[i].y, 0, p5.height - DOCKER_HEIGHT, COLORS.g1, COLORS.g2);
          let b = p5.map(POINTS[i].x, 0, p5.width, COLORS.b1, COLORS.b2);
          let alpha = p5.map(
            p5.dist(p5.width / 2, (p5.height - DOCKER_HEIGHT) / 2, POINTS[i].x, POINTS[i].y),
            0,
            RADIUS,
            400,
            0
          );

          p5.fill(r, g, b, alpha);

          POINTS[i].add(p5.createVector(p5.cos(angle), p5.sin(angle)));

          if (p5.dist(p5.width / 2, (p5.height - DOCKER_HEIGHT) / 2, POINTS[i].x, POINTS[i].y) < RADIUS) {
            p5.ellipse(POINTS[i].x, POINTS[i].y, 1);
          }
        }
      };

      p5.mouseClicked = (e) => {
        if (e.target.className === "p5Canvas") p5.resetSketch();
      };
    };
    p5Canvas = new P5(sketch, "p5Canvas");
  },
};
</script>

<style>
#p5Canvas {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
