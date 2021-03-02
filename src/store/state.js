import {ref} from 'vue'

const dockStyle = ref({
    top     :   0,
    left    :   0,
    width   :   0,
    height  :   0,
})

const ripple = ref({
    active  :   false,
    top     :   100,
    left    : 100,
})

const ZIndexMax = ref(10);

const windows = ref({
    'skills' : {
        title       :   'Skills',
        minimized   :   false,
        active      :   false,
        position    :   [0,0],
        stuckToSide :   false,
        maximized   :   false,
        zIndex      :   1,
        width   :   window.innerWidth  * (3/8),
        height  :   window.innerHeight  * (8/13),
        opacity :   1,
        top     :   Math.floor(Math.random() * ((window.innerHeight - (window.innerHeight  * (8/13) + 100)) - 100) + 100),
        left    :   Math.floor(Math.random() * ((window.innerWidth - (window.innerWidth  * (3/8) + 100)) - 100) + 100),
    },
    'who' : {
        title       :   'Who?',
        minimized   :   false,
        active      :   true,
        position    :   [0,0],
        stuckToSide :   false,
        maximized   :   false,
        zIndex      :   1,
        width   :   window.innerWidth  * (3/8),
        height  :   window.innerHeight  * (8/13),
        opacity :   1,
        top     :   Math.floor(Math.random() * ((window.innerHeight - (window.innerHeight  * (8/13) + 100)) - 100) + 100),
        left    :   Math.floor(Math.random() * ((window.innerWidth - (window.innerWidth  * (3/8) + 100)) - 100) + 100),
    },    
    'projects' : {
        title       :   'Projects',
        minimized   :   false,
        active      :   false,
        position    :   [0,0],
        stuckToSide :   false,
        maximized   :   false,
        zIndex      :   1,
        width   :   window.innerWidth  * (3/8),
        height  :   window.innerHeight  * (8/13),
        opacity :   1,
        top     :   Math.floor(Math.random() * ((window.innerHeight - (window.innerHeight  * (8/13) + 100)) - 100) + 100),
        left    :   Math.floor(Math.random() * ((window.innerWidth - (window.innerWidth  * (3/8) + 100)) - 100) + 100),
    },
})

function setWindowState(window,state){
    if (state == 'maximized'){
        windows.value[window].maximized = true
        windows.value[window].stuckToSide = false
    }else if (state == 'stuckToSide'){
        windows.value[window].maximized = false
        windows.value[window].stuckToSide = true
    }else if (state == 'normal'){
        windows.value[window].maximized = false
        windows.value[window].stuckToSide = false
    }else if (state == 'killed'){
        windows.value[window].active        = false
        windows.value[window].minimized     = false
        windows.value[window].maximized     = false
        windows.value[window].stuckToSide   = false
    }else if(state == 'minimized'){
        windows.value[window].zIndex = 1
        windows.value[window].minimized = true
    }else if(state == 'open' && !windows.value[window].active){
        windows.value[window].zIndex = ZIndexMax.value + 1
        ZIndexMax.value += 1
        windows.value[window].active = true
    }else if(state == 'restore'){
        windows.value[window].minimized = false
    }
}

export {
    ripple,
    windows,
    setWindowState,
    dockStyle,
    ZIndexMax
}

