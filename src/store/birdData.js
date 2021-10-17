
import {ref} from 'vue'

const state = ref({
    current: 0
})
let sprite = new Image()
sprite.src = require('../assets/game/sprite.png')


const sfx = {
    point : new Audio( require('../assets/game/audio/sfx_point.wav') ),
    flap : new Audio( require('../assets/game/audio/sfx_flap.wav') ),
    swoosh : new Audio( require('../assets/game/audio/sfx_swooshing.wav') ),
    hit : new Audio( require('../assets/game/audio/sfx_hit.wav') ),
    die : new Audio( require('../assets/game/audio/sfx_die.wav') ),
}

sfx.die.play()

const possibleStates = {
    getReady: 0,
    gameStarted: 1,
    gameOver: 2
}

let cvs = {
    width : 320,
    height : 480
}

const DEGREES = 180/ Math.PI


const background = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    dx: 2,
    y: cvs.height - 226,
    draw: function(ctx,sprite){ 
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (2*this.w), this.y, this.w, this.h)

        // moving bg illusion
        if(state.value.current === possibleStates.gameStarted){
            this.x = this.x <= -this.w ? 0 : this.x - this.dx
        }
    } 
}

const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    dx: 2,
    y: cvs.height - 112,
    draw: function(ctx,sprite){ 
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (2*this.w), this.y, this.w, this.h)

        // moving fg illusion
        if(state.value.current === possibleStates.gameStarted){
            this.x = this.x <= -this.w ? 0 : this.x - this.dx
        }
    }
}

const bird = {
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139},
    ],
    x: 50, y: 150,
    w: 34, h: 26,
    radius: 12,
    frame: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    rotation: 0,
    draw: function(ctx,sprite,frames){
        const birdy = this.animation[this.frame]

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        ctx.drawImage(sprite, birdy.sX, birdy.sY, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h)
        ctx.restore()

        // update flap animation
        if(state.value.current !== possibleStates.gameOver){
            let period = state.value.current == possibleStates.getReady ? 10 : 5
            this.frame += (frames % period) == 0 ? 1 : 0
            this.frame = this.frame % this.animation.length
        }
    },
    update: function(){
        if(state.value.current === possibleStates.getReady){
            this.y = 150;
            this.rotation = 0 * DEGREES
        }else{
            
            this.speed += this.gravity
            this.y += this.speed

            let birdBottom = this.y + (this.h/2)
            let groundPosition = cvs.height - foreground.h

            // if speed is greater than jump coefficient, the bird is free falling. 
            // else, we're jumping. set rotation accordingly
            if(this.speed >= this.jump){
                this.rotation = -90 * DEGREES
            }else{
                this.rotation = 25 * DEGREES
            }
            
            // prevent bird from clipping inside the ground
            if(birdBottom >= groundPosition){
                this.y = groundPosition - (this.h/2)
                if(state.value.current === possibleStates.gameStarted)
                    sfx.hit.play()
                state.value.current = possibleStates.gameOver
                
            }
        }
    },
    flap: function(){
        let birdTop = this.y - (this.h/2)
        if(birdTop > 0){
            this.speed = - this.jump
            sfx.flap.play()
        }
    },
    reset: function(){
        this.speed = 0
        this.y = 150
    }
}

const pipes = {
    positions : [],
    top:{
        sX: 553,
        sY: 0
    },
    bottom:{
        sX: 502,
        sY: 0
    },
    w: 53, h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw : function(ctx){
        this.positions.forEach(pos => {
            let topYPos = pos.y
            let bottomYPos = topYPos + this.h + this.gap
            
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, pos.x, pos.y, this.w, this.h)
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, pos.x, bottomYPos, this.w, this.h)
        })
    },
    update : function(frames){
        if(state.value.current !== possibleStates.gameStarted)  return;

        // add new pipe every 100 frames
        if(frames % 100 === 0){
            this.positions.push({
                x: cvs.width,
                y: this.maxYPos * ( Math.random() + 1)  
            })
        }
        
        // move existing pipes to the left by dx every frame 
        this.positions.forEach(pos => {
            pos.x -= this.dx

            // if pipes left beyond the canvas, remove them
            if(pos.x + this.w <= 0){
                this.positions.shift()
                score.latestScore += 1
                sfx.point.play()
                score.bestScore = Math.max(score.latestScore, score.bestScore)
            }

            // collision detection
            const   birdTop = bird.y - bird.radius,     birdBottom = bird.y + bird.radius,
                    birdFront = bird.x + bird.radius,   birdBack = bird.x - bird.radius     
            const topPipeHitY = pos.y + this.h
            const bottomPipeHitY = pos.y + this.h + this.gap
            
            if( birdFront >  pos.x && birdBack < (pos.x + this.w) && (birdTop < topPipeHitY || birdBottom > bottomPipeHitY) ){
                console.log('collision!')
                sfx.hit.play().then(() => {
                    sfx.die.play()
                })
                state.value.current = possibleStates.gameOver
            }

        })
        console.log(this.positions.length);
    },
    reset : function(){
        this.positions = []
    }

}

const score = {
    bestScore: localStorage.getItem("BEST_SCORE") || 0,
    latestScore: 0,
    draw: function(ctx){
        ctx.fillStyle = '#FFF'
        ctx.strokeStyle = '#000'
        if(state.value.current === possibleStates.gameStarted){
            ctx.lineWidth = 2;
            ctx.font = "35px Arial"
            ctx.fillText(this.latestScore, cvs.width/2, 50 )
            ctx.strokeText(this.latestScore, cvs.width/2, 50 )
        }else if(state.value.current === possibleStates.gameOver){
            ctx.lineWidth = 2;
            ctx.font = "25px Arial"
            ctx.fillText(this.latestScore, 225, 235 )
            ctx.strokeText(this.latestScore, 225, 235 )
            ctx.fillText(this.bestScore, 220, 280 )
            ctx.strokeText(this.bestScore, 220, 280 )

            this.bestScore = Math.max(this.latestScore, this.bestScore)
            localStorage.setItem("BEST_SCORE", this.bestScore)
        }
    }
}

const getReadyMessage = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width/2 - 173/2,
    y: cvs.height/2 - 152/2,
    draw: function(ctx,sprite){ 
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    } 
}

const gameOverMessage = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width/2 - 225/2,
    y: cvs.height/2 - 202/2,
    draw: function(ctx,sprite){ 
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    } 
}

const startBtn = {
    x: 118,
    y: 319,
    w: 83,
    h: 29,
}

const isTapInsideBoundary = (evt,canvas) => {
    let restartRect = canvas.getBoundingClientRect();
    let clickX = evt.clientX - restartRect.left
    let clickY = evt.clientY - restartRect.top

    return ( clickX >= startBtn.x && clickX <= (startBtn.x + startBtn.w) 
            && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h)
}

export {
    sprite,
    state,
    possibleStates,
    background,
    foreground,
    bird,
    pipes,
    score,
    sfx,
    isTapInsideBoundary,
    getReadyMessage,
    gameOverMessage
}