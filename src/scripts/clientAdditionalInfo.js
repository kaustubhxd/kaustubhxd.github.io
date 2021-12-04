import { DISCORD_WEBHOOK_LINK } from "../store/keys";
import Bowser from "bowser";

let INFO = [];
let flags = {
  isCrawler: false,
};

export const getAdditionalInfo = () => {
  getBrowserInfo();
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

const bowser = Bowser.getParser(window.navigator.userAgent).parsedResult;
console.log(bowser);

const getBrowserInfo = () => {
  INFO.push(
    { name: "Time", value: new Date().toString() },
    {
      name: "Browser",
      value: `${bowser.browser.name} ${bowser.browser.version}`,
    },
    {
      name: "System",
      value: `${bowser.os.name} ${bowser.os.version} (${titleCase(
        bowser.platform.type
      )}) ${bowser.engine.name}`,
    },
    { name: "Language", value: navigator.language },
    { name: "Screen Size", value: `${screen.width}x${screen.height}` },
    { name: "User Agent", value: navigator.userAgent },
    {
      name: "Memory",
      value: `${navigator.deviceMemory} ${navigator.hardwareConcurrency ||
        "x"}`,
    }
  );

  if (document.referrer) {
    INFO.push({ name: "Referrer", value: document.referrer });
  }

  navigator.getBattery().then((battery) => {
    INFO.push({
      name: "Battery",
      value: `${battery.level * 100}% ${battery.charging ? "⚡" : ""}`,
    });
  });

  let botPattern =
    "(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
  let isCrawlerRx = new RegExp(botPattern, "i");
  if (isCrawlerRx.test(navigator.userAgent)) {
    flags.isCrawler = true;
  }

  console.log(INFO);
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
          author: {
            name: flags.isCrawler ? "Crawler" : "Anonymous",
            url: addressLink,
          },
          // title: "Message",
          thumbnail: {
            url:
              "https://cdn.discordapp.com/attachments/832596849402839070/832606302042980432/ashs_cat_.png",
          },
          // description: "New Visitor!",
          fields: INFO,
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

function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
