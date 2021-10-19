
import {ref} from 'vue'
import {fireDB} from '../scripts/firebase'


const state = ref({
    current: 0,
    primaryController : ''
})

let initialHSFetch = false

const sprite = new Image()
const catSprite = new Image()
const sprite2 = new Image()
const sprite3 = new Image()
const medals = new Image()
const blueSky = new Image()
const sea = new Image()
const mount = new Image()
const clouds = new Image()
const tileset = new Image()

sprite.src = require('../assets/game/sprite.png')
catSprite.src = require('../assets/game/cat.png')
sprite2.src = require('../assets/game/sprite_2.png')
sprite3.src = require('../assets/game/sprite_3.png')
medals.src = require('../assets/game/medal.png')
blueSky.src = require('../assets/game/sky.png')
sea.src = require('../assets/game/sea.png')
mount.src = require('../assets/game/mount.png')
clouds.src = require('../assets/game/clouds.png')
tileset.src = require('../assets/game/tileset.png')



const sfx = {
    point : new Audio( require('../assets/game/audio/sfx_point.wav') ),
    flap : new Audio( require('../assets/game/audio/sfx_flap.wav') ),
    swoosh : new Audio( require('../assets/game/audio/sfx_swooshing.wav') ),
    hit : new Audio( require('../assets/game/audio/sfx_hit.wav') ),
    die : new Audio( require('../assets/game/audio/sfx_die.wav') ),
    meow : [
        new Audio( require('../assets/game/audio/meow_1.wav')),
        new Audio( require('../assets/game/audio/meow_2.wav')),
        new Audio( require('../assets/game/audio/meow_3.wav')),
        new Audio( require('../assets/game/audio/meow_4.wav')),
        new Audio( require('../assets/game/audio/hiss.wav')),
    ] 
}
sfx.flap.volume = 0.05
sfx.meow.forEach(sound => sound.volume = 0.2)

const possibleStates = {
    getReady: 0,
    gameStarted: 1,
    gameOver: 2
}

let cvs = {
    width : 320,
    height : 480
}

const background = {
    props : {
        sea :    { x : 0, dx : 1 },
        clouds : { x : 0, dx : 0.4 },
        mount : { x : 0, dx : 0.2 },
    },
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    dx: 1,
    y: cvs.height - 226,
    draw: function(ctx){
        
        // sky
        ctx.drawImage(blueSky, 0,0, blueSky.width, blueSky.height, 0, 0, cvs.width, cvs.height)

        
        // mountains
        ctx.drawImage(mount, 0,0, mount.width, mount.height, this.props.mount.x, 0, mount.width, mount.height)
        ctx.drawImage(mount, 0,0, mount.width, mount.height, this.props.mount.x + mount.width - 1 , 0, mount.width, mount.height)

        ctx.fillStyle = '#8cb2e8'
        ctx.fillRect(0,mount.height,cvs.width, 60)

        //clouds
        ctx.drawImage(clouds, 0,0, clouds.width, clouds.height, this.props.clouds.x, 160, clouds.width, clouds.height)
        ctx.drawImage(clouds, 0,0, clouds.width, clouds.height, this.props.clouds.x + clouds.width - 1, 160, clouds.width, clouds.height)


        
        // sea
        ctx.drawImage(sea, 0,0, sea.width, sea.height, this.props.sea.x, cvs.height - 170, sea.width, sea.height)
        ctx.drawImage(sea, 0,0, sea.width, sea.height, this.props.sea.x + (sea.width), cvs.height - 170, sea.width, sea.height)
        ctx.drawImage(sea, 0,0, sea.width, sea.height, this.props.sea.x + (2 * sea.width), cvs.height - 170, sea.width, sea.height)
        ctx.drawImage(sea, 0,0, sea.width, sea.height, this.props.sea.x + (3 * sea.width), cvs.height - 170, sea.width, sea.height)




        // moving bg illusion
        if(state.value.current === possibleStates.gameStarted){
            this.props.sea.x = this.props.sea.x <= - (sea.width) ? 0 : this.props.sea.x - this.props.sea.dx // sea
            this.props.clouds.x = this.props.clouds.x <= - (clouds.width) ? 0 : this.props.clouds.x - this.props.clouds.dx // sea
            this.props.mount.x = this.props.mount.x <= - (mount.width) ? 0 : this.props.mount.x - this.props.mount.dx // sea
        }
    },
    reset: function(){
        this.x = 0;
    }
}

