<template>
  <div id="gamedisplay">
    <canvas id="gameCanvas" ref="gameCanvas" width="300" height="300"></canvas>
    <div v-show="gameOver" class="gameOver">
      <p class="anno">Game Over!!!</p>
      <p class="restart">
        press
        <span class="space">space</span> to restart
      </p>
    </div>
    <div id="dashBoard">
      <div class="info">
        <p>score: {{this.gameData.score}}</p>
        <p>
          press
          <br>
          <span class="space">space</span>
          <br>
          <span v-if="!gameStarted">to start</span>
          <span v-else-if="!isPaused">to pause</span>
          <span v-else-if="isPaused">to resume</span>
        </p>
        <p>use
          <br>Arrow
          <br>keys
          <br>to
          <br>navigate
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../ClassicSnake";

export default {
  props: ["snake", "gameData"],
  data() {
    return {
      gameCanvas: "",
      gameContext: "",
      canvasColor: "#111111",
      canvasBorderColor: "#0074d9",
      snakeHeadColor: "#4FAAFC",
      snakeColor: "#2496FC",
      snakeBorderColor: "#00427D",
      foodColor: "#d9003a",
      foodBorderColor: "#873200",
      pixels: 10,
      gameStarted: false,
      isPaused: false,
      gameOver: false
    };
  },
  methods: {
    clearCanvas() {
      // clear the HTML Canvas
      this.gameContext.fillStyle = this.canvasColor;
      this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
      this.gameContext.strokeRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    },
    drawSnakePart(snakePart, index) {
      // draw each part of the snake

      // set bright color for head
      if (index === 0) this.gameContext.fillStyle = this.snakeHeadColor;
      else this.gameContext.fillStyle = this.snakeColor;
      // fill part
      this.gameContext.strokestyle = this.snakeBorderColor;
      // add 0.5 offset
      this.gameContext.fillRect(snakePart.x + 0.5, snakePart.y + 0.5, this.pixels, this.pixels);
      this.gameContext.strokeRect(snakePart.x + 0.5, snakePart.y + 0.5, this.pixels, this.pixels);
    },
    drawSnake() {
      // draw each part of snake body
      this.snake.forEach(this.drawSnakePart);
    },
    drawFood() {
      // set color for food
      this.gameContext.fillStyle = this.foodColor;
      this.gameContext.strokestyle = this.foodBorderColor;
      // draw food
      this.gameContext.fillRect(this.gameData.food.x + 0.5, this.gameData.food.y + 0.5, this.pixels, this.pixels);
      this.gameContext.strokeRect(this.gameData.food.x + 0.5, this.gameData.food.y + 0.5, this.pixels, this.pixels);
    },
    init() {
      // initialize the game board

      // select HTML Canvas from DOM
      this.gameCanvas = this.$refs.gameCanvas;
      // create a 2D context for the canvas
      this.gameContext = this.gameCanvas.getContext("2d");
      // set width and height of canvas
      this.gameData.width = this.gameCanvas.width;
      this.gameData.height = this.gameCanvas.height;
      // reset all flags
      this.gameOver = false;
      this.gameStarted = false;
      this.isPaused = false;
      // clear the canvas and draw images
      this.clearCanvas();
      this.drawSnake();
      this.drawFood();
    }
  },
  created() {
    // listen for events on event bus
    bus.$on("init", this.init);
    bus.$on("clearCanvas", this.clearCanvas);
    bus.$on("drawSnake", this.drawSnake);
    bus.$on("drawFood", this.drawFood);
    bus.$on("togglePaused", data => {
      this.isPaused = data;
    });
    bus.$on("gameStarted", data => {
      this.gameStarted = data;
    });
    bus.$on("gameOver", data => {
      this.gameOver = data;
    });
  },
  mounted() {
    // initialize the Game View when the Vue instance is mounted
    this.init();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#gamedisplay {
  display: flex;
  width: 750px;
  margin: 0 auto;
  margin-top: 60px;
  vertical-align: middle;
  font-family: "Orbitron", sans-serif;
  text-align: center;
  letter-spacing: 2px;
  word-spacing: 100%;
  color: #e6001b;
}
canvas {
  width: 600px;
  height: 600px;
  border: solid 4px #00427d;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}
#dashBoard {
  width: 150px;
  height: 600px;
  border: solid 4px #00427d;
  text-transform: uppercase;
  border-left: 0;
  margin: 0 auto;
  line-height: 30px;
}
.space {
  font-family: "Courier New", Courier, monospace;
  font-size: 16px;
  border: solid 2px #d9003a;
  padding: 0px 5px 0px 5px;
  margin: 0 auto;
}
.info {
  padding: 50px 0px 50px 0px;
  margin-top: 80px;
}
.gameOver {
  position: absolute;
  font-size: 100px;
  text-transform: uppercase;
  vertical-align: middle;
  float: left;
  width: 600px;
  height: 600px;
  border: solid 4px #00427d;
  margin: 0 auto;
}
.anno {
  margin-top: 100px;
}
.restart {
  font-size: 20px;
}
</style>