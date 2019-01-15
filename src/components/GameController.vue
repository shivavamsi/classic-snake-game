<template>
  <div>
    <audio ref="startSound">
      <source src="../assets/start.wav" type="audio/ogg">
    </audio>
    <audio ref="pauseSound">
      <source src="../assets/pause.wav" type="audio/ogg">
    </audio>
    <audio ref="collectSound">
      <source src="../assets/collect.wav" type="audio/ogg">
    </audio>
    <audio ref="gameoverSound">
      <source src="../assets/gameover.wav" type="audio/ogg">
    </audio>
  </div>
</template>

<script>
import { bus } from "../ClassicSnake";

export default {
  props: ["snake", "gameData"],
  data() {
    return {
      dx: 10,
      dy: 0,
      gameStarted: false,
      isPaused: false,
      speed: 150,
      gameOver: false
    };
  },
  methods: {
    setupEventListeners() {
      // event listeners for arrow keys
      window.addEventListener(
        "keyup",
        function(event) {
          if (this.isTurning) return;

          this.isTurning = true;
          // keyup values for arrow keys
          const leftKey = 37;
          const upKey = 38;
          const rightKey = 39;
          const downKey = 40;

          switch (event.keyCode) {
            case leftKey:
              // check if snake is moving right
              if (this.dx !== 10) {
                this.dx = -10;
                this.dy = 0;
              }
              break;

            case upKey:
              // check if snake is moving down
              if (this.dy !== 10) {
                this.dx = 0;
                this.dy = -10;
              }
              break;

            case rightKey:
              // check if snake is moving left
              if (this.dx !== -10) {
                this.dx = 10;
                this.dy = 0;
              }
              break;

            case downKey:
              // check if snake is moving up
              if (this.dy !== -10) {
                this.dx = 0;
                this.dy = 10;
              }
              break;
          }
        }.bind(this)
      );

      // event listenters for game pause
      window.addEventListener(
        "keyup",
        function(event) {
          if (event.keyCode === 32) {
            if (this.gameOver) {
              this.init();
            } else if (!this.gameStarted) {
              this.$refs.startSound.play();
              this.startGame();
              bus.$emit("gameStarted", this.gameStarted);
            } else {
              this.$refs.pauseSound.play();
              this.isPaused = !this.isPaused;
              bus.$emit("togglePaused", this.isPaused);
            }
          }
        }.bind(this)
      );
    },
    randomInt(min, max) {
      return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    },
    generateFood() {
      this.gameData.food = {
        x: this.randomInt(0, this.gameData.width - 10),
        y: this.randomInt(0, this.gameData.height - 10)
      };

      // check if food is inside snake
      this.snake.forEach(part => {
        if (this.gameData.food.x === part.x && this.gameData.food.y === part.y)
          this.generateFood();
      });
    },
    generateSnake() {
      while (this.snake.length > 0) {
        this.snake.pop();
      }
      let temp = {
        x: this.randomInt(40, this.gameData.width - 50),
        y: this.randomInt(40, this.gameData.height - 10)
      };

      this.snake.push({ x: temp.x, y: temp.y });
      this.snake.push({ x: temp.x - 10, y: temp.y });
      this.snake.push({ x: temp.x - 20, y: temp.y });
      this.snake.push({ x: temp.x - 30, y: temp.y });
      this.snake.push({ x: temp.x - 40, y: temp.y });
    },
    advanceSnake() {
      var head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      };

      this.snake.unshift(head);

      // check if eats food
      if (head.x === this.gameData.food.x && head.y === this.gameData.food.y) {
        this.$refs.collectSound.play();
        this.generateFood();
        this.gameData.score += 10;
        if (this.speed > 50) this.speed -= 5;
      } else {
        this.snake.pop();
      }
    },
    doesGameEnd() {
      // check if snake bites itself
      var head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      };

      for (let i = 3; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          return true;
        }
      }

      // check if snake hits the wall
      if (
        head.x < -10 ||
        head.y < -10 ||
        head.x > this.gameData.width ||
        head.y > this.gameData.height
      ) {
        return true;
      } else {
        return false;
      }
    },
    moveSnake() {
      if (this.doesGameEnd()) {
        this.$refs.gameoverSound.play();
        this.gameOver = true;
        bus.$emit("gameOver", this.gameOver);
        return;
      }

      setTimeout(
        function() {
          this.isTurning = false;
          if (!this.isPaused) {
            bus.$emit("clearCanvas");

            this.advanceSnake();

            bus.$emit("drawSnake");

            bus.$emit("drawFood");
          }
          // call the same function again
          this.moveSnake();
        }.bind(this),
        this.speed
      );
    },
    startGame() {
      this.gameStarted = true;
      this.moveSnake();
    },
    init() {
      this.gameData.score = 0;
      this.gameOver = false;
      this.gameStarted = false;
      this.isPaused = false;
      this.isTurning = false;
      this.dx = 10;
      this.dy = 0;
      this.speed = 150;
      bus.$emit("gameOver", this.gameOver);

      this.generateSnake();
      this.generateFood();

      bus.$emit("init");
    }
  },
  mounted() {
    this.setupEventListeners();
    this.init();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>