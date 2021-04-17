<template>
    <!-- <p>I'm looking for Flutter or Vue jobs right now!</p> -->
    <form id="myForm" @submit.prevent="submitContactInfo">
        <input v-model="contactInfo.firstName" @input="validateInput('firstName','string')" type="text" id="first_name" name="first_name" class="required" placeholder="Your Name*" required>
        <input v-model="contactInfo.lastName" @input="validateInput('lastName','string')" type="text" id="last_name" name="last_name" class="required" placeholder="Your Last Name">
        <input v-model="contactInfo.email" 
          @blur="validateInput('email','email')" 
          :class="{ 'email-invalid' : invalidEmail }"
          
          type="text" id="email" name="email" class="required" placeholder="example@email.com*" required>
        <input v-model="contactInfo.phone" @input="validateInput('phone','number')" type="text" id="phone" name="phone" class="required" placeholder="Phone Number" required>
        <textarea v-model="contactInfo.comments" v-autogrow id="comments" name="comments" rows="5" cols="30" placeholder="Say Hello!"></textarea>
        <div class='submit-container'>
           <div id='helper'> <p>{{helperHint}}</p> </div>
           <div> <input type="submit" name="submit" id="submit" value="Submit"></div>
        </div>
    </form>
    <div id="#results"></div>
</template>

<script>
// https://codepen.io/alecherryy/pen/LQXEXG
import { ref } from 'vue'
import {fireDB} from '../scripts/firebase'
import {DISCORD_WEBHOOK_LINK} from '../store/keys'

export default {
    setup(){

      // const docPath = 'contacts/AUPM1sdOVilTiwxq5UCW'
      const fireCollection = fireDB.collection('contacts')
      // const fireData = ref(null)

      const invalidEmail = ref(false)

      const helperHint = ref('')

      const contactInfo = ref({
       firstName : '',
       lastName : '',
       email : '',
       phone : '',
       comments : '',
      })

      function clearForm(){
        contactInfo.value.firstName = contactInfo.value.lastName = contactInfo.value.email 
          = contactInfo.value.phone = contactInfo.value.comments = ''
      }


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
        let fullname = contactInfo.value.lastName != '' ? `${contactInfo.value.lastName}, ` : ``
        fullname = fullname + contactInfo.value.firstName 
        fetch(
          DISCORD_WEBHOOK_LINK,
          {
            method: 'post', headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              username: 'ash',
              avatar_url: 'https://cdn.discordapp.com/attachments/832596849402839070/832596902074908672/ash_the_mailman.png',
              embeds: [
                { color: 171159, author: { name: fullname, url: addressLink}, title: 'Message',
                  thumbnail: { url: 'https://cdn.discordapp.com/attachments/832596849402839070/832606302042980432/ashs_cat_.png'},
                  description: contactInfo.value.comments,
                  fields: [
                    { name: 'Email', value: contactInfo.value.email},
                    { name: 'Phone', value: contactInfo.value.phone, },
            ],},],}),}
          ).then(status => {
            console.log('data sent to discord')
            helperHint.value = `Submitted! I'll get back to you ASAP`
            // console.log(status)
          }).
          catch((e) => {
            console.log(`ERROR: could not send data to discord`)
            console.log(e)
          });
      }

      function sendToFirebase(){
        fireCollection.add(contactInfo.value).then( (status) => {
          // console.log(status)
          console.log('data sent to firestore')
          helperHint.value = `Submitted! I'll get back to you ASAP`
          clearForm()
        }).catch((error) => {
            console.error("Error adding document: ", error);
            helperHint.value = `Error uploading data. Please try again later.`
            clearForm()
        });
      }


      function submitContactInfo(){
        if (invalidEmail.value){
          console.log('invalid email')
          helperHint.value = 'Invalid Email'
        }else if(!window.navigator.onLine){
          console.log('no internet')
          helperHint.value = 'Check Internet Connection'
        }else if(contactInfo.value.firstName == '' || contactInfo.value.email == '' ){
            console.log('pls fill required')
            helperHint.value = 'Please fill required details'
        }
        else{
            console.log('submit')
            getAdditionalDetails()
            sendToFirebase()
        }
      }

      function validateInput(input,type){
        console.log(contactInfo.value[input])
        if(type === 'string'){
          contactInfo.value[input] = contactInfo.value[input].replace(/[^a-zA-Z]+/g, "");
        }else if (type === 'number'){
          contactInfo.value[input] = contactInfo.value[input].replace(/[^0-9]+/g, "");
        }else if(type === 'email'){
           contactInfo.value[input] = contactInfo.value[input].trim()
           if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(contactInfo.value[input]) && contactInfo.value[input] != '' ){
             console.log('valid')
             invalidEmail.value = false
             if(helperHint.value === 'Invalid Email'){
               helperHint.value = ''
             }
           }else{
             console.log('invalid')
             helperHint.value = 'Invalid Email'
             invalidEmail.value = true
           }
        }
      }

      return {
                submitContactInfo,
                validateInput,
                invalidEmail,
                contactInfo,
                helperHint
      }
    }
}

</script>


<style scoped lang='scss'>

body {
  width: 100%;
  height: 100%;
  /* background-color: #fab1a0; */
  font-family: "Open Sans", Arial, sans-serif;
  overflow-x: hidden; 
  padding: 0;
  padding: 6em 0;
}

form {
    margin: 0 auto;
    max-width: 400px;
    overflow: hidden;
    margin-bottom: 80px;
}

input {
  color: #000;
  display: block;
  margin: 2em 0 0;
  box-shadow: none;
  overflow: hidden;
  border: none;
  /* background-color: #fab1a0; */
  font-size: 24px;
  font-family: "Open Sans", Helvetica, sans-serif;
  box-sizing: border-box;
  border-bottom: solid 1px #eaeaea;
  padding: 0 0 .5em;
  width: 100%;
  outline: 0;
  text-align: center;

    &:focus::placeholder {
        color: #808080;
    }

    &:hover::placeholder {
        color: black;
    }

    &:focus {
        border-bottom: solid 1px #000;
    }

    transition: all 0.7s ease-out;
}

.email-invalid {
  border-bottom: solid 2px #f50057;
  transition : none;
}


textarea {
  font-family: 'Open Sans', sans-serif;
  color: #000;
  margin: 2em 0 0;
  height: 150px;
  font-size: 24px;
  /* background-color: #fab1a0; */
  border: none;
  box-sizing: border-box;
  border-bottom: solid 1px #fff;
  width: 100%;
  background-color: transparent;
  resize: none;
  outline: none;
  border: none;
  text-align: center;
  scrollbar-width: thin;

    &:focus::placeholder {
        color: #808080;
    }
}

label.error {
  position: absolute;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 12px;
  margin: 8px 0px 0px 15px;
  box-shadow: none;
}

#submit {
  width: 80%;
  height: 40px;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 36px;
  text-align: right;
  background: none;
  border: none;
  cursor: pointer;
  color: #808080;
  transition: all 0.4s ease-in;
  -webkit-transition: all 0.4s ease-in;
  -moz-transition: all 0.4s ease-in;
  -o-transition: all 0.4s ease-in;
  font-family: 'Open Sans', sans-serif;
  margin: 0;

    &:hover,
    &:focus {
    color: #000;
    }
}


::placeholder {
  color: #2d3436;
}

#helper{
  text-align: right;
  font-size: 22px;
  color: #ec7bb0;
  height: auto;
}

#comments{
  overflow-y:scroll;
}

</style>