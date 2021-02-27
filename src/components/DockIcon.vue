<template>
    <li>
    <span>{{props.name}}</span>
    <a id = "element" href="#" class = "dock-element"
      :class = "{ 'shake-dock' : shakeDock }"
      @animationend="shakeDock = false"
      @mouseup="handleClick()"
    >
    
        <img :src = "icon"  >

    <div    
        class = "dock-dot" 
        id="dot"  
        :class="{ 'dot-min' : info.minimized, 'dot-active': (info.active && !info.minimized) }" >
    </div></a>

    </li>
</template>

<script>
import { ref } from 'vue'
import {windows,setWindowState} from '../store/state'

export default {
    props: ['name','id','icon'],

    setup(props){
        const info = ref(windows.value[props.id])

        const icon = require('@/assets/icons/' + props.icon )

        const shakeDock = ref(false)

        function toggleShake(boolean){
            shakeDock.value = boolean;
        }

        function handleClick(){
            if(info.value.minimized){
                setWindowState(props.id,'restore')
            }else if(!info.value.minimized && info.value.active){
                setWindowState(props.id,'minimized')
            }else if (!info.value.active){
                shakeDock.value = true
                setWindowState(props.id,'open')
            }
        }






        return {
            props,
            info,
            icon,
            shakeDock,
            toggleShake,
            setWindowState,
            handleClick
        }
    },
}
</script>

<style lang='scss' scoped>
#dot{
    display :   block ;
}

.dot-min{
    opacity: 1;
    background: white;
}

.dot-active{
    opacity: 1;
    background: coral;
}

</style>