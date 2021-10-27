


const sprite = new Image()
const catSprite = new Image()
const sprite2 = new Image()
const sprite3 = new Image()
// const blueSky = new Image()
const sea = new Image()
const mount = new Image()
const clouds = new Image()
const tileset = new Image()
const offline = new Image()
const medals = {
    0 : new Image(),
    1 : new Image(),
    2 : new Image(),
    3 : new Image(),
}

sprite.src = require('../assets/game/sprite.png')
catSprite.src = require('../assets/game/cat.png')
sprite2.src = require('../assets/game/sprite_2.png')
sprite3.src = require('../assets/game/sprite_3.png')
// blueSky.src = require('../assets/game/sky.png')
sea.src = require('../assets/game/sea.png')
mount.src = require('../assets/game/mount.png')
clouds.src = require('../assets/game/clouds.png')
tileset.src = require('../assets/game/tileset.png')
medals[0].src = require('../assets/game/medals/0.png')
medals[1].src = require('../assets/game/medals/1.png')
medals[2].src = require('../assets/game/medals/2.png')
medals[3].src = require('../assets/game/medals/3.png')
offline.src = require('../assets/game/offline.png')



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


export {
    sprite,
    catSprite,
    sprite2,
    sprite3,
    medals,
    sea,
    mount,
    clouds,
    tileset,
    sfx,
    offline
}