<template>
  <div class='image-holder' :class="{ 'image-holder-expand' : expandMode }" @click.self="handleExpandHolder">
      <img class='thumbnail' :class="{ 'image-expand' : expandMode }" :src="src" alt="s" @click.self="handleExpandImage">
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
    props: ['src'],
    setup(props){

        let expandMode = ref(false)

        function handleExpandHolder(e){
                console.log('in expandimageholder')
                console.log(expandMode.value)
                expandMode.value = !expandMode.value
        }

        function handleExpandImage(e){
            console.log('in expandimage')
            console.log(expandMode.value)
            if(!expandMode.value){
                expandMode.value = true
            }
        }
        
        console.log(props)
        return{
            src : props.src,
            expandMode,
            handleExpandHolder,
            handleExpandImage
        }
    }
}
</script>

<style lang='scss' scoped>
.image-holder-expand{
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background: rgba(1,1,1,0.8);
    z-index: 9999;
    display : flex;


    .image-expand{
        height: min-content;
        width: 100%;
        align-self: center;
        margin-top: 0;
        border : none;
        transition: width 0.3s, height 0.3s;
    }


}
.thumbnail{
    display     :   block;
    width       :   200px;
    height      :   200px;
    object-fit  :   contain;

    margin-top      :   20px;
    margin-left     :   auto;
    margin-right    :   auto;

    border              :   1px solid #eaeaea;
    border-radius   :   5px;
}
</style>