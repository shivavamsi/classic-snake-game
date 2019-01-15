<template>
  <div>
    <a href="https://github.com/shivavamsi/classic-snake-game">
      <img id="logo" src="../assets/github.png">
      <p class="about">GitHub</p>
    </a>
  </div>
</template>

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%;
  position: absolute;
  text-align: center;
  right: 0;
  margin-top: 1% auto;
}
.about {
  height: 25px;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  font-family: sans-serif;
  font-weight: lighter;
  font-size: 20px;
  text-transform: capitalize;
  margin: 0 auto;
  padding: 0.5%;
}
#logo {
  vertical-align: middle;
  height: 25px;
  width: 25px;
  margin: 0 auto;
}
</style>