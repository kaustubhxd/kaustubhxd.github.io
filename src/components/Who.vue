<template>
  <div class="who-wrapper">
    <img id="profile-pic" alt="Kaustubh's Face" :src="require('../assets/images/' + 'face-circle.png')" />
    <p id="name" style="text-align: center">Kaustubh Bhagwat</p>
    <p>
      Computer scientist conjuring up ideas and trying to figure out the best way to turn them into code.
    </p>
    <Skills />
    <a
      id="resume"
      target="_blank"
      rel="noreferrer noopener"
      href="https://raw.githubusercontent.com/kaustubhxd/kaustubhxd.github.io/master/src/assets/kaustubh_resume.pdf"
      >Download Resume</a
    >
    <div class="social-links">
      <p class="social-link">
        <a target="_blank" rel="noreferrer noopener" href="mailto:kaustubhxd@icloud.com"
          >kaustubhxd@icloud.com</a
        >
        |
      </p>
      <p class="social-link">
        GitHub:
        <a target="_blank" rel="noreferrer noopener" href="https://github.com/kaustubhxd">@kaustubhxd</a>
      </p>
      <p class="social-link">
        LinkedIn:
        <a target="_blank" rel="noreferrer noopener" href="https://www.linkedin.com/in/kaustubhxd/"
          >@kaustubhxd</a
        >
      </p>
      <p class="social-link">
        Behance:
        <a target="_blank" rel="noreferrer noopener" href="https://www.behance.net/kaustubhxd"
          >@kaustubhxd</a
        >
      </p>
    </div>
    <div>
      <p id="more-about-me">More about me</p>
      <p>Started coding since I was 14; haven't stopped since.</p>
      <p>
        In my free time, if I'm not preoccupied enjoying music, skateboarding with the boys or looking at
        memes, I spend my time experimenting with a new language or a framework and try to build something
        cool and useful.
      </p>
      <p>
        Currently trying my hand at understanding interaction design, visual design, and information architecture.<br />
        Showcasing my design work on my
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://www.behance.net/kaustubhxd"
          >Behance profile</a
        >
      </p>
      <span id="spin"></span>
    </div>
  </div>
</template>

<script>
import { getAdditionalInfo } from "../scripts/clientAdditionalInfo";
import Skills from "./Skills.vue";

export default {
  components: { Skills },
  setup() {
    getAdditionalInfo();
  },
};
</script>

<style scoped>
#name,
#links,
#more-about-me {
  border-bottom: 1px solid #eaeaea;
  display: inline;
}

p,
a {
  font-size: 22px;
}

#resume {
  display: inline;
}

.who-wrapper {
  text-align: center;
  margin-bottom: 50px;
}

#profile-pic {
  display: block;
  margin: 0 auto;
  margin-top: 20px;

  width: 150px;
  height: 150px;
  object-fit: cover;
}

.signature {
  display: block;
  width: 30%;
  align-content: center;
  margin-left: auto;
  margin-right: auto;
  mix-blend-mode: multiply;
  opacity: 50%;
}

.social-links {
  margin: 0;
}

#beloved-lang {
  margin-bottom: 0;
}

#spin {
  font-size: 22px;
}

#spin:after {
  content: "";
  font-size: 1.5rem;
  animation: spin 5s linear infinite;
}

@keyframes spin {
  0% {
    content: "-_-";
  }
  10% {
    content: "+_+";
  }
  20% {
    content: "=_=";
  }
  30% {
    content: "o.o";
  }
  40% {
    content: "^ₒ^";
  }
  50% {
    content: "x_x";
  }
  60% {
    content: "o_0";
  }
  70% {
    content: "o_o";
  }
  80% {
    content: "õ_õ";
  }
  90% {
    content: ">_<";
  }
  100% {
    content: "-_-";
  }
}
</style>