const foreground = {
    sX: 457,
    sY: 0,
    sW : 260, sH: 87,
    w: 260 * 1.2, h: 87 * 1.2,
    x: 0,
    y: cvs.height - (87 * 1.2),
    dx: 2,
    draw: function(ctx){ 
        ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x, this.y, this.w , this.h)
        ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x + this.w, this.y, this.w, this.h)
        ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x + (2*this.w), this.y, this.w, this.h)

        // moving fg illusion
        if(state.value.current === possibleStates.gameStarted){
            this.x = this.x <= -this.w ? 0 : this.x - this.dx
        }
    },
    reset: function() {
        this.x = 0
    } 

}

const foregroundNew = {
    sX: 457,
    sY: 0,
    sW : 260, sH: 87,
    w: 260 * 1.2, h: 87 * 1.2,
    x: 0,
    y: cvs.height - (87 * 1.2),
    dx: 2,
    draw: function(ctx){ 
        ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x, this.y, this.w , this.h)
        ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x + this.w, this.y, this.w, this.h)
        ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x + (2*this.w), this.y, this.w, this.h)

        // moving fg illusion
        if(state.value.current === possibleStates.gameStarted){
            this.x = this.x <= -this.w ? 0 : this.x - this.dx
        }
    },
    reset: function() {
        this.x = 0
    } 

}

const cat = {
    animation: [
        {sX: 0,  sY: 0},
        {sX: 47, sY: 0},
        {sX: 96, sY: 0},
        {sX: 47, sY: 0},
    ],
    x: 50, y: 150,
    sW: 40, sH: 32,
    w: 40 * 1.5, h: 32 * 1.5,
    radius: 12,
    frame: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    draw: function(ctx,frames){
        // console.log(frames)
        const kitty = this.animation[this.frame]

        ctx.drawImage(catSprite, kitty.sX, kitty.sY, this.sW, this.sH, this.x-this.sW/2, this.y-this.sH/2, this.w, this.h)

        // update flap animation
        if(state.value.current !== possibleStates.gameOver){
            let period = state.value.current == possibleStates.getReady ? 15 : 10
            this.frame += (frames % period) == 0 ? 1 : 0
            this.frame = this.frame % this.animation.length
        }
        // console.log(this.frame)
        // console.log(frames)
    },
    update: function(){
        if(state.value.current === possibleStates.getReady){
            this.y = 150;
        }else{
            
            this.speed += this.gravity
            this.y += this.speed

            let catBottom = this.y + (this.h/2)
            catBottom -= 7            //  to make it look more natural

            let groundPosition = cvs.height - foreground.h

            
            // prevent cat from clipping inside the ground
            if(catBottom >= groundPosition){
                this.y = groundPosition - (this.h/2) + 7
                if(state.value.current === possibleStates.gameStarted)
                {
                    console.log('grounded')
                    collisionTimestamp = performance.now()
                    sfx.hit.play().then(() => {
                        sfx.meow[Math.floor(Math.random() * sfx.meow.length)].play()
                    })

                }
                state.value.current = possibleStates.gameOver
                
            }
        }
    },
    flap: function(){
        let catTop = this.y - (this.h/2)
        if(catTop > 0){
            this.speed = - this.jump
            sfx.flap.play()
        }
    },
    reset: function(){
        this.speed = 0
        this.y = 150
    }
}

