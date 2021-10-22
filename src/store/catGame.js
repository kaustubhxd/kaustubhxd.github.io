
import {ref} from 'vue'
import {fireDB} from '../scripts/firebase'
import { sprite, catSprite, sprite2, sprite3, sea, mount, clouds, tileset, medals, sfx } from './catData'

import hash from 'object-hash'



const state = ref({
    current: 0,
    primaryController : '',
    gameOverState: 0,
    nameInputRef: null,
    showNameInput : false
})

let PLAYER_NAME = localStorage.getItem("PLAYER_NAME") || "ABCDEF"

let scoreboard = {
    1 : { name: "ABCDEF", score: 0 },
    2 : { name: "ABCDEF", score: 0 },
    3 : { name: "KASMCG", score: 0 },
    4 : { name: "VSCSRT", score: 0 },
    5 : { name: "SFXSFH", score: 0 },
    6 : { name: "RGSCXS", score: 0 },
    7 : { name: "RSGBXC", score: 0 },
    8 : { name: "WRXGRH", score: 0 },
    9 : { name: "ERGCST", score: 0 },
    10 : { name: "EFCXSD", score: 0 },
}

let initialRankingFetchDone = false

const possibleStates = {
    getReady: 0,
    gameStarted: 1,
    gameOver: 2
}

const possibleGameOverStates = {
    inactive : 0,
    active : 1,
    highScores : 2
}

