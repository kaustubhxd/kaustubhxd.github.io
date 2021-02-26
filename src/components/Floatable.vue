<template>
    <div v-if="true">
        <div id="floatable" class="floatable" ref="box" :style="{ width : boxWidth, height : boxHeight }">
                <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
            <div id="title-bar" class="title-bar">

                <ActionButtons/>

                <div class="tab-space" id = "tab-space"  @mousedown="dragMouseDown">

                </div>
            </div>
            
            <div id = "main-window" class="window">
                <div class ="text">
                    <p>
                        {{props.title}}
                        <br>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        Why do we use it?
                        
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                        
                    </p>
                </div>
            </div>
        </div> 
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import ActionButtons from '../components/ActionButtons'

export default {
    components: {ActionButtons},
    props: ['title'],
    setup(props){
        // https://dev.to/mandrewcito/vue-js-draggable-div-3mee

        const boxWidth = ref(window.innerWidth / 2  + 'px')
        const boxHeight = ref(window.innerHeight / 2  + 'px')
        const box = ref()

        const boxLeft = ref('0px')
        const boxTop  = ref('0px')

        onMounted(() => {
            console.log(box.value)
            box.value.style.width = window.innerWidth / 2  + 'px'
            box.value.style.width = window.innerHeight / 2  + 'px'
        })

        console.log(innerHeight)

       const positions = ref({
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }) 

        function dragMouseDown (event) {
            event.preventDefault()
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
            box.value.style.top = (box.value.offsetTop - positions.value.movementY) + 'px'
            box.value.style.left = (box.value.offsetLeft - positions.value.movementX) + 'px'  

            if (parseInt(box.value.style.top)  < 0)   box.value.style.top  = 0
            if (parseInt(box.value.style.left) < 0)   box.value.style.left = 0

        }

        function closeDragElement () {
            document.onmouseup = null
            document.onmousemove = null
        }

        return {
            box,
            boxWidth,       
            boxHeight,
            boxLeft,
            boxTop,
            dragMouseDown,
            elementDrag,
            closeDragElement,
            props
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
    resize              :   both;
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

.window-animate{
    transition: top 0.5s 0s cubic-bezier(0.1, 1.2, 0.3, 1), 
                transform 0.5s 0s cubic-bezier(0.1, 1.2, 0.3, 1);
}

.window-animate-minmax{
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