<template>
  <canvas id='mycanvas' width="320" height='480' ref='myCanvas'></canvas>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { state,possibleStates, background as bg, foreground as fg, cat, getHighScores,
            getReadyMessage as getReady, gameOverMessage as gameOver, pipes,score,isTapInsideBoundary,sfx } from '../store/catGame'
import {enableAnimations} from '../store/state'
import {timer} from 'd3-timer'


export default {
    setup(){
        let myCanvas = ref(null)
        let cvs,ctx = null
        let loopId = undefined

        // console.log(sprite)
        const draw = (frames) => {
            bg.draw(ctx)
            cat.draw(ctx,frames)
            cat.update()
            pipes.draw(ctx)
            pipes.update(frames)
            fg.draw(ctx)


            switch(state.value.current){
                case possibleStates.getReady:
                    getReady.draw(ctx)
                    break;
                case possibleStates.gameOver:
                    gameOver.draw(ctx)
                    break;
            }
            score.draw(ctx)
        }

        // REDRAWNG CANVAS USING CONSISTENT FPS ACROSS DEVICES
        // https://www.geeksforgeeks.org/how-to-control-fps-with-requestanimationframe/

        var frameCount = 0;
        var fpsInterval, startTime, now, then, elapsed;
        let fps = 60
        let frames = 0

    
        function startAnimating(fps) {
            fpsInterval = 1000 / fps;
            then = Date.now();
            startTime = then;
            console.log(startTime);
            animate();
        }

        function animate() {
            // request another frame
    
            requestAnimationFrame(animate);
    
            // calc elapsed time since the last loop
            now = Date.now();
            elapsed = now - then;
    
            // if enough time has elapsed, draw the next frame
    
            if (elapsed > fpsInterval) {
                then = now - (elapsed % fpsInterval);
    
            // draw animating objects here...
                frames += 1
                draw(frames)
                console.log(frames)
    
             // below code is used for testing, whether
                // the frame is animating at the specified fps
    
                var sinceStart = now - startTime;
                var currentFps = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
                // console.log("Elapsed time= " + Math.round((sinceStart / 1000) * 100) / 100 
                //                 + " secs @ " + currentFps + " fps.")
                // console.log(currentFps);
            }
        }




        // let frames = 0
        // const loop = () => {
        //     // frames += 1
        //     // draw(frames)

        //     // loopId = requestAnimationFrame(loop); 
        // }

        const handleUserTap = (evt) => {
            // console.log(evt.code, evt.type)
            if(!(evt.type === 'click' || evt.code === 'Space')) return;
    
            switch(state.value.current){
                case possibleStates.getReady:
                    sfx.swoosh.play()
                    getHighScores()
                    state.value.current = possibleStates.gameStarted
                    break;
                case possibleStates.gameStarted:
                    cat.flap()
                    break;
                case possibleStates.gameOver:
                    if( ! (evt.code === 'Space' || isTapInsideBoundary(evt,cvs)) ) return; 
                    state.value.current = possibleStates.gameStarted
                    sfx.swoosh.play()
                    cat.reset()
                    pipes.reset()
                    bg.reset()
                    fg.reset()
                    score.latestScore = 0
                    break;

            }
            // console.log(state.value.current)
        }

        const handleExternalAnimations = (evt) => {
            // console.log(evt.type)
            if(evt.type === 'mouseover'){
                enableAnimations.value = false
            }else if(evt.type === 'mouseout'){
                enableAnimations.value = true
            }
        }

        
        onMounted(() => {
            if(!myCanvas.value) return; 
            cvs = myCanvas.value
            ctx = cvs.getContext('2d')
            // console.log(cvs)

            cvs.addEventListener("click", handleUserTap)
            window.addEventListener("keyup", handleUserTap)
            cvs.addEventListener("mouseover",handleExternalAnimations)
            cvs.addEventListener("mouseout",handleExternalAnimations)

            // loop()
            startAnimating(fps);
        })

        onBeforeUnmount(() => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            cancelAnimationFrame(loopId)
            removeEventListener("click", handleUserTap)
            removeEventListener("keyup", handleUserTap)
            removeEventListener("mouseover",handleExternalAnimations)
            removeEventListener("mouseout",handleExternalAnimations)
            console.log('game animation end')
        })

        return{
            myCanvas
        }
    }
}
</script>

<style lang='scss' scoped>
#mycanvas{
    display: block;
    background: black;
    cursor: pointer;
}

</style>