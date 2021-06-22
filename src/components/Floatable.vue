<template>
    <div >
            <div :id=" `floatable-${props.id}`" class="floatable" ref="box"  
            :style="{ width : boxWidth + 'px', 
                        height : boxHeight + 'px',
                        left: boxLeft + 'px', 
                        top: boxTop + 'px',
                        opacity: boxOpacity,
                        zIndex: windowState.zIndex
                    }"
            :class="{ 'window-animate-minmax' : animateWindowMinMax, 'swashOut' : animateSwashOut }"
            @transitionend    ="animateWindowMinMax = false"    
            @transitioncancel ="animateWindowMinMax = false"   
            @animationend     ="animateSwashOut = false"
            @animationcancel   ="animateSwashOut = false"
            >
                <div id="title-bar" class="title-bar">
                        
                    <ActionButtons :name='props.title' :id='props.id' @maximize='maxWindow()' @close='closeWindow()'/>

                    <div class="tab-space" id = "tab-space"  
                    @mousedown.left="dragMouseDown"
                    @dblclick.left="maxWindow()">
                            <img class="spinner" v-if="!windowState.loaded" :src="require('../assets/gifs/' + 'spinner.png')">
                            <div class="box-title"><p> {{props.id}}</p></div>

                    </div>
                    
                </div>
                <smooth-scrollbar>
                <div id = "main-window" class="window">
                    <div class ="content">

                        <!-- <p>
                            {{boxHeightCustom}} {{boxWidthCustom}}
                            <br>
                            {{props.title}}
                            <br>
                            {{windowState}}

                            <br>{{dockStyle}}<br>


                            Systems theory says that a system can have properties that none of its underlying components have and could not have been predicted based on the parts. (An emergent property). 
                            Zooming in and looking at a bunch of hydrogen and oxygen they are just atoms doing whatever they do but you zoom out to find they make a glass of water and your like, Where did the wetness come from. 
                            It's an emergent property. Consciousness is an emergent property of a much larger system. Free will is probably a property of that system.
                        </p> -->
                            <!-- {{windowState.zIndex}}  -->


                        <Skills v-if="props.id == 'skills'" />
                        <Projects v-if="props.id == 'projects'"/>
                        <Who v-if="props.id == 'who'"/>
                        <Contact v-if="props.id == 'contact'"/>
                    </div>
                </div>
                </smooth-scrollbar>

            </div> 
    </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ActionButtons from '../components/ActionButtons'
import {ripple,windows,setWindowState,dockStyle,setWindowIndexMax} from '../store/state'
import Who from './Who'
import {isSmartPhone} from '../assets/scripts'
import {defineAsyncComponent} from 'vue'
import Loading from './Loading'

const Projects = defineAsyncComponent(() => import('./Projects'))
const Skills = defineAsyncComponent(() => import('./Skills'))
const Contact = defineAsyncComponent(() => import('./Contact'))

