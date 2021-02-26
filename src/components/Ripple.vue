<template>
    <div class="ripple"></div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>

  /*Ripple*/
.ripple {
    width: 10px;
    height: 10px;
    opacity: 0;
    z-index: 10;
    transform: scale(0);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    position: fixed;
}
  
/*Animate Function*/
.animate {
    animation: ripple-mo 0.5s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes ripple-mo {
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