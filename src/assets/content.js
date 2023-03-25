import { ref } from "@vue/reactivity";

import Prismic from "@prismicio/client";

console.log(Prismic);

const projects = ref([]);
var apiEndpoint = "https://kaustubhportfolio.cdn.prismic.io/api/v2";

function setWebsiteLinks(key) {
  console.log("setting web links");
  console.log(projects.value);
  for (const project in projects.value) {
    try {
      if (
        typeof projects.value[project] !== undefined &&
        projects.value[project].type == "website" &&
        projects.value[project][key] !== undefined &&
        projects.value[project][key].length > 0
      ) {
        projects.value[project].link = projects.value[project][key];
        // console.log(`${project}  :  ${projects.value[project].link}`)
      }
    } catch (err) {
      continue;
    }
  }
}

const email = "hello@kaustubh.app"

const websitesArray = [
  {
    url: "https://kaustubh.app/",
    xkey: "klink",
  },
  {
    url: "https://kaustubhxd.github.io/",
    xkey: "gitlink",
  },
];

function checkWebsiteStatus(index = 0) {
  var image = new Image();
  image.onload = function() {
    if (this.width > 0) {
      console.log(`${websitesArray[index].url} is online!`);
      setWebsiteLinks(websitesArray[index].xkey);
    }
  };
  image.onerror = function() {
    console.log(`${websitesArray[index].url} might be down`);
    if (websitesArray.length !== index + 1) {
      checkWebsiteStatus(index + 1);
    }
  };
  image.src = websitesArray[index].url + "favicon.ico";
}

const skills = {
  Python: "python.svg",
  "C++": "c++.svg",
  Java: "java.svg",
  JavaScript: "javascript.svg",
  React: "react.svg",
  VueJS: "vuejs.svg",
  Svelte: "svelte.svg",
  ExpressJS: "expressjs.svg",
  Flutter: "flutter.svg",
  "HTML/CSS/SCSS": "html.svg",
  Firebase: "firebase.svg",
  MongoDB: "mongodb.svg",
  PostgresSQL: "postgressql.svg",
};


const socials = [
  {name: 'GitHub', type: 'newTab', value: 'https://github.com/kaustubhxd', icon: 'github/github-original.svg'},
  {name: 'Behance', type: 'newTab', value: 'https://www.behance.net/kaustubhxd', icon: 'behance/behance-plain.svg'},
  {name: 'LinkedIn', type: 'newTab', value: 'https://www.linkedin.com/in/kaustubhxd/', icon: 'linkedin/linkedin-plain.svg'},
]

let sort_order = [];
let unsortedProjects = {};

// fetching data from CMS
const client = Prismic.client(apiEndpoint);
client
  .query("")
  .then((resp) => {
    const results = resp.results;
    console.log(results);
    results.forEach((item) => {
      const data = item.data;
      if (item.type === "project") {
        unsortedProjects[item.uid] = {
          title: data.title[0].text,
          thumbnail: data.thumbnail.url,
          content: data.content[0].text,
          klink: data.klink.url === undefined ? "" : data.klink.url,
          gitlink: data.gitlink.url === undefined ? "" : data.gitlink.url,
          link: "",
          languages: data.languages[0].text.split(","),
          type: data.type[0].text,
        };
      } else if (item.type === "project_or") {
        item.data["sort_order"].forEach((sortItem) => {
          sort_order.push(sortItem.text.trim());
        });
      }
    });
    console.log(unsortedProjects);

    sort_order.forEach((id) => {
      if (typeof unsortedProjects[id] !== "undefined") {
        projects.value.push(unsortedProjects[id]);
      }
    });
    console.log(projects.value);

    checkWebsiteStatus();
  })
  .catch((err) => {
    console.log("CMS fetch failed: ", err);
  });

export { projects, skills, socials, email };
