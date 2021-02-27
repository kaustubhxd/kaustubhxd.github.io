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

const windows = ref({
    'skills' : {
        title       :   'Skills',
        minimized   :   false,
        active      :   false,
        position    :   [0,0],
        stuckToSide :   false,
        maximized   :   false,
    },
    'who' : {
        title       :   'Who?',
        minimized   :   false,
        active      :   true,
        position    :   [0,0],
        stuckToSide :   false,
        maximized   :   false,
    },    
    'projects' : {
        title       :   'Projects',
        minimized   :   false,
        active      :   false,
        position    :   [0,0],
        stuckToSide :   false,
        maximized   :   false,
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
        windows.value[window].minimized = true
    }else if(state == 'open' && !windows.value[window].active){
        windows.value[window].active = true
    }else if(state == 'restore'){
        windows.value[window].minimized = false
    }
}

export {
    ripple,
    windows,
    setWindowState,
    dockStyle
}

