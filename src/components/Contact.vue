<template>
  <div class="contact-wrap">
    <p id="contact-title" style="text-align: center">Hello Visitor!</p>
    <div class="text-wrap">
      The seemingly impersonal contact form below will deliver your message personally and instantly to my
      Discord. <br />
      <div id="gap15"></div>
      Not a fan of contact forms? Send me an email at
      <a id="email-link" href="mailto:kaustubhpb@gmail.com">kaustubhpb@gmail.com</a><br />
      Else, please fill the form below :) <br />
      <div id="gap15"></div>
      <form id="myForm" @submit.prevent="submitContactInfo">
        Hey, my name is
        <input
          v-model="contactInfo.fullName"
          @input="validateInput('fullName', 'string')"
          @focus="setFocusState('firstName', true)"
          @blur="setFocusState('firstName', false)"
          autocomplete="off"
          type="text"
          id="first_name"
          name="first_name"
          class="required"
          placeholder="Your Name"
          required
        />
        and I wanted to

        <textarea
          ref="commentRef"
          v-model="contactInfo.comments"
          @focus="setFocusState('comments', true)"
          @blur="setFocusState('comments', false)"
          v-autogrow
          id="comments"
          name="comments"
          rows="4"
          cols="30"
          placeholder="Say Hello!"
          autocomplete="off"
          required
        ></textarea>

        <!-- <input
          ref="commentRef"
          autocomplete="off"
          v-model="contactInfo.comments"
          @input="validateInput('comments', 'string')"
          type="text"
          id="comments"
          name="comments"
          class="required"
          required
        /> -->
        Get in touch with me at
        <input
          v-model="contactInfo.email"
          autocomplete="off"
          @input="validateInput('email', 'email')"
          @focus="setFocusState('email', true)"
          @blur="setFocusState('email', false)"
          type="text"
          id="email"
          name="email"
          class="required"
          placeholder="example@email.com"
          required
        />
        <div id="gap15"></div>
        <div class="submit-wrap">
          <div id="helper-hint">
            <p>{{ helperHint }}</p>
          </div>
          <button id="submit-button">
            <img v-if="isSubmitting" class="spinner" :src="require('../assets/gifs/' + 'spinner.png')" />
            <p>{{ submitButtonText }}</p>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import { windows, hideDocker } from "../store/state";
import { DISCORD_WEBHOOK_LINK } from "../store/keys";
import { isSmartPhone } from "../assets/scripts";

export default {
  setup() {
    const contactState = ref(windows.value["contact"]);
    const commentRef = ref(null);
    const validEmail = ref(false);
    const helperHint = ref("");
    const submitButtonText = ref("Submit");
    const isSubmitting = ref(false);
    let commentPlaceholderInterval = null;

    const focusState = ref({
      fullName: false,
      comments: false,
      email: false,
    });
    const setFocusState = (type, isFocused) => {
      if (!isSmartPhone) return;
      focusState.value[type] = isFocused;
      console.log(`${type} is now ${isFocused ? "focused" : "blured"}`);
    };
    const stopFocusWatcher = watchEffect(() => {
      let nothingFocused = true;
      Object.entries(focusState.value).forEach(([type, isFocused]) => {
        if (isFocused) nothingFocused = false;
      });
      if (nothingFocused) {
        hideDocker(false);
      } else {
        hideDocker(true);
      }
    });
    if (!isSmartPhone) stopFocusWatcher();

    onMounted(() => {
      contactState.value.loaded = true;
      commentPlaceholderSuggestions();
    });

    onBeforeUnmount(() => {
      clearInterval(commentPlaceholderInterval);
    });

    const commentPlaceholderSuggestions = () => {
      const suggestions = [
        "say hello",
        "talk about stuff",
        "know something",
        "collaborate with you",
        "ask about stuff",
        "see if this reaches you",
      ];
      console.log(commentRef.value);
      let index = 1;
      commentRef.value.placeholder = suggestions[0];
      commentPlaceholderInterval = setInterval(() => {
        commentRef.value.placeholder = suggestions[index];
        index = index + 1 === suggestions.length ? 0 : index + 1;
      }, 2000);
    };

    const contactInfo = ref({
      fullName: "",
      email: "",
      comments: "",
    });

    function validateInput(input, type) {
      console.log(contactInfo.value[input]);
      if (submitButtonText.value !== "Submit") submitButtonText.value = "Submit";
      if (type === "string") {
        contactInfo.value[input] = contactInfo.value[input].replace(/[^a-zA-Z ]+/g, "");
      } else if (type === "email") {
        contactInfo.value[input] = contactInfo.value[input].trim();
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            contactInfo.value[input]
          ) &&
          contactInfo.value[input] != ""
        ) {
          console.log("valid");
          validEmail.value = true;
        } else {
          console.log("invalid");
          validEmail.value = false;
        }
      }
    }

    const submitContactInfo = () => {
      if (!validEmail.value) {
        console.log("invalid email");
        helperHint.value = "Invalid Email";
      } else if (!window.navigator.onLine) {
        console.log("no internet");
        helperHint.value = "Check Internet Connection";
      } else if (contactInfo.value.fullName == "" || contactInfo.value.email == "") {
        console.log("pls fill required");
        helperHint.value = "Please fill required details";
      } else {
        console.log("submit");
        helperHint.value = "";
        sendToDiscord();
      }
    };

    function clearForm() {
      contactInfo.value.fullName = contactInfo.value.email = contactInfo.value.comments = "";
    }

    function sendToDiscord() {
      // https://gist.github.com/dragonwocky/ea61c8d21db17913a43da92efe0de634
      const fullname = contactInfo.value.fullName;

      isSubmitting.value = true;
      submitButtonText.value = "Submitting";
      fetch(DISCORD_WEBHOOK_LINK, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "ash",
          avatar_url:
            "https://cdn.discordapp.com/attachments/832596849402839070/832596902074908672/ash_the_mailman.png",
          embeds: [
            {
              color: 171159,
              author: { name: fullname },
              title: "Message",
              thumbnail: {
                url:
                  "https://cdn.discordapp.com/attachments/832596849402839070/832606302042980432/ashs_cat_.png",
              },
              description: contactInfo.value.comments,
              fields: [{ name: "Email", value: contactInfo.value.email }],
            },
          ],
        }),
      })
        .then((status) => {
          console.log("data sent to discord");
          helperHint.value = `I'll get back to you within 48 hours!`;
          clearForm();
          isSubmitting.value = false;
          submitButtonText.value = "Submitted!";
        })
        .catch((e) => {
          console.log(`ERROR: could not send data to discord`);
          console.log(e);
          isSubmitting.value = false;
          submitButtonText.value = "Error!";
          helperHint.value = "Could not submit form. Please try again later.";
          clearForm();
        });
    }

    return {
      submitContactInfo,
      contactInfo,
      validateInput,
      commentRef,
      helperHint,
      submitButtonText,
      isSubmitting,
      setFocusState,
    };
  },
};
</script>

