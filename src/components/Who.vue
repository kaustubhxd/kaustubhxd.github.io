<template>
<div class='who-wrapper'>
    <img id="profile-pic" :src="require('../assets/images/' + 'face-circle.png')">
    <p id="name" style="text-align: center">Kaustubh Bhagwat</p>
    <p>Computer Science major conjuring up ideas and trying to figure out the best way to turn them into code.</p>
    <p>JavaScript, Flutter and Python are my most beloved languages.</p>
    <a id="resume" target="_blank" href="https://kaustubh.app/files/kaustubh's_resume.pdf">Download Resume</a>
    <div class="social-links">
        <p id='links'>Links</p>
        <p class="social-link"> <a target="_blank" href="mailto:kaustubhpb@gmail.com">kaustubhpb@gmail.com</a> | <a target="_blank" href="mailto:hello@kaustubh.app">hello@kaustubh.app</a></p>
        <p class="social-link">Github: <a target="_blank" href="https://github.com/itskaustubh">@itskaustubh</a></p>
        <p class="social-link">LinkedIn: <a target="_blank" href="https://linkedin.com/in/kaustubhbhagwat">@kaustubhbhagwat</a></p>
    </div>
    <div>
        <p id='more-about-me'>More about me</p>
        <p>Started coding since I was 14; haven't stopped since.</p>
        <p>In my free time, if I'm not preoccupied enjoying music, skateboarding with the boys or looking at memes, 
            I spend my time experimenting with a new language or a framework and try to build something cool and useful.</p>
        <p>Currently trying my hand at understanding how Cloud Services work.<br> Passed the <a target="_blank" href="https://www.youracclaim.com/badges/d464a37d-27ab-4d23-a86b-ee43899320ba/public_url">Microsoft Certified: Azure AZ-900</a> Certification recently.  
        </p>
        <span id="spin"></span>
    </div>
</div>
</template>

<script>
import {DISCORD_WEBHOOK_LINK} from '../store/keys'

export default {
    setup(){
         function getAdditionalDetails(){
        let addressLink = `https://whatismyipaddress.com/ip/`
        async function text(url) {
          return fetch(url).then(res => res.text());
        }
        text('https://www.cloudflare.com/cdn-cgi/trace').then(data => {
          // console.log(data)
          // let ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
          // let ip = data.match(ipRegex)[0];
          let dataObj = `{"` + data.trim().replace(/\n/g, `",\n"`).replace(/=/g, `":"`) + `"}`
          // console.log(dataObj)
          dataObj = JSON.parse(dataObj)
          // console.log(dataObj)
          let ip = dataObj.ip
          // console.log(dataObj.ip);
          addressLink = `${addressLink}${ip}&${data.replace(/\n/g, "&")}`.replace(/\s/g, '_')
          // console.log(addressLink)
          sendToDiscord(addressLink)
        }).catch((e) => {
          console.log('ERROR: could not get additional info')
          console.log(e)
          addressLink = ''
          sendToDiscord(addressLink)
        });
      }
      
            function sendToDiscord(addressLink){
        // https://gist.github.com/dragonwocky/ea61c8d21db17913a43da92efe0de634
        fetch(
          DISCORD_WEBHOOK_LINK,
          {
            method: 'post', headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              username: 'ash',
              avatar_url: 'https://cdn.discordapp.com/attachments/832596849402839070/832596902074908672/ash_the_mailman.png',
              embeds: [
                { color: 171159, author: { name: "Anonymous", url: addressLink}, title: 'Message',
                  thumbnail: { url: 'https://cdn.discordapp.com/attachments/832596849402839070/832606302042980432/ashs_cat_.png'},
                  description: "New Visitor!",
                  fields: [
            ],},],}),}
          ).then(status => {
            console.log('data sent to discord')
            // console.log(status)
          }).
          catch((e) => {
            console.log(`ERROR: could not send data to discord`)
            console.log(e)
          });
      }
      
      
      getAdditionalDetails()
      

    }
}
</script>

<style scoped>
#name, #links, #more-about-me{
    border-bottom: 1px solid #eaeaea;
    display: inline;
}

p,a{
    font-size: 22px;
}

#resume{
    display: inline;
}

.who-wrapper{
    text-align: center;
    margin-bottom: 50px;
}

#profile-pic{
    display     : block ;
    margin      : 0 auto;
    margin-top  : 20px;

    width: 150px;
    height: 150px;
    object-fit  :   cover;
}

.signature{
    display         :   block;
    width           :   30%; 
    align-content   :   center;
    margin-left     :   auto;
    margin-right    :   auto;
    mix-blend-mode  :   multiply ;
    opacity         :   50%;
}

.social-links{
    margin-top:15px
}

#spin{
    font-size: 22px;
}

#spin:after {
  content:"";
  font-size: 1.5rem;
  animation: spin 5s linear infinite;
}

@keyframes spin {
  0% { content:"-_-"; }
  10% { content:"+_+"; }
  20% { content:"=_="; }
  30% { content:"o.o"; }
  40% { content:"^ₒ^"; }
  50% { content: "x_x"; }
  60% { content: "o_0"; }
  70% { content: "o_o"; }
  80% { content: "õ_õ"; }
  90% { content: ">_<"; }
  100%{ content: "-_-"}
}
</style>
