<template>
    <div class="dots-wrapper" id = "dots-wrapper" 
    @mouseover.stop="dotsHovered()" 
    @mouseout="dotsNotHovered()"
    @mouseup="dotsHovered()">
        <div id="red-dot"       class = "dot" :style="{ 'background-image' : closeDot  }" @mousedown="dotsClicked('close')"></div>
        <div id="yellow-dot"    class = "dot" :style="{ 'background-image' : minDot  }"   @mousedown="dotsClicked('min')"></div>
        <div id="green-dot"     class = "dot" :style="{ 'background-image' : maxDot  }"   @mousedown="dotsClicked('max')"></div>
    </div>
</template>

<script>
import { ref } from 'vue'
import {K} from '../assets/constants'

export default {
    setup(){
        
        const closeDot  =   ref(K.closeDotNormal) 
        const minDot    =   ref(K.minimizeDotNormal)
        const maxDot    =   ref(K.maximizeDotNormal)  
        
        function dotsHovered(){
            closeDot.value = K.closeDotPrelight
            minDot.value = K.minimizeDotPrelight
            maxDot.value = K.maximizeDotPrelight
        }

        function dotsNotHovered(){
            closeDot.value = K.closeDotNormal
            minDot.value = K.minimizeDotNormal
            maxDot.value = K.maximizeDotNormal
        }

        
        function dotsClicked(dot){
            if      (dot === 'close')   {   closeDot.value  =   K.closeDotClicked }
            else if (dot === 'min')     {   minDot.value    =   K.minimizeDotClicked }
            else if (dot === 'max')     {   maxDot.value    =   K.maximizeDotClicked }
        }

        return{
            dotsHovered,
            dotsNotHovered,
            dotsClicked,
            maxDot,
            minDot,
            closeDot,
        }
    }

}
</script>

<style lang='scss'>
.dots-wrapper{
    display             :   flex ;
    margin              :   0;
    padding             :   2px 0 0 0;
    width               :   max-content ;
    background-color    : inherit;

    .dot{
        height              :   16px;
        width               :   16px ;
        border-radius       :   50% ;
        margin              :   2px 3px 2px 2px;
        box-shadow          :   30px 29px 120px -33px rgba(0,0,0,0.56);
    }
    

    #green-dot{
        background-image        :   url('../assets/buttons/maximize.png') ;
        background-position     :   center;    
        background-size         :   cover; 
    }

    #yellow-dot{
        background-image        :   url('../assets/buttons/minimize.png') ;
        background-position     :   center;    
        background-size         :   cover; 
    }

    #red-dot{
        background-position     :   center;    
        background-size         :   cover; 
    }
}
</style>