<template>
<div class='canvas-wrap'>
    <canvas id='mycanvas' width="320" height='480' ref='myCanvas'></canvas>
    <textarea id="nameInput" ref='nameInputRef' @input="setTextInput"  @keyup.enter.exact="updatePlayerName" v-show="showNameInput " 
        spellcheck="false" autocomplete="false" maxlength="9"></textarea>
</div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref,nextTick } from 'vue'
import { state,possibleStates, background as bg, cat, getHighScores, foreground as fg,tappableIcons,possibleGameOverStates,
            getReadyMessage as getReady, gameOverMessage as gameOver, pipes,score,isTapInsideBoundary,setTextInput,updatePlayerName,
            sfx,collisionTimestamp } from '../store/catGame'
import {enableAnimations} from '../store/state'
import {windows} from '../store/state'


export default {
    setup(){
        const nameInputRef = ref(null) 
        const showNameInput = ref(null)    
        state.value.showNameInput = showNameInput
        state.value.nameInputRef = nameInputRef


        const gameState = ref(windows.value['game'])
        console.log(state.value)

        let myCanvas = ref(null)


        let cvs,ctx = null
        let loopId = undefined

        let showFps = true
        let currentFps = 0

        let ERROR_FLAG = false

        // console.log(sprite)
        const draw = (frames) => {
            if(ERROR_FLAG) return;
            try{
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
                        gameOver.draw(ctx,frames)
                        break;
                }
                score.draw(ctx)
            }catch(err){
                ERROR_FLAG = true
                console.log("Fix your error", err)
            }
        }

        let frames = 0
        // REDRAWNG CANVAS USING CONSISTENT FPS ACROSS DEVICES
        // https://www.geeksforgeeks.org/how-to-control-fps-with-requestanimationframe/

        var frameCount = 0;
        var fpsInterval, startTime, now, then, elapsed;
        const FPS = 60
    
        function startAnimating(FPS) {
            fpsInterval = 1000 / FPS;
            then = Date.now();
            startTime = then;
            console.log(startTime);
            animate();
        }

        function animate() {
            // request another frame
    
            loopId = requestAnimationFrame(animate);
    
            // calc elapsed time since the last loop
            now = Date.now();
            elapsed = now - then;
    
            // if enough time has elapsed, draw the next frame
            if (elapsed > fpsInterval) {
                then = now - (elapsed % fpsInterval);
    
                // draw animating objects here...
                frames += 1
                draw(frames)
                // console.log(frames)
    
                // below code is used for testing, whether
                // the frame is animating at the specified FPS
    
                var sinceStart = now - startTime;
                currentFps = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
                // console.log("Elapsed time= " + Math.round((sinceStart / 1000) * 100) / 100 
                //                 + " secs @ " + currentFps + " FPS.")

                if( showFps && currentFps <= 45 ){
                    // console.log(currentFps)
                    ctx.lineWidth = 2;
                    ctx.fillStyle = '#100'
                    ctx.fillStyle = currentFps < 30 ? 'red' : '#aeae07'
                    ctx.font = "12px Finger Paint"
                    ctx.fillText(Math.round(currentFps), 5, 12 )
                }
                if (currentFps > 45) showFps = false
            }
        }

        const resolveGameOverTaps = (evt) => {
            console.log(state.value.gameOverState)
            const GOState = state.value.gameOverState
            // check if user wants to play again
            if( GOState === possibleGameOverStates.active && (evt.code === 'Space' || isTapInsideBoundary(evt,cvs,tappableIcons.startBtn))){
                if( state.value.primaryController === 'Keyboard' && (performance.now() - collisionTimestamp < 1000)) return;
                if (state.value.gameOverState !== possibleGameOverStates.active) return;

                console.log('tap resolved: game reset')
                state.value.gameOverState = possibleGameOverStates.inactive
                state.value.current = possibleStates.gameStarted
                sfx.swoosh.play()
                cat.reset()
                pipes.reset()
                bg.reset()
                fg.reset()
                score.latestScore = 0
                return true
            } // check if HS button is pressed
            else if ( GOState === possibleGameOverStates.active && isTapInsideBoundary(evt,cvs, tappableIcons.showHSBtn) ){
                console.log('tap inside: showHSBtn')
                state.value.gameOverState = possibleGameOverStates.highScores
                console.log('show scoreboard')
                return true
            } // when on HS Screen, check if user wants to return to GO screen
            else if(GOState === possibleGameOverStates.highScores && 
                        (evt.code === 'Enter' ||   isTapInsideBoundary(evt,cvs, tappableIcons.HSExit))){
                console.log('tap inside: HS Okay')
                state.value.gameOverState = possibleGameOverStates.active
                return true
            }
            
            console.log('tap invalid: do nothing and resolve')
            return true
        }

        const handleUserTap = (evt) => {
            // console.log(evt.code, evt.type)
            if(!(evt.type === 'click' || evt.code === 'Space')) return;
            state.value.primaryController = evt.code === 'Space' ? 'Keyboard' : 'Tap' 
            // console.log(state.value.primaryController)
    
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
                    if(!possibleGameOverStates.active) return;
                    console.log('game over')
                    const isResolved =  resolveGameOverTaps(evt)
                    if(!isResolved) state.value.gameOverState = possibleGameOverStates.active
                    // for some reason, if idle for some time, currentFps goes below 45 when it's clearly running above it. 
                    if ( showFps && currentFps > 45) showFps = false
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
            try{
                startAnimating(FPS);
            }catch(e){
                console.log('fix your errors:', e);
            }
            gameState.value.loaded = true;
            console.log('game mounted')

            // showNameInput.value = true
            console.log(nameInputRef.value)
            nextTick(() => {
                nameInputRef.value.focus()
            });

        })

        
        onBeforeUnmount(() => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            state.value.current = possibleStates.getReady
            cat.reset()
            pipes.reset()
            bg.reset()
            fg.reset()
            cancelAnimationFrame(loopId)
            removeEventListener("click", handleUserTap)
            removeEventListener("keyup", handleUserTap)
            removeEventListener("mouseover",handleExternalAnimations)
            removeEventListener("mouseout",handleExternalAnimations)
            console.log('game unmounted')
        })

        return{
            myCanvas,
            nameInputRef,
            showNameInput,
            setTextInput,
            updatePlayerName
        }
    }
}
</script>

<style lang='scss' scoped>

.canvas-wrap{
    position: relative;
    width: 320px;
    height: 480px;
    overflow: hidden;

    & > * {
        position: absolute
    }

    #mycanvas{
        display: block;
        background: black;
        cursor: pointer;
        overflow: hidden;
    }

    #nameInput {
        top: 106px;
        left: 105.2px;
        width: 120px;
        height: 10px;
        padding-bottom: 10px;
        padding-top : -10px;
        background-color: rgba(0,0,0,0);
        resize: none;
        overflow: hidden;
        border: none;
        outline: none;
        font-family: 'BitMicro';
        color: #f98e66;
        font-size: 22px;
        /* user-select: none; */
    }


}

</style>