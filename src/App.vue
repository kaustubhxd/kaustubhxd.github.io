  
<template>
<!-- https://codepen.io/tn9nex/pen/aqvRbW -->
  <Stars/>
  <!-- <Backdrop/> -->
  <div class="god-container">
    <div v-for="(info,id) in activeWindows" :key="id"> 
        <Floatable :title="info.title" :id='id'/>
    </div>
    <AnimatedCursor v-if="!isSmartPhone() && enableAnimations"/>
    <Docker/>
    <Ripple v-if="!isSmartPhone()"/>
  </div>
</template>

<script>
import { computed } from 'vue'
import Docker from './components/Docker'
import Floatable from './components/Floatable'
import Ripple from './components/Ripple'
import AnimatedCursor from './components/AnimatedCursor'
import {windows,enableAnimations} from './store/state'
import {isSmartPhone} from '../src/assets/scripts'
import Stars from './components/Stars'
import Backdrop from './components/Backdrop'


export default {
  components: {Docker, Floatable,Ripple,AnimatedCursor,Stars,Backdrop},
  setup(){

    document.addEventListener('contextmenu', event => event.preventDefault());

    // digs inside the dictionary 'windows' to find out which window has a state active == true, displays that
    var activeWindows = computed(() => Object.fromEntries(Object.entries(windows.value).filter(([k,v]) => v.active)))
    
    // document.body.style.backgroundImage =  `url(${require('@/assets/gifs/back.jpg')})`;

    // function randInt(min, max) {
    //   return Math.floor(Math.random() * (max - min + 1) ) + min;
    // }

    // document.body.addEventListener('dblclick', (e) => {
    //   if (e.target.localName == 'body'){
    //     try{
    //       document.body.style.backgroundImage =  `url(${require(`@/assets/gifs/${randInt(1,83)}.gif`)})`;
    //     }catch(err){}

    //   }
    // })


    // setInterval(() => {
    //   try{
    //     document.body.style.backgroundImage =  `url(${require(`@/assets/gifs/${randInt(1,83)}.gif`)})`;
    //   }catch(err){}
    // },30000)

      return {
    windows,
    activeWindows,
    isSmartPhone,
    enableAnimations
  }
  }


}
</script>

  
<style lang='scss'>
*{
  // cursor: none;
}

input{
  // cursor:none;
}

html {
  background: no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}

</style>
