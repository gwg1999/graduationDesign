<template>
  <div>
    <div class="container">
      <div id="squareBox">
        <div class="left" style="background-color: black"></div>
        <div class="right"></div>
        <div class="top"></div>
        <div class="bottom"></div>
        <div class="behind"></div>
        <div class="font"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {

    }
  }
}
</script>
<style scoped lang="scss">

$length: 50px;

.container::after{
  clear: both;
  content: "";
  display: block;
}
.container{
  width: 4 * $length;
  height: 4 * $length;
  display: inline-block;
}
#squareBox{
  position: relative;
  transform-style: preserve-3d;
  //transition: all 5s linear;
  width: 2 * $length;
  height: 2 * $length;
  top: $length;
  left: $length;
  -webkit-transform-style: preserve-3d;
  transform: rotateX(15deg) rotateY(45deg);
  animation: 10s spin linear infinite;
}

#squareBox div{
  width: 2*$length;
  height: 2*$length;
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  border: 1px solid #46B8DA;
  opacity: 0.5;
}

.behind{
  transform: rotateY(0deg) translateZ($length);
  background-color: rgb(255,118,99);
}
.font{
  transform: rotateY(180deg) translateZ($length);
  background-color:rgb(231,78,72);
}
.left{
  transform: rotateY(90deg) translateZ($length);
  background-color: rgb(75,165,165);
}
.right{
  transform: rotateY(-90deg) translateZ($length);
  background-color: rgb(129,182,62);
}
.top{
  transform: rotateX(90deg) translateZ($length);
  background-color: rgb(255,118,19);
}
.bottom{
  transform: rotateX(-90deg) translateZ($length);
  background-color: rgb(244,208,114);
}
@keyframes spin {
  0%{
    transform: rotateX(0deg) rotateY(0deg);
  }
  100%{
    transform: rotateX(360deg) rotateY(360deg);
  }
}
</style>