export default {
    components: {   ActionButtons,
                    Projects,
                    Skills,
                    Who,
                    Contact,
                    Loading
                },
    props: ['title','id'],
    setup(props){
        // https://dev.to/mandrewcito/vue-js-draggable-div-3mee

        console.log(props.id)
        const windowState = ref(windows.value[props.id])

        const boxWidth = ref(window.innerWidth  * (3/8))
        const boxHeight = ref(window.innerHeight  * (8/13))
        const boxTop = ref(Math.floor(Math.random() * ((window.innerHeight - (boxHeight.value + 100)) - 100) + 100))
        const boxLeft = ref(Math.floor(Math.random() * ((window.innerWidth - (boxWidth.value + 100)) - 100) + 100))
        const boxOpacity = ref(1)

        if(isSmartPhone()){
            boxWidth.value   =   (window.innerWidth * (7/8));
            boxHeight.value  =   (window.innerHeight * (10/13));
            boxTop.value     =   (window.innerHeight - boxHeight.value)/4;
            boxLeft.value    =   (window.innerWidth - boxWidth.value)/2;
        }
        
        const boxWidthCustom = ref(boxWidth.value)
        const boxHeightCustom = ref(boxHeight.value)
        

        const boxLeftCustom = ref(boxLeft.value)
        const boxTopCustom = ref(boxTop.value)

        const box = ref()
        const animateWindowMinMax = ref(false)

        var windowResizeObserver


       const positions = ref({
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }) 

        var ratioX;
        function dragMouseDown (event) {
            // console.log('click :',event)
            event.preventDefault()

            // set the z-index of window as max so the clicked windows pops on top 
            // so that when window comes from fullscreen/sticky mode to normal, the cursor has the window under it
            // setMaxIndex()
            setWindowIndexMax(props.id)
            

            // get the mouse cursor position at startup:
            positions.value.clientX = event.clientX
            positions.value.clientY = event.clientY
            document.onmousemove    = elementDrag
            document.onmouseup      = closeDragElement
        }

        // on mousemove 
        function elementDrag (event) {

            if(windowState.value.maximized || windowState.value.stuckToSide){
                
                ratioX = (event.clientX - boxLeft.value) / boxWidth.value
                // console.log(boxWidthCustom.value)
                // console.log(ratioX)

                boxWidth.value = boxWidthCustom.value
                boxHeight.value = boxHeightCustom.value

                console.log(boxWidthCustom.value,boxHeightCustom.value)
                console.log(event.clientX - (boxWidthCustom.value * ratioX))

                boxLeft.value = event.clientX - (boxWidthCustom.value * ratioX)
                console.log(boxLeft.value)
                setWindowState(props.id,'normal')
                console.log('normalized on drag')
            }else{

                event.preventDefault()
                positions.value.movementX = positions.value.clientX - event.clientX
                positions.value.movementY = positions.value.clientY - event.clientY
                positions.value.clientX = event.clientX
                positions.value.clientY = event.clientY

                // set the element's new position:
                boxTop.value    = (box.value.offsetTop - positions.value.movementY)
                boxLeft.value   = (box.value.offsetLeft - positions.value.movementX)      

            }
        }

        function closeDragElement (event) {
            document.onmouseup = null
            document.onmousemove = null

            let outOfBounds = false

            // stick left
            if  (boxLeft.value < 0)   
            {
                boxLeft.value = 0
                outOfBounds = true
                stickToSide('left')
            }
            // stick right
            else if(event.clientX >= (window.innerWidth - 1))
            {
                outOfBounds = true
                stickToSide('right')
            }  
            // maximize
            else if  (boxTop.value  < 0) {
                boxTop.value  = 0
                outOfBounds = true
                maxWindow()
            }
            // too far down
            else if  (boxTop.value > window.innerHeight) 
            {
                boxTop.value = window.innerHeight - (boxHeight.value / 3)
                outOfBounds = true
            }
  
            if(outOfBounds) {
                ripple.value.top  = event.clientY < 0 ? 0 : event.clientY >= window.innerHeight ? window.innerHeight : event.clientY
                ripple.value.left = event.clientX < 0 ? 0 : event.clientX >= window.innerWidth ? window.innerWidth : event.clientX
                ripple.value.active = true

            }
        }

        function maxWindow(){
            if(animateWindowMinMax.value == true)   animateWindowMinMax.value = false
            animateWindowMinMax.value = true

            if(boxWidth.value == window.innerWidth && boxHeight.value == window.innerHeight ){
                boxWidth.value = boxWidthCustom.value
                boxHeight.value = boxHeightCustom.value

                boxLeft.value = boxLeftCustom.value
                boxTop.value = boxTopCustom.value

                setWindowState(props.id,'normal')
                console.log('normalized')
            }else{
                if(!windowState.value.stuckToSide){
                    boxWidthCustom.value = boxWidth.value
                    boxHeightCustom.value = boxHeight.value
                    boxLeftCustom.value = boxLeft.value
                    boxTopCustom.value = boxTop.value
                }

                boxWidth.value = window.innerWidth
                boxHeight.value = window.innerHeight
                boxLeft.value = 0
                boxTop.value = 0

                setWindowState(props.id,'maximized')
                console.log('maximize window')

            }

        }

        function minWindow(){
            setWindowState(props.id,'minimized')
            animateWindowMinMax.value = true
            
            if(!windowState.value.maximized && !windowState.value.stuckToSide){
                boxWidthCustom.value      = parseInt(box.value.style.width)
                boxHeightCustom.value     = parseInt(box.value.style.height)
                boxTopCustom.value        = parseInt(box.value.style.top) 
                boxLeftCustom.value       = parseInt(box.value.style.left)  
            }
 
            boxWidth.value  = dockStyle.value.width
            boxHeight.value = dockStyle.value.height
            boxTop.value    = dockStyle.value.top
            boxLeft.value   = dockStyle.value.left - dockStyle.value.width/2
            boxOpacity.value = 0
            console.log(`minimized`)

        }

        function stickToSide(side){
            if(!windowState.value.stuckToSide){
                if(!windowState.value.maximized){
                    boxWidthCustom.value    = boxWidth.value
                    boxHeightCustom.value   = boxHeight.value
                }
                animateWindowMinMax.value = true
                if(side == 'left'){
                    boxTop.value = 0
                    boxLeft.value = 0
                    boxHeight.value = window.innerHeight
                    boxWidth.value = window.innerWidth / 2
                    console.log(`stick ${side}`)

                }else if (side == 'right'){

                    if (windowState.value.maximized){
                        console.log('shits maximized bruh')

                    }

                    boxTop.value = 0
                    boxLeft.value = window.innerWidth / 2
                    boxHeight.value = window.innerHeight
                    boxWidth.value = window.innerWidth / 2
                    console.log(`stick ${side}`)
                }

                setWindowState(props.id,'stuckToSide')
            }
        }

        if (windowState.value.maximized){
            console.log('maximized')
        }

        // 'watching' changes to store's minimized value and acting on it here.
        // why? two separate components(ActionButtons and DockIcon) can call minimize.
        // since Floatable.vue has access to all variables, this seemed like a good idea 
        const unwatchMinimized = watch(() => windowState.value.minimized, (isMinimized) => {
            if(isMinimized == false){
                animateWindowMinMax.value = true
                if(windowState.value.maximized){
                    boxWidth.value = window.innerWidth
                    boxHeight.value = window.innerHeight
                    boxLeft.value = 0
                    boxTop.value = 0                
                }else{
                    boxWidth.value = boxWidthCustom.value  
                    boxHeight.value = boxHeightCustom.value   
                    boxTop.value = boxTopCustom.value      
                    boxLeft.value = boxLeftCustom.value      
                }

                boxOpacity.value = 1
            }else if (isMinimized == true){
                minWindow()
            }

        });


        onMounted(() => {

            if(windowState.value.maximized){
                maxWindow()
            }else if (windowState.value.stuckToSide){
                windowState.value.stuckToSide = false;
                stickToSide(windowState.value.stuckWhere)
            }

            // ResizeObserver is used here to tackle issues while user manually resizes window using the mouse
            // feeds the manual resize dimensions to boxWidth and boxHeight, which doesn't automatically happen  
            // without this, the window ignores manual resize shape and reverts back on component update
            function reportResize(){
                // console.log('---------------------- window resize')
                if(box.value){
                    if (boxWidth.value != parseInt(box.value.style.width) || boxHeight.value != parseInt(box.value.style.height)){
                            boxWidth.value      = parseInt(box.value.style.width)
                            boxHeight.value     = parseInt(box.value.style.height)
                            boxWidthCustom.value = parseInt(box.value.style.width)
                            boxHeightCustom.value = parseInt(box.value.style.height)

                    }

                }
            }
            windowResizeObserver = new ResizeObserver(reportResize)
            windowResizeObserver.observe(box.value)

        })

        const animateSwashOut = ref(false)
        function closeWindow(){
            animateSwashOut.value = true
            boxOpacity.value = 0

            box.value.onanimationend = () => {
                setWindowState(props.id,'killed')
            }
        }

        onBeforeUnmount(() => {
            windowResizeObserver.disconnect()
            unwatchMinimized()
            console.log('floatable unmounted')
        })


        return {
            box,
            boxWidth,       
            boxHeight,
            boxLeft,
            boxTop,
            dragMouseDown,
            elementDrag,
            closeDragElement,
            props,
            maxWindow,
            animateWindowMinMax,  
            windowState,
            minWindow,
            dockStyle,
            boxOpacity,
            closeWindow,
            animateSwashOut,
            boxWidthCustom,
            boxHeightCustom,

        }
    }
}
</script>


