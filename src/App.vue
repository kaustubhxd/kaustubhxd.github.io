
<template>
  <div v-for="(info,id) in activeWindows" :key="id"> 
      <Floatable :title="info.title" :id='id'/>
  </div>
  <AnimatedCursor/>
  <Docker/>
  <Ripple/>
</template>

<script>
import { computed, ref } from 'vue'
import Docker from './components/Docker'
import Floatable from './components/Floatable'
import Ripple from './components/Ripple'
import AnimatedCursor from './components/AnimatedCursor'
import {windows} from './store/state'

export default {
  components: {Docker, Floatable,Ripple,AnimatedCursor},
  setup(){

    document.addEventListener('contextmenu', event => event.preventDefault());

    // digs inside the dictionary 'windows' to find out which window has a state active == true, displays that
    var activeWindows = computed(() => Object.fromEntries(Object.entries(windows.value).filter(([k,v]) => v.active)))
    
    document.body.style.backgroundImage =  `url(${require('@/assets/gifs/41.gif')})`;

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    document.body.addEventListener('dblclick', (e) => {
      if (e.target.localName == 'body'){
        try{
          document.body.style.backgroundImage =  `url(${require(`@/assets/gifs/${randInt(1,83)}.gif`)})`;
        }catch(err){}

      }
    })


    // setInterval(() => {
    //   try{
    //     document.body.style.backgroundImage =  `url(${require(`@/assets/gifs/${randInt(1,83)}.gif`)})`;
    //   }catch(err){}
    // },30000)

      return {
    windows,
    activeWindows 
  }
  }


}
</script>

  
<style>
*{
  cursor: none;
}
</style>
