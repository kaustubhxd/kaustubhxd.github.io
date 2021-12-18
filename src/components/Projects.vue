<template>
  <section class="s1" v-if="Object.keys(projects).length !== 0">
    <div class="main-container">
      <h4 style="text-align: center">Some of my recent exploits</h4>

      <div class="post-wrapper">
        <div class="post" v-for="project in projects" :key="project">
          <div class="images" v-viewer.static="imageViewerOpts">
            <img class="thumbnail" :alt="project.title" :src="project.thumbnail" />
          </div>
          <div class="post-preview">
            <h6 class="post-title">{{ project.title }}</h6>
            <p class="post-content">{{ project.content }}</p>
            <div class="post-lang">
              <span v-for="lang in project.languages" :key="lang" v-tooltip="lang">
                <img
                  class="lang-icon"
                  :alt="lang"
                  :src="require('../assets/icons/skills/' + lang.toLowerCase() + '.svg')"
                />
              </span>
            </div>
            <div v-if="project.link != ''">
              <p>
                <a class="post-link" target="_blank" rel="noreferrer noopener" :href="project.link"
                  >Check Out</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { windows } from "../store/state";
import { projects, skills } from "../assets/content";

export default {
  setup() {
    const projectsState = ref(windows.value["projects"]);
    onMounted(() => {
      if (projects.value.length !== 0) {
        projectsState.value.loaded = true;
      } else {
        const unwatchProjects = watch(
          () => projects.value.website,
          () => {
            console.log(Object.keys(projects).length);
            if (Object.keys(projects).length !== 0) {
              projectsState.value.loaded = true;
              unwatchProjects();
            }
          }
        );
      }
    });

    const imageViewerOpts = {
      button: true,
      navbar: false,
      title: false,
      toolbar: false,
      tooltip: false,
      movable: true,
      zoomable: true,
      rotatable: false,
      scalable: true,
      transition: true,
      keyboard: false,
    };

    return {
      projects,
      skills,
      imageViewerOpts,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  font-family: "Open Sans", "sans-serif";
}

h1,
h2,
h3,
h4,
h5,
h6,
strong {
  color: #000000;
  font-weight: 500;
  font-family: "Open Sans", "sans-serif";
}

p,
li,
span,
label,
input,
textarea {
  color: #4b5156;
  font-family: "Open Sans", "sans-serif";
}

ul {
  list-style: none;
}

.s1 {
  background-color: white;
  border-bottom: 1px solid #c1c1c1;
  overflow: auto;
  padding-bottom: 10px;
}

h1 {
  font-size: 56px;
}
h2 {
  font-size: 36px;
}
h3 {
  font-size: 32px;
}
h4 {
  font-size: 24px;
}
h5 {
  font-size: 20px;
}
h6 {
  font-size: 16px;
}

.main-container {
  color: white;
  width: auto;
  margin: 0 auto;
}

.post-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, 320px);
  gap: 10px;
  justify-content: center;

  padding-bottom: 30px;
}

.thumbnail {
  display: block;
  width: 200px;
  height: 200px;
  object-fit: contain;
  cursor: pointer;

  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;

  border: 1px solid #eaeaea;
  border-radius: 5px;
}

.post {
  position: relative;

  background-color: #fff;
  padding: 15px;

  border: 1px solid #eaeaea;
  border-radius: 5px;
}

.post-title {
  font-size: 22px;
  border-bottom: 1px solid #000;
  padding-bottom: 3px;
  border-color: #eaeaea;

  color: #111;

  display: block;
  text-align: center;

  margin-top: 20px;
  margin-bottom: 20px;
}

.post-content {
  color: #4b5156;
  font-size: 20px;
  margin-bottom: 0px;
}

.post-link {
  position: absolute;
  bottom: 5px;
  font-size: 20px;
}

.post-lang {
  display: inline-block;
  padding-left: 24px;

  .lang-icon {
    width: 30px;
    height: 30px;
    margin-right: 1px;
  }
}
</style>