<style lang="scss">
#gap15 {
  display: block;
  height: 15px;
}

.contact-wrap {
  #contact-title {
    border-bottom: 1px solid #eaeaea;
    font-size: 22px;
    padding: 0;
    margin: 10px auto;
    width: max-content;
  }
  a {
    padding: 0;
  }
  margin: 20px;
  margin-bottom: 50px;
  .text-wrap {
    font-size: 22px;

    form {
      text-align: center;
      textarea {
        display: block;
        color: #000;
        height: 140px;
        font-size: 22px;
        font-family: "Open Sans", sans-serif;
        border: solid 1px #eaeaea;
        border-radius: 12px;
        width: 100%;
        max-width: 600px;
        resize: none;
        outline: none;
        text-align: center;
        scrollbar-width: thin;
        margin: 10px auto;
        transition: all 0.7s ease-out;

        &:focus::placeholder {
          color: #808080;
        }
        &:focus,
        &:hover {
          border: solid 1px #000;
        }
      }
      input {
        color: #000;
        box-shadow: none;
        overflow: hidden;
        border: none;
        font-size: 22px;
        font-family: "Open Sans", Helvetica, sans-serif;
        box-sizing: border-box;
        border-bottom: solid 1px #eaeaea;
        outline: 0;
        text-align: center;
        transition: all 0.7s ease-out;

        &:focus::placeholder {
          color: #808080;
        }

        &:hover::placeholder {
          color: black;
        }

        &:focus,
        &:hover {
          border-bottom: solid 1px #000;
        }
      }

      #comments {
        width: 100%;
      }

      .submit-wrap {
        display: flex;
        margin-top: 15px;
        align-items: center;
        flex-direction: column;

        #helper-hint {
          width: 100%;
          min-height: 40px;
          text-align: center;

          p {
            padding: 0;
            margin: 0;
          }
        }

        #submit-button {
          cursor: pointer;
          width: 170px;
          height: 45px;
          background: #252424;
          border: 10px solid #252424;
          border-radius: 20px;
          color: white;
          font-size: 20px;
          transition: all 0.3s ease-in-out;

          display: flex;
          justify-content: center;

          &:hover,
          &:focus {
            color: white;
            background: black;
            border: 10px solid black;
          }

          .spinner {
            width: 20px;
            height: 20px;
            animation: spinLoader 600ms steps(12, end) infinite;
            float: right;
            margin-top: 13px;
          }

          p {
            width: fit-content;
            padding: 0;
            margin: -3px 0 0 0;
          }
        }
      }
    }
  }

  #email-link {
    display: inline-block;
  }

  @keyframes spinLoader {
    from {
      transform: translate(-50%, -50%) rotate(0turn);
    }
    to {
      transform: translate(-50%, -50%) rotate(1turn);
    }
  }
}
</style>
