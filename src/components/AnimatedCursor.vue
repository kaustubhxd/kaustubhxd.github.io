<template>
    <div class="cursor" :style="{ transform : cursorInnerTransform}"></div>

    <div id="cursor" :style="{ transform : cursorTransform}">
        <div class="cursor-circle" :style="{ transform : cursorCircleTransform, width : cursorCircleWidth, height: cursorCircleHeight}"></div>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    setup(){
        
        const cursorInnerTransform  = ref('');
        const cursorTransform       = ref('');
        const cursorCircleTransform = ref('');
        
        const cursorCircleWidth     = ref('64px')        
        const cursorCircleHeight    = ref('64px')


        const mouse = { x: -100, y: -100 }; // mouse pointer's coordinates
        const pos = { x: 0, y: 0 };         // cursor's coordinates
        const speedDefault = 0.3;
        var speed = speedDefault;                  // between 0 and 1

        const updateCoordinates = e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }

        window.addEventListener('mousemove', updateCoordinates);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);


        function getAngle(diffX, diffY) {
            return Math.atan2(diffY, diffX) * 180 / Math.PI;
        }

        function getSqueeze(diffX, diffY) {
            const distance = Math.sqrt(
                Math.pow(diffX, 2) + Math.pow(diffY, 2)
            );
            const maxSqueeze = 0.15;
            const accelerator = 1500;
            return Math.min(distance / accelerator, maxSqueeze);
        }


        const updateCursor = () => {
            const diffX = Math.round(mouse.x - pos.x);
            const diffY = Math.round(mouse.y - pos.y);

            pos.x += diffX * speed;
            pos.y += diffY * speed;

            const angle = getAngle(diffX, diffY);
            const squeeze = getSqueeze(diffX, diffY);

            const scale = 'scale(' + (1 + squeeze) + ', ' + (1 - squeeze) +')';
            const rotate = 'rotate(' + angle +'deg)';
            const translate = 'translate3d(' + pos.x + 'px ,' + pos.y + 'px, 0)';

        
            // cursorInner.style.transform = translate;
            // cursor.style.transform = translate;
            // cursorCircle.style.transform = rotate + scale;

            cursorInnerTransform.value  = translate;
            cursorTransform.value       = translate;
            cursorCircleTransform.value = rotate + scale;
        };

        
        function loop() {
            updateCursor();
            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);

        function handleMouseDown()  { speed = 1; cursorCircleWidth.value = cursorCircleHeight.value = '32px' };
        function handleMouseUp()    { speed = speedDefault; cursorCircleWidth.value = cursorCircleHeight.value = '64px' }

        return {
            cursorInnerTransform,
            cursorTransform,
            cursorCircleTransform,
            cursorCircleWidth,
            cursorCircleHeight
        }

    }
}
</script>

<style scoped>
:root {
    --bc: #fcffff;
    --bc-dark: rgba(8, 8, 10, 1);
    --black: #000000;
  }
  * {
    user-select: none;
    box-sizing: border-box;
    cursor: none;
  }
  html, body {
    margin: 0;
    width: 100%;
    background-color: var(--bc-dark);
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
    cursor: none;
  }
  

  /* Cursor */
  #cursor {
    top: 0;
    left: 0;
    position: fixed;
    pointer-events: none;
    will-change: transform;
    mix-blend-mode: difference;
    transition: transform .05s linear;
    z-index: 99;
  }
  .cursor {
    top: -4px;
    left: -4px;
    width: 8px;
    height: 8px;
    position: fixed;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 1);
    transform: translate(-50%, -50%);
    will-change: transform;
    transition: opacity .15s ease-in-out;
    mix-blend-mode: difference;
    pointer-events: none;
    z-index: 99;
  }
  @media (hover: hover) and (pointer: fine) {
    .cursor-circle {
      width: 64px;
      height: 64px;
      margin-top: -50%;
      margin-left: -50%;
      border-radius: 50%;
      mix-blend-mode: difference;
      border: solid 1.5px rgba(255, 255, 255, 1);
      transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), 
                  background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1), 
                  border-color 0.3s cubic-bezier(0.25, 1, 0.5, 1), 
                  width 0.7s cubic-bezier(0.25, 1, 0.5, 1), 
                  height 0.7s cubic-bezier(0.25, 1, 0.5, 1);
    
    }
  }
</style>