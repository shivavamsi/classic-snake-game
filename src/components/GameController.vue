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
      window.addEventListener("keyup", function(event) {
        // ignore turn if key is pressed before turn is complete
        if (this.isTurning) return;

        // set isTurning flag on arrows event
        this.isTurning = true;
        // keyup values for arrows
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
        // bind this to GameController.Vue instance
      }.bind(this));

      window.addEventListener("keyup",function(event) {
        // event listenters for game Start/Restart/Pause
        if (event.keyCode === 32) {
          // keyup code for space
          if (this.gameOver) {
            // restart the game if pressed after Game Over
            this.init();
          } else if (!this.gameStarted) {
            // start the game and emit event to bus if initialized
            this.$refs.startSound.play();
            this.startGame();
            bus.$emit("gameStarted", this.gameStarted);
          } else {
            // toggle pause and emit event to bus
            this.$refs.pauseSound.play();
            this.isPaused = !this.isPaused;
            bus.$emit("togglePaused", this.isPaused);
          }
        }
        // bind this to GameController.Vue instance
      }.bind(this));
    },
    randomInt(min, max) {
      // generate a random number with in the range and a multiple of 10
      return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    },
    generateFood() {
      // generate food for snake at a random location
      this.gameData.food = {
        x: this.randomInt(0, this.gameData.width - 10),
        y: this.randomInt(0, this.gameData.height - 10)
      };
      // check if food is inside snake
      this.snake.forEach(part => {
        // generate food again if inside snake
        if (this.gameData.food.x === part.x && this.gameData.food.y === part.y)
          this.generateFood();
      });
    },
    generateSnake() {
      // generate snake at a random location
      while (this.snake.length > 0) {
        // clear previous location of snake
        this.snake.pop();
      }
      // head for the snake
      let temp = {
        x: this.randomInt(40, this.gameData.width - 50),
        y: this.randomInt(40, this.gameData.height - 10)
      };
      // generate body corresponding the head and push to the array
      this.snake.push({ x: temp.x, y: temp.y });
      this.snake.push({ x: temp.x - 10, y: temp.y });
      this.snake.push({ x: temp.x - 20, y: temp.y });
      this.snake.push({ x: temp.x - 30, y: temp.y });
      this.snake.push({ x: temp.x - 40, y: temp.y });
    },
    advanceSnake() {
      // advance the snake location by one step in the direction it is facing
      var head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      };
      // move head from index 0 to index 1
      this.snake.unshift(head);
      // check if eats food
      if (head.x === this.gameData.food.x && head.y === this.gameData.food.y) {
        // elongate the snake if food is eaten
        this.$refs.collectSound.play();
        this.generateFood();
        // update score
        this.gameData.score += 10;
        // increase game speed
        if (this.speed > 50) this.speed -= 5;
      } else {
        // remove the last part from snake
        this.snake.pop();
      }
    },
    doesGameEnd() {
      // obtain the head of the snake for ease
      var head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      };
      // check if snake bites itself
      for (let i = 3; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          return true;
        }
      }
      // check if snake hits the wall
      if (head.x < -10 || head.y < -10 || head.x > this.gameData.width || head.y > this.gameData.height) {
        return true;
      } else {
        return false;
      }
    },
    moveSnake() {
      // move the snake continuously on the canvas
      if (this.doesGameEnd()) {
        this.$refs.gameoverSound.play();
        //update flags and emit event if Game Over
        this.gameOver = true;
        bus.$emit("gameOver", this.gameOver);
        return;
      }
      // wait before updating the new location of snake
      setTimeout(function() {
        // reset flag after turn is complete
        this.isTurning = false;
        // pause the game if flag is set
        if (!this.isPaused) {
          bus.$emit("clearCanvas");
          this.advanceSnake();
          bus.$emit("drawSnake");
          bus.$emit("drawFood");
        }
        // call the same function again
        this.moveSnake();
        // this.speed denotes the time to wait in ms
      }.bind(this), this.speed);
    },
    startGame() {
      // set the flag
      this.gameStarted = true;
      // move the snake
      this.moveSnake();
    },
    init() {
      // reset flags and game data
      this.gameData.score = 0;
      this.gameOver = false;
      this.gameStarted = false;
      this.isPaused = false;
      this.isTurning = false;
      this.dx = 10;
      this.dy = 0;
      this.speed = 150;
      // emit event to restart game
      bus.$emit("gameOver", this.gameOver);
      // generate snake and food
      this.generateSnake();
      this.generateFood();
      // emit event to initialize the game
      bus.$emit("init");
    }
  },
  mounted() {
    // setup event listeners for game controls on mounting the Vue instance
    this.setupEventListeners();
    // initialize the game
    this.init();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>