let collisionTimestamp = -1
const pipes = {
    positions : [],
    top:{
        sX: 112,
        sY: 646
    },
    bottom:{
        sX: 168,
        sY: 646
    },
    w: 52, h: 319,
    wB: 52, hB: 319, 
    gap: 95,
    maxYPos: -150,
    dx: 2,

    draw : function(ctx){
        this.positions.forEach(pos => {
            let topYPos = pos.y
            let bottomYPos = topYPos + this.h + this.gap
            
            ctx.drawImage(sprite2, this.top.sX, this.top.sY, this.w, this.h, pos.x, pos.y, this.w, this.h)
            ctx.drawImage(sprite2, this.bottom.sX, this.bottom.sY, this.wB, this.hB, pos.x, bottomYPos, this.wB, this.hB)
        })
    },
    update : function(frames){
        if(state.value.current !== possibleStates.gameStarted)  return;

        // add new pipe every 100 frames
        if(frames % 100 === 0){
            this.positions.push({
                x: cvs.width,
                y: this.maxYPos * ( Math.random() + 1),
                crossed : false
            })
        }
        
        // move existing pipes to the left by dx every frame 
        this.positions.forEach(pos => {
            pos.x -= this.dx
            // console.log(this.positions.length)
            // if pipes left beyond the canvas, remove them

            if(pos.x + this.w <= 0){
                this.positions.shift()
            }

            // collision detection
            const   catTop = cat.y - cat.radius,     catBottom = cat.y + cat.radius,
                    catFront = cat.x + cat.radius,   catBack = cat.x - cat.radius     
            const topPipeHitY = pos.y + this.h
            const bottomPipeHitY = pos.y + this.h + this.gap

            if( catFront >  pos.x && catBack < (pos.x + this.w) && (catTop < topPipeHitY || catBottom > bottomPipeHitY) ){
                console.log('collision!')
                collisionTimestamp = performance.now()
                sfx.hit.play().then(() => {
                    sfx.meow[Math.floor(Math.random() * sfx.meow.length)].play()
                })
                state.value.current = possibleStates.gameOver
            }
        
            // increase score immediately after crossing a pipe
            if(pos.x + this.w < catBack && !pos.crossed){
                    pos.crossed = true
                    console.log('crossed')
                    score.latestScore += 1
                    sfx.point.play()
                    score.bestScore = Math.max(score.latestScore, score.bestScore)
            }

        })
        // console.log(this.positions.length);
    },
    reset : function(){
        this.positions = []
    }

}

const score = {
    bestScore: localStorage.getItem("BEST_SCORE") || 0,
    latestScore: 0,
    medalScores : {
        gold: -1,
        silver: -1,
        bronze: -1
    },
    draw: function(ctx){
        ctx.fillStyle = '#eafcdb'
        ctx.strokeStyle = '#000'
        if(state.value.current === possibleStates.gameStarted){
            ctx.lineWidth = 2;
            ctx.font = "35px Finger Paint"
            ctx.fillText(this.latestScore, cvs.width/2, 50 )
            // ctx.strokeText(this.latestScore, cvs.width/2, 50 )
        }else if(state.value.current === possibleStates.gameOver){
            ctx.lineWidth = 2;
            ctx.font = "25px Finger Paint"
            ctx.fillText(this.latestScore, 225, 235 )
            // ctx.strokeText(this.latestScore, 225, 235 )
            ctx.fillText(this.bestScore, 220, 280 )
            // ctx.strokeText(this.bestScore, 220, 280 )

            this.bestScore = Math.max(this.latestScore, this.bestScore)
            localStorage.setItem("BEST_SCORE", this.bestScore)
        }
    }
}

const drawHighScores = (ctx) => {
    const medalWidth = medals.width / 3
    const scalar = 0.3
    ctx.fillStyle = '#eafcdb'
    ctx.lineWidth = 2;
    ctx.font = "22px Finger Paint"
    const medalTypes = ['gold','silver','bronze']

    for(let i=0;i<medalTypes.length;i++){
        ctx.drawImage(medals, medalWidth * i, 0, medalWidth, medals.height,
                        10, cvs.height - 80 + (25 * i), medalWidth * scalar, medals.height * scalar)
        if( score.medalScores[medalTypes[i]] !== -1 )
            ctx.fillText(score.medalScores[medalTypes[i]], 10 + (medalWidth * scalar) + 5,  cvs.height - 80 + (25 * i) + 20)
    }
}

const getReadyMessage = {
    pos : {
        getReadyMessage : { offY: 0,  sH: 40 },
        tapTap          : { offY: 40 + 40, sH: 80 }
    },
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width/2 - 173/2,
    y: cvs.height/2 - 152/2,
    draw: function(ctx){ 
        // ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        if (state.value.current !== possibleStates.getReady) return;
        const catPos = { offY: 50, sH: 40 }
        Object.values(this.pos).forEach((p) =>{
            ctx.drawImage(sprite, this.sX, this.sY + p.offY, this.w, p.sH, 
                this.x, this.y + p.offY, this.w, p.sH)     
        })
        ctx.drawImage(catSprite, 0, 0, 48, 32, 
            cvs.width/2 - 48/2 + 5, this.y + catPos.offY, 48, 32)
        drawHighScores(ctx)

    } 
}

