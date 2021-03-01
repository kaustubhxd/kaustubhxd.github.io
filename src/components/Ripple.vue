<template>
    <div class="rippl" 
        :class="{'animate' : ripple.active}"
        @animationend ="ripple.active = false"
        :style="{   left: ripple.left + 'px', 
                    top:  ripple.top + 'px' 
        }" 
    ></div>
</template>

<script>
import {ripple} from '../store/state'

export default {
    setup(){
        return{
            ripple,        
        }
    }

}
</script>

<style lang='scss' scoped>

  /*Ripple*/
.rippl {
    width: 10px;
    height: 10px;
    opacity: 0;
    z-index: 9999;
    transform: scale(0);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    position: fixed;
}
  
/*Animate Function*/
.animate {
    animation: rippl-mo 0.5s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes rippl-mo {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(10);
        opacity: 0;
    }
}

</style>