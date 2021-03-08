<template>
<div id="dock-container" ref='dockElement' :style="{bottom: dockBottom + 'px',opacity: dockBottom < 0 ? 0:1  }">
<div id="dock">
    <ul>
        <DockIcon name='Skills' id='skills' icon="skills.svg"/>
        <DockIcon name='Who?' id='who' icon="who.svg"/>
        <DockIcon name='Projects' id='projects' icon="projects.svg" />
        <DockIcon name='Hire Me' id='contact' icon="talk.svg" />
    </ul>
</div>
</div> 
</template>

<script>
import DockIcon from './DockIcon'
import {dockStyle} from '../store/state'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {windows} from '../store/state'

export default {
    components: {DockIcon },
    setup(){

        var dockBottom = computed(() => (Object.entries(windows.value).filter(([k,v]) => v.maximized && !v.minimized)).length ? -90:0)

        // console.log(isAnyWindowFullScreen.value)
        
        const dockElement = ref(null)
        var resizeObserver

        // ResizeObserver (in onMounted) observes the change in dock shape
        // see how window minimize transition works to get why we do it here
        function reportResize() {
            console.log('dock resize triggered')
            if(dockElement.value){
                dockStyle.value.width   = dockElement.value.offsetWidth
                dockStyle.value.height  = dockElement.value.offsetHeight
                dockStyle.value.top     = dockElement.value.offsetTop
                dockStyle.value.left    = dockElement.value.offsetLeft
            }
        }

        onMounted(() => {
            reportResize()
            resizeObserver = new ResizeObserver(reportResize)
            resizeObserver.observe(dockElement.value)
            window.addEventListener('resize', reportResize);
        })

        onBeforeUnmount(() =>{
            resizeObserver.disconnect()
            window.removeEventListener('resize', reportResize);
            console.log('docker unmounted')
        })

        return{
            dockElement,
            dockBottom 
        }
    }


}
</script>

<style lang='scss'>

#dock-container {
    z-index: 9999;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    margin: 0 auto;
    text-align: center;
    font-size: large;
    padding     : 0 5px;
    
	background: rgba(255, 255, 255, 0.2);
    border-radius: 10px 10px 0 0;
    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);


    #dock{
        align-items: flex-start;
        display: flex;
        flex-direction: row;
        width: max-content;
    }
}

@keyframes bounceIn { 
    0% { transform: scale(0.1); opacity: 0; } 
    60% { transform: scale(1.2); opacity: 1; } 
    100% { transform: scale(1); } 
}
</style>