<style lang='scss' scoped>

.floatable {
    position            :   absolute;
    // z-index             :   9;
    background-color    : #ffffff;
    border              :   1px solid #d3d3d3;
    border-radius       :   5px 5px 5px 5px;
              

    overflow            :   hidden;
    resize              :   both;
    min-width           :   64px;
    min-height          :   64px ;
    /* resize              :   both ;
    min-width           :   64px;
    min-height          :   24px ; */

    .title-bar {    
        position            :   fixed;
        z-index             :   10;
        background-color    :   #eaeaea;
        /* background-color    :   #2c3e50; */
        color               :   #fff;
        height              :   24px;
        border-radius       :   4px 4px 0 0 ;
        cursor              :   initial;
        width               :   inherit;
        display             :   flex ;

        .tab-space{
            z-index: 10;
            overflow            :   hidden;

            .spinner{
                width: 100%;
                max-width: 20px;
                top: 50%;
                // transform: translate( -50%, -50% ); /* center */
                -webkit-animation: spinLoader 600ms steps(12, end) infinite;
                animation: spinLoader 600ms steps(12, end) infinite;
                filter: invert(1);
                float : right;
                margin-top : 12px;
            }

            .box-title{
                color       : black;
                text-align  : end;
                width: max-content;
                float : right;
                
                p{
                    margin:0;
                    font-size: 18px;  
                }
            }
        }


    }
}

