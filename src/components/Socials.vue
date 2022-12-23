<template>
    <div class="skills-wrapper">
      <div class="skill" v-for="(social) in socials" :key="social.name">
        <span id="skill-tooltip" v-tooltip="social.name + ' ➚'">
          <div
            v-on:click="() => onClick(social.type, social.value)"
          >
            <img class="skill-icon" width="44" :src="'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/' + social.icon" />
        </div>


        </span>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from "vue";
  import { socials } from "../assets/content";
  import { windows } from "../store/state";
  
  export default {
    setup() {
      const skillState = ref(windows.value["skills"]);

      onMounted(() => {
        skillState.value.loaded = true;
      });

      const onClick = (type, value) => {
        if(type === 'newTab') window.open(value, '_blank');
        // console.log('hello',type, value)
      }

  
      return {
        socials,
        onClick,
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .skills-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 30px;
    margin: 0 20px;
    gap: 5px;
  }
  
  .skill-icon {
    display: block;
    width: 40px;
    height: 40px;
    object-fit: contain;
  
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    transition: transform 0.3s ease;
  
    &:hover {
      transform: rotate(-10deg);
    }
  }
  
  .skill-name {
    font-size: 24px;
    border-bottom: 1px solid #000;
    padding-bottom: 3px;
    border-color: #eaeaea;
  
    color: #404040;
  
    display: block;
    text-align: center;
  
    margin-bottom: 20px;
  }
  
  #skill-tooltip {
    &::after {
      --v-tooltip-top-offset: -50px;
    }
  }
  </style>
  