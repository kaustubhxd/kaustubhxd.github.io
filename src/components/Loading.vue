<template>
  <div class="animated yt-loader"></div>
</template>

<script>
// https://codepen.io/nazar32/pen/drrzqJ
export default {

}
</script>

<style scoped>
.animated {
    -webkit-animation-duration: 7s;
    animation-duration: 7s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}

.yt-loader {
    -webkit-animation-name: horizontalProgressBar;
    animation-name: horizontalProgressBar;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
    background: #17a2b8;
    height: 3px;
    left: 0;
    position: relative;
    top: 0;
    width: 0%;
    z-index: 9999;
}

@keyframes horizontalProgressBar
{
    0%   {width: 0%;}
    25%  {width: 22%;}
    50%  {width: 55%;}
    75%  {width: 83%;}
    100% {width: 95%;}
}

@-webkit-keyframes horizontalProgressBar /* Safari and Chrome */
{
    0%   {width: 0%;}
    25%  {width: 22%;}
    50%  {width: 55%;}
    75%  {width: 83%;}
    100% {width: 95%;}
}
</style>