let cvs = {
    width : 320,
    height : 480
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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
        ctx.fillStyle =  '#a1f2ec'
        ctx.fillRect(0, 0, cvs.width, cvs.height)

        
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
        
        ctx.fillStyle = '#71baaa'
        ctx.fillRect(0,(cvs.height - 170) + sea.height, cvs.width, cvs.height)

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
    tiles : {
        start : { x:36, y:177, w:91, h: 110 },
        usual : { x:306 + 4, y:186, w:29 - 4, h: 21 },
    },
    sX: 457,
    sY: 0,
    sW : 260, sH: 87,
    w: 260 * 1.2, h: 87 * 1.2,
    x: 0,
    y: cvs.height - (87 * 1.2),
    dx: 2,
    draw: function(ctx){ 
        // ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x, this.y, this.w , this.h)
        // ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x + this.w, this.y, this.w, this.h)
        // ctx.drawImage(sprite3, this.sX, this.sY, this.sW, this.sH, this.x + (2*this.w), this.y, this.w, this.h)
        
        const startTile = this.tiles.start
        const usualTile = this.tiles.usual

        ctx.drawImage(tileset, startTile.x, startTile.y, startTile.w,startTile.h, 
            this.x, cvs.height - startTile.h, startTile.w,startTile.h)
        // ctx.drawImage(tileset, usualTile.x, usualTile.y, usualTile.w,usualTile.h, 
        //     this.x + startTile.width, cvs.height - usualTile.h, usualTile.w,usualTile.h)
                
        let usualTileTotalW = 0
        for(let i=0; i<10; i++){
            ctx.drawImage(tileset, usualTile.x, usualTile.y, usualTile.w,usualTile.h, 
                this.x + startTile.w + (i * usualTile.w), cvs.height - startTile.h + 9, usualTile.w,usualTile.h)
            ctx.fillStyle = '#112024'
            // ctx.fillRect(startTile.w + (i * usualTile.w), cvs.height - startTile.h + usualTile.h + 9, 
            //                 this.x + usualTile.w, startTile.h - usualTile.h)    // debug
            usualTileTotalW += cvs.height - startTile.h + 9
        }
        
        // moving fg illusion
        if(state.value.current === possibleStates.gameStarted){
            startTile.x = startTile.x + this.dx 
            usualTile.x = usualTile.x <= -(usualTile.w) ? 0 : usualTile.x - this.dx   // usual tile 
            
            // this.props.sea.x = this.props.sea.x <= - (sea.width) ? 0 : this.props.sea.x - this.props.sea.dx // sea

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
        // console.log(this.speed)
        if(state.value.current === possibleStates.getReady){
            this.y = 150;
        }else {
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
                    state.value.gameOverState = possibleGameOverStates.active
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
                state.value.gameOverState = possibleGameOverStates.active
                collisionTimestamp = performance.now()
                sfx.hit.play().then(() => {
                    sfx.meow[Math.floor(Math.random() * sfx.meow.length)].play()
                })
                state.value.current = possibleStates.gameOver
            }
        
            // increase score immediately after crossing a pipe
            if(pos.x + this.w < catBack && !pos.crossed){
                    pos.crossed = true
                    // console.log('crossed')
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
    medalWon : null,
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
            ctx.fillStyle = 'black'
            ctx.font = "35px BitMicro"
            ctx.fillText(this.latestScore, cvs.width/2, 50 )
            // ctx.strokeText(this.latestScore, cvs.width/2, 50 )
        }else if(state.value.current === possibleStates.gameOver){
            if(state.value.gameOverState === possibleGameOverStates.active){
                ctx.lineWidth = 2;
                ctx.fillStyle = '#f98e66'
                ctx.font = "30px BitMicro"
                ctx.fillText(this.latestScore, 225, 235 )
                // ctx.strokeText(this.latestScore, 225, 235 )
                ctx.fillText(this.bestScore, 220, 280 )
                // ctx.strokeText(this.bestScore, 220, 280 )
            }

            if(this.bestScore > localStorage.getItem("BEST_SCORE")){
                this.bestScore = Math.max(this.latestScore, this.bestScore)
                localStorage.setItem("BEST_SCORE", this.bestScore)
            }
        }
    }
}

const drawTopThree = (ctx) => {
    const medalWidth = medals[0].width / 3
    const scalar = 0.3
    ctx.fillStyle = '#eafcdb'
    ctx.lineWidth = 2;
    ctx.font = "22px Finger Paint"
    const medalTypes = ['gold','silver','bronze']

    for(let i=0;i<medalTypes.length;i++){
        ctx.drawImage(medals[0], medalWidth * i, 0, medalWidth, medals[0].height,
                        10 + i, cvs.height - 80 + (25 * i), medalWidth * scalar, medals[0].height * scalar)
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
        drawTopThree(ctx)

    } 
}

const drawHighScoreBoard = (ctx) => {
    const xpos = gameOverMessage
    // console.log(cvs.height)

    ctx.drawImage(sprite2, 6, 518 , 232 - 6, 10,            // top
        xpos.x, 95 , xpos.w, 10)   
    ctx.drawImage(sprite2, 6, 518 + 10 , 232 - 6, 90,            // middle
        xpos.x, 95 + 10, xpos.w, 90)  
    ctx.drawImage(sprite2, 6, 518 + 10 , 232 - 6, 90,            // middle
        xpos.x, 95 + 10 + 90, xpos.w, 90)   
    ctx.drawImage(sprite2, 6, 518 + 10 , 232 - 6, 90,            // middle
        xpos.x, 95 + 10 + 90 + 90, xpos.w, 90)     
    ctx.drawImage(sprite2, 6, 518 + 105 , 232 - 6, 10,            // bottom
        xpos.x, 95 + 10 + 90 + 90 + 90, xpos.w, 10)     

    ctx.fillStyle = '#ded895'
    ctx.fillRect(xpos.x + 10, 95 + 10, 232 - 6 - 30, 290 - 20 )

    ctx.fillStyle = '#f98e66'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1.5;
    ctx.font = "22px BitMicro"

    const vertLineSpacing = 27 
    for(let i=1;i<=10;i++){
        ctx.fillText(`${i}.`, xpos.x + 10 + 10, 95 + 10 + 20 + ((i-1) * vertLineSpacing))
        // ctx.strokeText(`${i+1}.`, xpos.x + 10 + 10, 95 + 10 + 20 + (i * vertLineSpacing))


        ctx.fillText(scoreboard[i].name, xpos.x + 10 + 20 + 30, 95 + 10 + 20 + ((i-1) * vertLineSpacing))
        // ctx.strokeText(`DVDSDE`, xpos.x + 10 + 20 + 30, 95 + 10 + 20 + (i * vertLineSpacing))

        ctx.fillText(scoreboard[i].score, xpos.x + 10 + 20 + 90 + 60, 95 + 10 + 20 + ((i-1) * vertLineSpacing))
        // ctx.strokeText(`69`, xpos.x + 10 + 20 + 90 + 60, 95 + 10 + 20 + (i * vertLineSpacing))
    }

    // Ok button
    ctx.drawImage(sprite2, 923, 82 , 1004 - 923, 115 - 83,          
        cvs.width/2 - (77 * 1.2 /2), 400, 77 * 1.2, 32 * 1.2)  

}


const drawGameOverScreen = (ctx,frames) => {
    // game over text
    const xpos = gameOverMessage

    ctx.drawImage(sprite, xpos.sX, xpos.sY + xpos.pos.GOtext.offY, xpos.w, xpos.pos.GOtext.sH, 
        xpos.x, xpos.y + xpos.pos.GOtext.offY, xpos.w, xpos.pos.GOtext.sH)    

    // score board
    ctx.drawImage(sprite2, 6, 518, 232 - 6, 632 - 518, 
        xpos.x, xpos.y + xpos.pos.score.offY, xpos.w, xpos.pos.score.sH)   

    // start button
    const currentTimestamp = performance.now()
    const startBtn = xpos.pos.startBtn
    if( state.value.primaryController !== 'Keyboard' || currentTimestamp - collisionTimestamp > 1000 ){
        ctx.drawImage(sprite, startBtn.sX, startBtn.sY, startBtn.sW, startBtn.sH, 
            startBtn.x,startBtn.y, startBtn.w,startBtn.h)  
    }

    // view highscores button
    const hsBtn = xpos.pos.HSBtn
    ctx.drawImage(sprite2, 827,236,931 - 825,293 - 234,
        hsBtn.x, hsBtn.y,hsBtn.w,hsBtn.h )

    // console.log(score.latestScore, score.bestScore)
    //  debug
    // ctx.fillStyle = 'rgba(100,100,100,0.6'
    // ctx.fillRect(startBtn.x,startBtn.y,startBtn.w,startBtn.h)

    // CHECK IF THE SCORE IS IN THE TOP THREE. 
    const medal ={
        GOLD : 1, SILVER: 2, BRONZE: 3,
        offX : 20, offY: 80,
    }
    
    if(!fetchedScoresForThisInstance){
        fetchedScoresForThisInstance = true
        let lscore = score.latestScore
        let isRankingChanged = false
        getHighScores((scoreList) => {
            let newRankings = {...scoreList}
            for(let rank=1;rank<=10;rank++){
                if (lscore > scoreList[rank].score) {
                    for(let xrank=10;xrank>rank;xrank--){
                        newRankings[xrank] = newRankings[xrank - 1]
                    }
                    newRankings[rank] = { name : 'ABCDEF', score: lscore }
                    isRankingChanged = true
                    score.medalWon = rank === 1 ? medal.GOLD : rank === 2 ? medal.SILVER : rank === 3 ? medal.BRONZE : 4
                    console.log(score.medalWon ? score.medalWon : null)
                    break;
                }
            }
            if(isRankingChanged){
                sendRankingsToFirebase(newRankings)
            }
            const oldHash = hash.sha1(scoreList).slice(-5)
            const newHash = hash.sha1(newRankings).slice(-5)
            if(isRankingChanged){
                console.log('%c ✨ rankings changed!', 'background: #222; color: aquamarine')
                console.log('oldRankings', oldHash);
                console.log('newRankings', newHash)
            }else{
                console.log('rankings unchanged')
            }
        })
    }
    
    // every medal image has the same height and width
    const medalWidth = medals[0].width / 3
    const medalHeight = medals[0].height

    //testing 
    const TEST_MODE = false
    if (TEST_MODE) score.medalWon = medal.BRONZE

    // console.log(score.medalWon)
    if(TEST_MODE || score.medalWon !== null){
        // console.log('drawing medal')
        if(frames % 10 === 0) xpos.medalFrame = (xpos.medalFrame + 1) % 4
        // console.log(xpos.medalFrame)
        ctx.drawImage(medals[xpos.medalFrame], medalWidth * (score.medalWon - 1), 0, medalWidth, medalHeight,
                        xpos.x + medal.offX, xpos.y + medal.offY, medalWidth * 0.6, medalHeight * 0.6)  
    }

    drawTopThree(ctx)
}


const gameOverMessage = {
    pos : {
        GOtext      : { offY: 0,  sH: 40 },
        score       : { offY: 40, sH: 120 },
        startBtn    : { sX : 246, sY: 399, sW: 327 - 246, sH: 427 - 399, 
                            x: cvs.width/2 - (81 * 1.2 /2) + 40, y: cvs.height/2 - 202/2 + 40 + 130, w: (327 - 246) * 1.2, h:(427 - 399) * 1.2 },
        HSBtn      : {x : cvs.width/2 - ((104 * 0.6) / 2) - 60, y: 309,w : 104 * 0.6,h : 57 * 0.6}
    },
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width/2 - 225/2,
    y: cvs.height/2 - 202/2,
    medalFrame : 0,
    draw: function(ctx, frames){ 

        if( state.value.gameOverState === possibleGameOverStates.active ){
            drawGameOverScreen(ctx,frames)
            state.value.showNameInput = false
        }else if( state.value.gameOverState === possibleGameOverStates.highScores ){
            drawHighScoreBoard(ctx)
            state.value.showNameInput = true
            state.value.nameInputRef.focus()
            state.value.nameInputRef.style.top = `${106 + (27 * 3)}px`
        }

        // ctx.fillRect(hsBtn.x, hsBtn.y, hsBtn.w, hsBtn.h)      //test fill
    } 
}


const tappableIcons = {
    startBtn : 0,
    HSBtn   : 1,
}

const isTapInsideBoundary = (evt,canvas,expectedTap) => {
    let restartRect = canvas.getBoundingClientRect();
    let clickX = evt.clientX - restartRect.left
    let clickY = evt.clientY - restartRect.top

    let iconToTap = null
    const gameOverIcons = gameOverMessage.pos
    switch(expectedTap){
        case tappableIcons.startBtn:
            iconToTap = gameOverIcons.startBtn
            break;
        case tappableIcons.HSBtn:
            iconToTap = gameOverIcons.HSBtn
            break;
    }

    const isTapInside = ( clickX >= iconToTap.x && clickX <= (iconToTap.x + iconToTap.w) 
    && clickY >= iconToTap.y && clickY <= iconToTap.y + iconToTap.h )

    if(isTapInside) console.log(`tapped on ${getKeyByValue(tappableIcons,expectedTap)}`)
    
    if(iconToTap === gameOverIcons.startBtn && isTapInside){
        fetchedScoresForThisInstance = false
        score.medalWon = null
    }

    return (isTapInside)
}


// Firebase Call
const fluffyCollection = fireDB.collection('fluffy_cat')
let lastRankingsHash = null
let updateInProgress = false
let fetchedScoresForThisInstance = false

function sendRankingsToFirebase(newRankings){
    const newHash = hash.sha1(newRankings).slice(-5)
    console.log('old hash: ', lastRankingsHash)

    if (!initialRankingFetchDone) return;
    if ( updateInProgress ||  (lastRankingsHash === newHash)) return; 

    // console.log('SENT TO FIRESTORE: ', newHash)
    // return;

    updateInProgress = true
    fluffyCollection.doc("highScores").set(newRankings).then( (status) => {
        // console.log(status)
        console.log('%c ️‍🔥 data sent to firestore: ','background: #222; color: orange', newHash)
        lastRankingsHash = newHash
        updateInProgress = false
        getHighScores()
      }).catch((err) => {
          console.error("Error updating high score: ", err);
          updateInProgress = false
      });
}


function getHighScores(callback){
    fluffyCollection.doc("SF").get()

    fluffyCollection.doc("highScores").get().then( (doc) => {
        if (doc.exists) {
            const freshScores = doc.data()
            console.log("%c ⬇️ just fetched highscores:", 'background: #222; color: lightgoldenrodyellow', hash.sha1(freshScores).slice(-5));

            if(callback){
                callback(freshScores)
            }
            
            score.medalScores['gold'] = freshScores[1].score
            score.medalScores['silver'] = freshScores[2].score
            score.medalScores['bronze'] = freshScores[3].score

            scoreboard = freshScores
            initialRankingFetchDone = true
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

const resetHighScores = () => {
    fluffyCollection.doc("highScores").set(scoreboard).then( (status) => {
        console.log('reset scoreboard')
    }).catch((err) => {
          console.error("Error updating high score: ", err);
    });
}

resetHighScores()

setTimeout(() => {
    // do something onMounted
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
    tappableIcons,
    getReadyMessage,
    gameOverMessage,
    getHighScores,
    foregroundNew,
    collisionTimestamp,
    possibleGameOverStates,
}