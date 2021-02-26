
<template>
  <div v-for="x in ['Projects','Skills']" :key="x"> 
      <Floatable :title="x"/>
  </div>
  <Docker/>
  <Ripple/>
</template>

<script>
import Docker from './components/Docker'
import Floatable from './components/Floatable'
import Ripple from './components/Ripple'

export default {
  components: {Docker, Floatable,Ripple},
  setup(){
    
    document.body.style.backgroundImage =  `url(${require('@/assets/gifs/1.gif')})`;

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    document.body.addEventListener('dblclick', () => {
      try{
        document.body.style.backgroundImage =  `url(${require(`@/assets/gifs/${randInt(1,83)}.gif`)})`;
      }catch(err){}
    })

    setInterval(() => {
      try{
        document.body.style.backgroundImage =  `url(${require(`@/assets/gifs/${randInt(1,83)}.gif`)})`;
      }catch(err){}
    },30000)

  }
}
</script>

  
<style>

</style>
