<template>
<div id="dock-container" ref='dockElement'>
<div id="dock">
    <ul>
        <DockIcon name='Skills' id='skills' icon="skills.svg"/>
        <DockIcon name='Who?' id='who' icon="who.svg"/>
        <DockIcon name='Projects' id='projects' icon="projects.svg" />
    </ul>
</div>
</div> 
</template>

<script>
import DockIcon from './DockIcon'
import {dockStyle} from '../store/state'
import { onMounted, ref } from 'vue'

export default {
    components: {DockIcon },
    setup(){
        
        const dockElement = ref(null)

        onMounted(() => {
            function reportResize() {
                dockStyle.value.width   = dockElement.value.offsetWidth
                dockStyle.value.height  = dockElement.value.offsetHeight
                dockStyle.value.top     = dockElement.value.offsetTop
                dockStyle.value.left    = dockElement.value.offsetLeft
            }
            reportResize()

            new ResizeObserver(reportResize).observe(dockElement.value)


        })

        return{
            dockElement        
        }
    }


}
</script>

<style lang='scss'>

#dock-container {
    z-index: 12;
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

    #dock{
        align-items: flex-start;
        display: flex;
        flex-direction: row;
        width: max-content;
    }
}



#dock-container li {
	list-style-type: none;
	display: inline-block;
	position: relative;
}

#dock-container li img {
	width: 64px;
	height: 64px;
	/* -webkit-box-reflect: below 2px gradient(linear, left top, left bottom, from(transparent), color-stop(0.7, transparent), to(rgba(255, 255, 255, .5))); */
	transform-origin: 50% 100%;
	transition: all 0.3s;
}

#dock-container li:hover img {
	transform: scale(1.8);
	margin: 0 2em;
}

#dock-container li:hover+li img,
#dock-container li.prev img {
	transform: scale(1.4);
	margin: 0 1.5em;
}

/* tooltip */
#dock-container li span {
	display: none;
	position: absolute;
	bottom: 140px;
	left: 0;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.75);
	padding: 4px 0;
	border-radius: 12px;
}

#dock-container li:hover span { 
	display: block;
	color: #fff;
}

.dock-element{
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
}

.dock-dot{
    background          :   floralwhite;
    align-self          :   center;
    height              :   6px;
    width               :   6px ;
    border-radius       :   50% ;
    margin              :   2px 3px 2px 2px;
    box-shadow          :   30px 29px 120px -33px rgba(0,0,0,0.56);
    display             :   none ;

    opacity             :   0;
    transition          :   opacity 0.6s,
                            background-color 0.6s ease;
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