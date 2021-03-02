<template>
    <span :class="{ 'deviceHasHover' : !isDeviceSmartPhone  }">
        <li >
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
    </span>
</template>

<script>
import { ref } from 'vue'
import {windows,setWindowState} from '../store/state'
import {isSmartPhone} from '../assets/scripts'

export default {
    props: ['name','id','icon'],

    setup(props){
        const info = ref(windows.value[props.id])
        const isDeviceSmartPhone = isSmartPhone()

        // vue + WEBPACK introduces the additional atrocity of using require
        // for something as basic as pointing to an asset location 
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

        const dockHovering = ref(false)

        console.log(info.value.minimized)

        return {
            props,
            info,
            icon,
            shakeDock,
            toggleShake,
            setWindowState,
            handleClick,
            dockHovering,
            isDeviceSmartPhone
        }
    },
}
</script>

<style lang='scss'>

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

.dock-element{
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
}

.dock-dot{
    align-self          :   center;
    height              :   6px;
    width               :   6px ;
    border-radius       :   50% ;
    margin              :   2px 3px 2px 2px;
    box-shadow          :   30px 29px 120px -33px rgba(0,0,0,0.56);
    display             :   none ;

    transition          :   opacity 0.6s,
                            background-color 0.6s ease;
}


li {
	list-style-type: none;
	display: inline-block;
	position: relative;
}

li img {
	width: 64px;
	height: 64px;
	/* -webkit-box-reflect: below 2px gradient(linear, left top, left bottom, from(transparent), color-stop(0.7, transparent), to(rgba(255, 255, 255, .5))); */
	transform-origin: 50% 100%;
	transition: all 0.3s;
}

// https://stackoverflow.com/a/30303898
.deviceHasHover li:hover img {
	transform: scale(1.8);
	margin: 0 2em;
}


.deviceHasHover li:hover+li img,
li.prev img {
	transform: scale(1.4);
	margin: 0 1.5em;
}

/* tooltip */
li span {
	display: none;
	position: absolute;
	bottom: 140px;
	left: 0;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.75);
	padding: 4px 0;
	border-radius: 12px;
}

.deviceHasHover li:hover span { 
	display: block;
	color: #fff;
}

.shake-dock {
    animation: shake 0.5s;
    animation-iteration-count: 0.3s;
  }
  
  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }

</style>