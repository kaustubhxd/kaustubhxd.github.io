import { DISCORD_WEBHOOK_LINK } from "../store/keys";

export const getAdditionalInfo = () => {
  let addressLink = `https://whatismyipaddress.com/ip/`;
  async function text(url) {
    return fetch(url).then((res) => res.text());
  }
  text("https://www.cloudflare.com/cdn-cgi/trace")
    .then((data) => {
      // console.log(data)
      // let ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
      // let ip = data.match(ipRegex)[0];
      let dataObj =
        `{"` +
        data
          .trim()
          .replace(/\n/g, `",\n"`)
          .replace(/=/g, `":"`) +
        `"}`;
      // console.log(dataObj)
      dataObj = JSON.parse(dataObj);
      // console.log(dataObj)
      let ip = dataObj.ip;
      // console.log(dataObj.ip);
      addressLink = `${addressLink}${ip}&${data.replace(/\n/g, "&")}`.replace(
        /\s/g,
        "_"
      );
      // console.log(addressLink)
      sendToDiscord(addressLink);
    })
    .catch((e) => {
      console.log("ERROR: could not get additional info");
      console.log(e);
      addressLink = "";
      sendToDiscord(addressLink);
    });
};

function sendToDiscord(addressLink) {
  // https://gist.github.com/dragonwocky/ea61c8d21db17913a43da92efe0de634
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
          author: { name: "Anonymous", url: addressLink },
          title: "Message",
          thumbnail: {
            url:
              "https://cdn.discordapp.com/attachments/832596849402839070/832606302042980432/ashs_cat_.png",
          },
          description: "New Visitor!",
          fields: [],
        },
      ],
    }),
  })
    .then((status) => {
      console.log("data sent to discord");
      // console.log(status)
    })
    .catch((e) => {
      console.log(`ERROR: could not send data to discord`);
      console.log(e);
    });
}
