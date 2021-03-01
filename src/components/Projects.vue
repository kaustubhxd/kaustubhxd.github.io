<template>
  <section class="s1">
        <div class="main-container">
            <h3 style="text-align: center">Some of my recent exploits</h3>
            <div class="post-wrapper">
                
                    <div class="post" v-for='project in projects' :key='project'>
                        <img class="thumbnail" :src="require('../assets/images/' + project.thumbnail)">
                        <div class="post-preview">
                            <h6 class="post-title">{{project.title}}</h6>
                            <p class="post-content">{{project.content}}</p>
                            <p><a class="post-link" target="_blank" :href="project.link">Check Out</a></p>
                        </div>
                    </div>
            </div>
        </div>
    </section>
</template>

<script>
import {projects} from '../assets/content'
export default {
    setup(){
        return {
            projects
        }
    }
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
    color           :   #000;
     font-family: 'Open Sans','sans-serif';
}

ul{
    list-style      :   none;
}

.s1{
    background-color    :   white;
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
    grid-template-columns   :   repeat(auto-fit, 320px);
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

    border              :   2px solid #4b5156;
    background-color    :   rgb(251,249,243,0.8);
}

.post{
    position: relative;

    background-color    :   #fff;
    padding             :   15px;

    border       :   3px solid #4b5156;
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

.post-content{
    color       :   #4b5156;
    font-size   :   22px;
}

.post-link{
    position: absolute;
    bottom: 5px;    
    font-size: 20px;
}
</style>