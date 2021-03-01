<template>
  <section class="s1">
        <div class="main-container">
            <h3 style="text-align: center">Some of my recent exploits</h3>
            <div class="post-wrapper">
                <div class="post">
                    <img class="thumbnail" src="../assets/images/odia_tts.png">
                    <div class="post-preview">
                        <h6 class="post-title">Final Year Project Website</h6>
                        <p class="post-intro">Working on a TTS engine for Odia Language(Orissa) using Google's Tacotron 2 algorithm. Built a website for it.<br>Languages: HTML,CSS,JavaScript</p>
                        <p><a class="post-link" target="_blank" href="https://kaustubh.app/odia_tts">Check Out</a></p>
                    </div>
                </div>

                <div class="post">
                    <img class="thumbnail" src="../assets/images/beta.png">
                    <div class="post-preview">
                        <h6 class="post-title">Portfolio Website Redesign</h6>
                        <p class="post-intro">Currently redesigning this website, planning to implement a brand new Desktop-style UI.<br>Languages: HTML,CSS,JavaScript</p>
                        <p><a class="post-link" target="_blank" href="https://kaustubh.app/beta">Check Out</a></p>
                    </div>
                </div>

                <div class="post">
                    <img class="thumbnail" src="../assets/images/netflix.png">
                    <div class="post-preview">
                        <h6 class="post-title">Netflix Responsive App UI</h6>
                        <p class="post-intro">Designed the Netflix Mobile and Web App using Flutter. Uses Video Player API to play videos on the Web Version.<br>Language: Flutter</p>
                        <p><a class="post-link" target="_blank" href="https://flutter.kaustubh.app/netflix">Check Out</a></p>
                    </div>
                </div>
                <div class="post">
                    <img class="thumbnail" src="../assets/images/food.png">
                    <div class="post-preview">
                        <h6 class="post-title">Food Delivery App UI</h6>
                        <p class="post-intro">Food Delivery App with Cart, Menus and Restaurants.<br>Language: Flutter</p>
                        <p><a class="post-link" target="_blank" href="https://flutter.kaustubh.app/food_delivery">Check Out</a></p>
                    </div>
                </div>

                <div class="post">
                    <img class="thumbnail" src="../assets/images/budget.png">
                    <div class="post-preview">
                        <h6 class="post-title">Budget App UI</h6>
                        <p class="post-intro">Designed a Budget Planning App to keep track of my expenses. Features custom animations.<br>Language: Flutter</p>
                        <p><a class="post-link" href="https://addons.mozilla.org/firefox/downloads/file/3624684/pop_culture_dictionary-2.0-fx.xpi">Check Out</a></p>
                    </div>
                </div>

                <div class="post">
                    <img class="thumbnail" src="../assets/images/deepDataset.png">
                    <div class="post-preview">
                        <h6 class="post-title">deepDataset</h6>
                        <p class="post-intro">Grab image links from Google and DuckDuckGo to build an Image Dataset for Deep Learning or some other reason.<br>Language: JavaScript </p>
                        <p><a class="post-link" href="https://addons.mozilla.org/en-US/firefox/addon/deepdataset/">Check Out</a></p>
                    </div>
                </div>

                <div class="post">
                    <img class="thumbnail" src="../assets/images/popCultureDictionary.png">
                    <div class="post-preview">
                        <h6 class="post-title">Pop Culture Dictionary</h6>
                        <p class="post-intro">Easy to understand definitions for plain english words or phrases, fresh memes, emojis, pop culture references - get definitions for the latest lingo on the internet.<br>Language: JavaScript</p>
                        <p><a class="post-link" href="https://addons.mozilla.org/en-US/firefox/addon/pop-culture-dictionary/">Check Out</a></p>
                    </div>
                </div>



            </div>
        </div>
    </section>
</template>

<script>
export default {

}
</script>

<style scoped>

*{
    font-family: 'Open Sans','sans-serif';

}

h1, h2, h3, h4, h5, h6, strong {
    color: #000000;
    font-weight: 500;
    font-family: 'Open Sans','sans-serif';

}

p, li, span, label, input, textarea {
    color: #4b5156;
    font-family: 'Open Sans','sans-serif';
}

a{
    text-decoration :   none;
    color           :   #17a2b8;
     font-family: 'Open Sans','sans-serif';

}

ul{
    list-style      :   none;
}

.s1{
    background-color    :   #fbfaf5;
    border-bottom       :   1px solid #c1c1c1;
    overflow            :   auto;
    padding-bottom: 10px;
}



h1  {font-size      :   56px;}
h2  {font-size      :   36px;}
h3  {font-size      :   32px;}
h4  {font-size      :   24px;}
h5  {font-size      :   20px;}
h6  {font-size      :   16px;}


.main-container{
    color   :   white;
    width   :   auto;
    margin  :   0 auto;
}


.post-wrapper{
    display                 :   grid;
    /* grid-template-columns   :   repeat(auto-fit, 320px); */
    gap                     :   10px;
    justify-content         :   center ;

    padding-bottom          :   30px;

}

.thumbnail{
    display     :   block;
    width       :   200px;
    height      :   200px;
    object-fit  :   contain;

    margin-top      :   20px;
    margin-left     :   auto;
    margin-right    :   auto;

    border              :   2px solid #17a2b8;
    background-color    :   rgb(251,249,243,0.8);
}

.post{
    position: relative;

    background-color    :   #fff;
    padding             :   15px;

    border-top          :   3px solid #17a2b8;
    border-bottom       :   3px solid #17a2b8;
}

.post-title{
    font-size   :   24px;
    border-bottom: 1px solid #000;
    padding-bottom: 3px;
    border-color: #eaeaea;

    color       :   #111;

    display     :   block;
    text-align  :   center;

    margin-top      :   20px;
    margin-bottom   :   20px;
}

.post-intro{
    color       :   #4b5156;
    font-size   :   22px;
}

.post-link{
    position: absolute;
    bottom: 5px;    
    font-size: 20px;
}
</style>