const gameOverMessage = {
    pos : {
        GOtext      : { offY: 0,  sH: 40 },
        score       : { offY: 40, sH: 120 },
    },
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width/2 - 225/2,
    y: cvs.height/2 - 202/2,
    draw: function(ctx){ 
        const startBtnPos = { offY: 40 + 120, sH: 50, scalar: 1.2 }
        Object.values(this.pos).forEach((p) =>{
            ctx.drawImage(sprite, this.sX, this.sY + p.offY, this.w, p.sH, 
                this.x, this.y + p.offY, this.w, p.sH)     
        })

        // start button
        const currentTimestamp = performance.now()
        // console.log(currentTimestamp - collisionTimestamp )
        if( state.value.primaryController !== 'Keyboard' || currentTimestamp - collisionTimestamp > 1000 ){
            ctx.drawImage(sprite, this.sX, this.sY + startBtnPos.offY, this.w, startBtnPos.sH, 
                cvs.width/2 - (this.w * startBtnPos.scalar / 2), this.y + startBtnPos.offY, 
                this.w * startBtnPos.scalar, startBtnPos.sH * startBtnPos.scalar)  
        }

        // console.log(score.latestScore, score.bestScore)
        // ctx.fillRect(110,310,100,37)

        
        const medal ={
            GOLD : 0, SILVER: 1, BRONZE: 2,
            offX : 20, offY: 80,
        }

        let medalWon = null
        if(score.latestScore >= score.medalScores.gold){
            medalWon = medal.GOLD
            sendScoreToFirebase('gold', score.latestScore)
        }else if( score.latestScore >= score.medalScores.silver ){
            medalWon = medal.SILVER    
            sendScoreToFirebase('silver', score.latestScore)
        }else if( score.latestScore >= score.medalScores.bronze ){
            medalWon = medal.BRONZE   
            sendScoreToFirebase('bronze', score.latestScore)
        }
        
        const medalWidth = medals.width / 3
        if(medalWon !== null){
            // console.log('drawing medal')
            ctx.drawImage(medals, medalWidth * medalWon, 0, medalWidth, medals.height,
                            this.x + medal.offX, this.y + medal.offY, medalWidth * 0.6, medals.height * 0.6)  
        }
        drawHighScores(ctx)
    } 
}

// use ctx.fillRect(110,310,100,37) to find correct positions 
const startBtn = {
    x: 110,
    y: 310,
    w: 100,
    h: 37,
}

const isTapInsideBoundary = (evt,canvas) => {
    let restartRect = canvas.getBoundingClientRect();
    let clickX = evt.clientX - restartRect.left
    let clickY = evt.clientY - restartRect.top

    return ( clickX >= startBtn.x && clickX <= (startBtn.x + startBtn.w) 
            && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h)
}


// Firebase Call
const fluffyCollection = fireDB.collection('fluffy_cat')
let lastUpdate = { medalType : '', score : 0 }
let updateInProgress = false

function sendScoreToFirebase(medalType, newScore){
    if (!initialHSFetch) return;
    if ( updateInProgress ||  (medalType === lastUpdate.medalType && newScore === lastUpdate.score)) return; 
    if ( score.medalScores[medalType] > newScore ){
        alert(`tried to update ${medalType} highscore from ${score.medalScores[medalType]} to ${newScore}. Screenshot and send to developer.`)
        return;
    }

    // console.log('in firestore')
    // console.log(lastUpdate, medalType, score)
    // lastUpdate = { medalType, score }

    updateInProgress = true
    fluffyCollection.doc("medalScores").update({[medalType] : newScore}).then( (status) => {
      // console.log(status)
      console.log('data sent to firestore',medalType,newScore)
      lastUpdate = { medalType, score: newScore }
      updateInProgress = false
      getHighScores()
    }).catch((error) => {
        console.error("Error updating high score: ", error);
        updateInProgress = false
    });
}


function getHighScores(){
    fluffyCollection.doc("SF").get()

    fluffyCollection.doc("medalScores").get().then( (doc) => {
        if (doc.exists) {
          console.log("High Scores:", doc.data());
          score.medalScores = doc.data()
          initialHSFetch = true
        //   console.log(score.medalScores)
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting highscores:", error);
      });
}
getHighScores()

setTimeout(() => {
    // do something onMounted
    // sendScoreToFirebase('gold', 25)

},5000)

export {
    sprite,
    state,
    possibleStates,
    background,
    foreground,
    cat,
    pipes,
    score,
    sfx,
    isTapInsideBoundary,
    getReadyMessage,
    gameOverMessage,
    getHighScores,
    foregroundNew,
    collisionTimestamp,
}