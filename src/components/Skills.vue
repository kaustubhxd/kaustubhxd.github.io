<template>
  <div class="skills-wrapper">
    <div class="skill" v-for="(icon, skill) in skills" :key="skill">
      <span id="skill-tooltip" v-tooltip="skill">
        <img
          class="skill-icon"
          :src="require('../assets/icons/skills/' + icon)"
        />
      </span>
      <!-- <div class="skill-name">{{ skill }}</div> -->
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { skills } from "../assets/content";
import { windows } from "../store/state";

export default {
  setup() {
    const skillState = ref(windows.value["skills"]);
    onMounted(() => {
      skillState.value.loaded = true;
    });

    return {
      skills,
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