.window-animate-minmax{
    transition: top 0.5s 0s cubic-bezier(0.1, 1.2, 0.3, 1), 
                left 0.5s 0s cubic-bezier(0.1, 1.2, 0.3, 1), 
                transform 0.5s 0s cubic-bezier(0.1, 1.2, 0.3, 1),
                opacity      1.0s;

}

.window-animate-open{
    /* transition: top         2s      0s      cubic-bezier(0.1, 1.2, 0.3, 1), 
                transform   0.5s    0s      cubic-bezier(0.1, 1.2, 0.3, 1), 
                width       0.2s    0.2s    cubic-bezier(0.1, 1.2, 0.3, 1), 
                opacity     1.0s; */

    transition: top          1s      0s      cubic-bezier(0.1, 1.2, 0.3, 1),
                left         1s      0s      cubic-bezier(0.1, 1.2, 0.3, 1),
                opacity      1.0s;

}


/* .minimize {
    top: 100%;
    transform: translate(-50%, -10px);
    width: 0px;
    height: 6px;
    opacity: 0.5;
}
 */

.window{
    margin-top      :   24px;
    width           :   inherit;
    height          :   inherit ;
    border-radius   :   5px 5px 0 0;
    text-align      :   start;
    overflow      :   hidden;
    scrollbar-width :   thin;
    min-width       :   64px;
    min-height      :   64px;  

    .content{  
        overflow-y      :   auto;
        overflow-x      :   hidden;
        scrollbar-width :   thin;

        height          :   inherit;
        width           :   inherit;
        min-width: 64px;
        min-height: 64px;
        padding         :   0;
    }
}   


.tab-space{
    width       :   inherit ;
    height      :   inherit ;
}

.swashOut {
  animation-name: swashOut;
  animation-duration: 0.5s;
}
@keyframes swashOut {
  0% {
    opacity: 1;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }

  80% {
    opacity: 1;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: scale(0.9, 0.9);
    transform: scale(0.9, 0.9);
  }

  100% {
    opacity: 0;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
}

@keyframes spinLoader {
  from { transform: translate( -50%, -50% ) rotate(0turn); }
  to { transform: translate( -50%, -50% ) rotate(1turn); }
}


</style>