import { ref } from "@vue/reactivity"

const projects = ref({
    'odia_tts' : {
        title : 'Odia Natural TTS',
        thumbnail : 'odia_tts.jpg',
        content : `Working on a TTS engine for Odia Language(Orissa) using Google's Tacotron 2 algorithm.`,
        klink : 'http://ai4language.kaustubh.app/',
        gitlink : 'https://itskaustubh.github.io/text-to-speech/',
        link : '',
        languages : ['Python','PyTorch','Svelte','ExpressJS'],
        type : 'website'
    },
    'website' : {
        title : 'Portfolio Website',
        thumbnail : 'beta.jpg',
        content : `You're on it right now. I'm really proud of how the website turned out, and I'm glad you took the time to check it out!`,
        klink : 'https://kaustubh.app/',
        gitlink : 'https://itskaustubh.github.io/',
        link : '',
        languages : ['VueJS','Firebase'],
        type : 'website'
    },
    'neuboard' : {
        title : 'Neuboard',
        thumbnail : 'neuboard.jpg',
        content : `A public message board to post messages, images and GIFs with a custom avatar maker.`,
        gitlink : 'https://itskaustubh.github.io/neuboard/',
        link : '',
        languages : ['React','Firebase'],
        type : 'website'
    },
    'basespace' : {
        title : 'BaseSpace',
        thumbnail : 'basespace.jpg',
        content : `A website to help you browse through a list of warehouses to lease by applying different search filters.`,
        klink : 'https://basespace.kaustubh.app',
        gitlink : 'https://itskaustubh.github.io/vue-warehouse/',
        link : '',
        languages : ['VueJS'],
        type : 'website'
    },
    'offlinetv' : {
        title : 'OfflineTV Community',
        thumbnail : 'offlinetv.jpg',
        content : `A website dedicated to forming an online community for fans of the online streaming collective OfflineTV`,
        klink : 'https://offlinetv.kaustubh.app',
        gitlink : 'https://itskaustubh.github.io/offlineTV/',
        link : '',
        languages : ['VueJS'],
        type : 'website'
    },
    'flutter_netflix' : {
        title : 'Netflix Responsive App UI',
        thumbnail : 'netflix.jpg',
        content : 'Designed the Netflix Mobile and Web App using Flutter. Uses Video Player API to play videos on the Web Version.',
        klink : 'https://flutter.kaustubh.app/netflix',
        link : '',
        languages: ['Flutter'],
        type : 'website'
    },
    'flutter_food_delivery' : {
        title : 'Food Delivery App UI',
        thumbnail : 'food.jpg',
        content : 'Food Delivery App with Cart, Menus and Restaurants.',
        klink : 'https://flutter.kaustubh.app/food_delivery',
        link : '',
        languages: ['Flutter'],
        type : 'website'
    },
    'flutter_budget' : {
        title : 'Budget App UI',
        thumbnail : 'budget.png',
        content : 'Designed a Budget Planning App to keep track of my expenses. Features custom animations.',
        klink : 'https://flutter.kaustubh.app/budget/',
        link : '',
        languages: ['Flutter'],
        type : 'website'
    },
    'deep_dataset' : {
        title : 'deepDataset',
        thumbnail : 'deepDataset.jpg',
        content : 'Grab image links from Google and DuckDuckGo to build an Image Dataset for Deep Learning or some other reason.',
        link : 'https://addons.mozilla.org/en-US/firefox/addon/deepdataset/',
        languages: ['JavaScript'],
        type : 'extension'
    },
    'skribbl_plus' : {
        title : 'Skribbl Plus',
        thumbnail : 'skribbl.jpg',
        content : 'Download Skribbl drawings with a single click. The days of janky screenshots is over.',
        link : 'https://addons.mozilla.org/en-US/firefox/addon/skribbl-plus-save-drawings/',
        languages: ['JavaScript'],
        type : 'extension'
    },
    'pop_culture_dictionary' : {
        title : 'Pop Culture Dictionary',
        thumbnail : 'popCultureDictionary.jpg',
        content : 'Easy to understand definitions for plain english words or phrases, fresh memes, emojis, pop culture references - get definitions for the latest lingo on the internet.',
        link : 'https://addons.mozilla.org/en-US/firefox/addon/pop-culture-dictionary/',
        languages: ['JavaScript'],
        type : 'extension'
    },
    'portfolio_v1' : {
        title : 'Old Portfolio Website',
        thumbnail : 'portfolio_v1.jpg',
        content : `Old archived version of the portfolio you're currently on.`,
        klink : 'https://kaustubh.app/archives/portfolio_v1',
        gitlink : '',
        link : '',
        languages: ['JavaScript','HTML','CSS',],
        type : 'website'
    },
})


// var temp = ''

// var callback = function(webLink){
// 	temp = webLink
//     console.log(temp)
// }    

// function checkWebsiteStatus(callback){
//   callback && callback('hehe');
// }

// checkWebsiteStatus(callback)

function setWebsiteLinks(key){
    console.log('setting web links')
    for(const project in projects.value){
        if(projects.value[project].type == 'website' && projects.value[project][key] !== undefined && projects.value[project][key].length > 0){
            projects.value[project].link = projects.value[project][key] 
            // console.log(`${project}  :  ${projects.value[project].link}`)
        }
    }
}

const websitesArray = [{
    url : 'https://kaustubh.app/',
    xkey : 'klink' 
},{
    url : 'https://itskaustubh.github.io/',
    xkey : 'gitlink' 
}]


function checkWebsiteStatus(index = 0) {
    var image = new Image();
    image.onload = function() {
      if (this.width > 0) {
        console.log(`${websitesArray[index].url} is online!`);
        setWebsiteLinks(websitesArray[index].xkey)
      }
    }
    image.onerror = function() {
      console.log(`${websitesArray[index].url} might be down`);
      if( websitesArray.length !== (index + 1) ){
          checkWebsiteStatus(index + 1)
      }
    }
    image.src = websitesArray[index].url + 'favicon.ico';
}

checkWebsiteStatus()


const skills = {
    'Python' : 'python.svg',
    'C++' : 'c++.svg',
    'Java'  :   'java.svg',
    'JavaScript' : 'javascript.svg',
    'React' : 'react.svg',
    'VueJS' : 'vuejs.svg',
    'Svelte' : 'svelte.svg',
    'ExpressJS' : 'expressjs.svg',
    'Flutter' : 'flutter.svg',
    'HTML/CSS/SCSS' : 'html.svg',
    'Firebase' : 'firebase.svg'
}

export {
    projects,
    skills
}
