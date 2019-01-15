<template>
  <div>
    <game-header></game-header>
    <game-view v-bind:snake="snake" v-bind:gameData="gameData"></game-view>
    <game-controller style="diplay:none;" v-bind:snake="snake" v-bind:gameData="gameData"></game-controller>
    <game-footer></game-footer>
  </div>
</template>

<script>
import Vue from "vue";
import GameHeader from "./components/GameHeader.vue";
import GameView from "./components/GameView.vue";
import GameController from "./components/GameController.vue";
import GameFooter from "./components/GameFooter.vue";

export const bus = new Vue();

export default {
  components: {
    "game-header": GameHeader,
    "game-view": GameView,
    "game-controller": GameController,
    "game-footer": GameFooter
  },
  data() {
    return {
      snake: [],
      gameData: {
        width: 600,
        height: 600,
        score: 0,
        food: ""
      }
    };
  }
};
</script>
<style>
</style>