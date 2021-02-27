<template>
    <div >
        <div id="floatable" class="floatable" ref="box"  
          :style="{ width : boxWidth + 'px', 
                    height : boxHeight + 'px',
                    left: boxLeft + 'px', 
                    top: boxTop + 'px',
                    opacity: boxOpacity
                }"
          :class="{ 'window-animate-minmax' : animateWindowMinMax }"
          @transitionend    ="animateWindowMinMax = false"    
          @transitioncancel ="animateWindowMinMax = false"   
          
        
        >
                <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
            <div id="title-bar" class="title-bar">

                <ActionButtons :name='props.title' :id='props.id' @maximize='maxWindow()'/>

                <div class="tab-space" id = "tab-space"  
                @mousedown="dragMouseDown"
                @dblclick="maxWindow()">

                </div>
            </div>
            
            <div id = "main-window" class="window">
                <div class ="text">
                    <p>
                        {{props.title}}
                        <br>
                        {{windowState}}

                        <br>{{dockStyle}}<br>


                        Systems theory says that a system can have properties that none of its underlying components have and could not have been predicted based on the parts. (An emergent property). 
                        Zooming in and looking at a bunch of hydrogen and oxygen they are just atoms doing whatever they do but you zoom out to find they make a glass of water and your like, Where did the wetness come from. 
                        It's an emergent property. Consciousness is an emergent property of a much larger system. Free will is probably a property of that system.
                    </p>
                </div>
            </div>
        </div> 
    </div>
</template>

<script>
import { onBeforeUnmount, onBeforeUpdate, onMounted, ref, watch } from 'vue'
import ActionButtons from '../components/ActionButtons'
import {ripple,windows,setWindowState,dockStyle} from '../store/state'

