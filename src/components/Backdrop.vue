<template>
    <canvas id='backCanvas' :width='screenSize.width' :height="screenSize.height" ref='backCanvas'></canvas>
</template>

<script>
import { onBeforeMount, onMounted, ref } from 'vue'
import {enableAnimations} from '../store/state'
export default {
  setup(){
        let backCanvas = ref(null)
        let cvs,ctx = null
        let loopId = undefined

        const screenSize = {
            width : screen.availWidth,
            height : screen.availHeight
        }

        const backImage = new Image()
        backImage.src = require('../assets/backdrop.png')
        console.log(backImage)

        const draw = () => {
            ctx.drawImage(backImage, 0, 0, backImage.width, backImage.height, 0, 0, cvs.width , cvs.height)
        }

        const loop = () => {
            draw()
            frames += 1

            loopId = requestAnimationFrame(loop);  
        }

        onMounted(() => {
            console.log('mounted')
            if(!backCanvas.value) return; 
            cvs = backCanvas.value
            ctx = cvs.getContext('2d')
            console.log(cvs)

            loop()
        })

        onBeforeMount(() => {
            cancelAnimationFrame(loopId)
            console.log('backdrop somehow unmounted??')
        })

        

    return {
        enableAnimations,
        backCanvas,
        screenSize
    }
  }

}
</script>

<style lang='scss'>
#backCanvas{
    image-rendering: pixelated;
}
</style>