export default {
    components: {ActionButtons},
    props: ['title','id'],
    setup(props){
        // https://dev.to/mandrewcito/vue-js-draggable-div-3mee

        const windowState = ref(windows.value[props.id])

        // const boxStyle = ref({
        //     width   :   window.innerWidth  * (3/8),
        //     height  :   window.innerHeight  * (8/13),
        //     opacity :   1,
        //     top     :   Math.floor(Math.random() * ((window.innerHeight - (boxHeight.value + 100)) - 100) + 100),
        //     left    :   Math.floor(Math.random() * ((window.innerWidth - (boxWidth.value + 100)) - 100) + 100),
        // })

        const boxWidth = ref(window.innerWidth  * (3/8))
        const boxHeight = ref(window.innerHeight  * (8/13))
        const boxOpacity = ref(1)
        
        const boxWidthCustom = ref(boxWidth.value)
        const boxHeightCustom = ref(boxHeight.value)
        
        const boxTop = ref(Math.floor(Math.random() * ((window.innerHeight - (boxHeight.value + 100)) - 100) + 100))
        const boxLeft = ref(Math.floor(Math.random() * ((window.innerWidth - (boxWidth.value + 100)) - 100) + 100))

        const boxLeftCustom = ref(boxLeft.value)
        const boxTopCustom = ref(boxTop.value)

        const box = ref()
        const animateWindowMinMax = ref(false)

       const positions = ref({
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }) 

        function dragMouseDown (event) {
            event.preventDefault()
            if(windowState.value.maximized || windowState.value.stuckToSide){
                let ratioX = event.clientX / boxWidth.value
                // console.log(boxWidthCustom.value)
                // console.log(ratioX)
                boxWidth.value = boxWidthCustom.value
                boxHeight.value = boxHeightCustom.value

                boxLeft.value = boxLeft.value + event.clientX - (boxWidthCustom.value * ratioX)
                setWindowState(props.id,'normal')

            }


            // get the mouse cursor position at startup:
            positions.value.clientX = event.clientX
            positions.value.clientY = event.clientY
            document.onmousemove = elementDrag
            document.onmouseup = closeDragElement
        }
        function elementDrag (event) {
            event.preventDefault()
            positions.value.movementX = positions.value.clientX - event.clientX
            positions.value.movementY = positions.value.clientY - event.clientY
            positions.value.clientX = event.clientX
            positions.value.clientY = event.clientY

            // set the element's new position:


            boxTop.value    = (box.value.offsetTop - positions.value.movementY)
            boxLeft.value   = (box.value.offsetLeft - positions.value.movementX)      



            // box.value.style.top = (box.value.offsetTop - positions.value.movementY) + 'px'
            // box.value.style.left = (box.value.offsetLeft - positions.value.movementX) + 'px'  

            
            // if (parseInt(box.value.style.top)  < 0)   box.value.style.top  = 0
            // if (parseInt(box.value.style.left) < 0)   box.value.style.left = 0
        }

        function closeDragElement (event) {
            document.onmouseup = null
            document.onmousemove = null

            let outOfBounds = false

            if  (boxTop.value  < 0) {
                boxTop.value  = 0
                outOfBounds = true
                maxWindow()
            }

            if  (boxLeft.value < 0)   
            {
                boxLeft.value = 0
                outOfBounds = true
                stickToSide('left')
            }
            if  (boxTop.value > window.innerHeight) 
            {
                boxTop.value = window.innerHeight - (boxHeight.value / 3)
                outOfBounds = true
            }

            if(event.clientX >= (window.innerWidth - 1))
            {
                outOfBounds = true
                stickToSide('right')
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
                console.log('normalize window')
                boxWidth.value = boxWidthCustom.value
                boxHeight.value = boxHeightCustom.value

                boxLeft.value = boxLeftCustom.value
                boxTop.value = boxTopCustom.value

                setWindowState(props.id,'normal')

            }else{
                console.log('maximize window')
                boxWidthCustom.value = boxWidth.value
                boxHeightCustom.value = boxHeight.value
                boxLeftCustom.value = boxLeft.value
                boxTopCustom.value = boxTop.value

                boxWidth.value = window.innerWidth
                boxHeight.value = window.innerHeight
                boxLeft.value = 0
                boxTop.value = 0


                setWindowState(props.id,'maximized')
            }

        }

        function minWindow(){
            setWindowState(props.id,'minimized')
            animateWindowMinMax.value = true

            boxWidthCustom.value    = boxWidth.value
            boxHeightCustom.value   = boxHeight.value
            boxTopCustom.value      = boxTop.value
            boxLeftCustom.value     = boxLeft.value

            boxWidth.value  = dockStyle.value.width
            boxHeight.value = dockStyle.value.height
            boxTop.value    = dockStyle.value.top
            boxLeft.value   = dockStyle.value.left - dockStyle.value.width/2
            boxOpacity.value = 0

        }

        function stickToSide(side){
            boxWidthCustom.value = boxWidth.value
            boxHeightCustom.value = boxHeight.value
            animateWindowMinMax.value = true
            if(side == 'left'){
                boxTop.value = 0
                boxLeft.value = 0
                boxHeight.value = window.innerHeight
                boxWidth.value = window.innerWidth / 2
            }else if (side == 'right'){
                boxTop.value = 0
                boxLeft.value = window.innerWidth / 2
                boxHeight.value = window.innerHeight
                boxWidth.value = window.innerWidth / 2
            }

            setWindowState(props.id,'stuckToSide')
        }

        if (windowState.value.maximized){
            console.log('maximized')
        }

        watch(() => windowState.value.minimized, (newValue, oldValue) => {
            if(newValue == false){
                animateWindowMinMax.value = true

                boxWidth.value = boxWidthCustom.value  
                boxHeight.value = boxHeightCustom.value   
                boxTop.value = boxTopCustom.value      
                boxLeft.value = boxLeftCustom.value     
                boxOpacity.value = 1
            }else if (newValue == true){
                minWindow()
            }

        });


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
            boxOpacity
        }
    }
}
</script>


<style lang='scss'>

.floatable {
    position            :   absolute;
    z-index             :   9;
    background-color    : #ffffff;
    border              :   1px solid #d3d3d3;
    border-radius       :   5px 5px 5px 5px;
              

    overflow-x          :   hidden;
    overflow-y          :   auto;
    scrollbar-width     :   thin ;
    resize              :   none;
    min-width           :   100px;
    min-height          :   100px ;
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
        }

    }
}

.window-animate-minmax{
    transition: top 0.5s 0s cubic-bezier(0.1, 1.2, 0.3, 1), 
                left 0.3s 0s cubic-bezier(0.1, 1.2, 0.3, 1), 
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
    border-radius   :   5px 5px 0 0;
    text-align      :   start;
    overflow-x      :   hidden;
    overflow-y      :   auto;
    scrollbar-width :   thin;

    min-width       :   100px;
    min-height      :   100px;  

    .text{  
        border-radius   :   10px;
        height          :   inherit;
        width           :   inherit;
        padding         :   0;
    }
}   


.tab-space{
    width       :   inherit ;
    height      :   inherit ;
}

</style>