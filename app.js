class Snake {
    constructor (player, snake, directionKeys){
        this.player = player;
        this.SNAKE_COLOUR = "lightgreen";
        this.SNAKE_BORDER_COLOUR = "darkgreen";
        this.score = 0;
        this.changingDirection = false;
        this.snake = snake;
        this.dy = 0;
        this.dx = 10;
        this.directionKeys = directionKeys;
        this.LEFT_KEY = this.directionKeys[0];
        this.RIGHT_KEY = this.directionKeys[1];
        this.UP_KEY = this.directionKeys [2];
        this.DOWN_KEY = this.directionKeys [3];
    }
    move (dx, dy) {
          // Create the new Snake's head
          const head = {x: this.snake[0].x + dx, y: this.snake[0].y + dy};
          // Add the new head to the beginning of snake body
          this.snake.unshift(head);
    }
    didEatFoodCheck (foodx, foody, foodColour) {
      let didchange = false 
      const didEatFood = this.snake[0].x === foodx && this.snake[0].y === foody;
      if (didEatFood) {
        // Increase score
        this.score += 10;
        this.SNAKE_COLOUR = foodColour;
        didchange = true;
      } else {
        // Remove the last part of snake body
        this.snake.pop();
      }

      return didchange;
    }

    gameEndCheck () {
      for (let i = 4; i < this.snake.length; i++) {
        if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) return true
      }

      const hitLeftWall = this.snake[0].x < 0;
      const hitRightWall = this.snake[0].x > gameCanvas.width - 10;
      const hitToptWall = this.snake[0].y < 0;
      const hitBottomWall = this.snake[0].y > gameCanvas.height - 10;

      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    changeDirection (keyPressed) {
        /**
         * Prevent the snake from reversing
         * Example scenario:
         * Snake is moving to the right. User presses down and immediately left
         * and the snake immediately changes direction without taking a step down first
         */
        if (this.changingDirection) return;
        this.changingDirection = true;
  
        const goingUp = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx === -10;
  
        if (keyPressed === this.LEFT_KEY && !goingRight) {
          this.dx = -10;
          this.dy = 0;
        }
        if (keyPressed === this.UP_KEY && !goingDown) {
          this.dx = 0;
          this.dy = -10;
        }
        if (keyPressed === this.RIGHT_KEY && !goingLeft) {
          this.dx = 10;
          this.dy = 0;
        }
        if (keyPressed === this.DOWN_KEY && !goingUp) {
          this.dx = 0;
          this.dy = 10;
        }
      }
    }

class Food {
  constructor(){
    this.colours = ["red", "yellow", "blue", "green", "orange", "purple", "pink", "brown"]
    this.FOOD_COLOUR = this.colours[0];
    this.FOOD_BORDER_COLOUR = "darkred";
    this.x = null;
    this.y = null;
  }
}

const GAME_SPEED = 100;
    const CANVAS_BORDER_COLOUR = "black";
    const CANVAS_BACKGROUND_COLOUR = "white";

    const food = new Food ();

    // Get the canvas element
    const gameCanvas = document.getElementById("gameCanvas");
    // Return a two dimensional drawing context
    const ctx = gameCanvas.getContext("2d");


    const snakeOne = new Snake ("Player One", [
    {x: 170, y: 170},
    {x: 160, y: 170},
    {x: 150, y: 170},
    {x: 140, y: 170},
    {x: 130, y: 170}], 
    [37, 39, 38, 40])
    const snakeTwo = new Snake ("Player Two", [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}],
    [65, 68, 87, 83])

    // Start game
    main();
    // Create the first food location
    createFood();
    // Call changeDirection whenever a key is pressed
    document.addEventListener("keydown", changeDirection);


    /**
     * Main function of the game
     * called repeatedly to advance the game
     */
    function main() {
      // If the game ended return early to stop game
      if (didGameEnd()) return;

      setTimeout(function onTick() {
        snakeOne.changingDirection = false;
        snakeTwo.changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake(food.x, food.y, food.FOOD_COLOUR);
        drawSnake();

        // Call game again
        main();
      }, GAME_SPEED)
    }

    /**
     * Change the background colour of the canvas to CANVAS_BACKGROUND_COLOUR and
     * draw a border around it
     */
    function clearCanvas() {
      //  Select the colour to fill the drawing
      ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
      //  Select the colour for the border of the canvas
      ctx.strokestyle = CANVAS_BORDER_COLOUR;

      // Draw a "filled" rectangle to cover the entire canvas
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    /**
     * Draw the food on the canvas
     */
    function drawFood() {
      ctx.fillStyle = food.FOOD_COLOUR;
      ctx.strokestyle = food.FOOD_BORDER_COLOUR;
      ctx.fillRect(food.x, food.y, 10, 10);
      ctx.strokeRect(food.x, food.y, 10, 10);
    }

    function advanceSnake(foodx, foody, foodColour) {

      snakeOne.move (snakeOne.dx, snakeOne.dy);
      snakeTwo.move (snakeTwo.dx, snakeTwo.dy)

      const snakeOneAte = snakeOne.didEatFoodCheck(foodx, foody, foodColour);
      const snakeTwoAte = snakeTwo.didEatFoodCheck(foodx, foody, foodColour);
      document.getElementById('snakeOneScore').innerHTML = snakeOne.score;
      document.getElementById('snakeTwoScore').innerHTML = snakeTwo.score;

      if (snakeOneAte || snakeTwoAte) {
        createFood()
      }
    }

    function didGameEnd() {
      
      if (snakeOne.gameEndCheck() || snakeTwo.gameEndCheck()){
        return true
      }

      for (let i = 0; i < snakeOne.snake.length; i++) {
        for (let s = 0; s < snakeTwo.snake.length; s++){
          if (snakeOne.snake[i].x === snakeTwo.snake[s].x && snakeOne.snake[i].y === snakeTwo.snake[s].y) 
            return true
          }
        }
      }

    /**
     * Generates a random number that is a multiple of 10 given a minumum
     * and a maximum number
     * @param { number } min - The minimum number the random number can be
     * @param { number } max - The maximum number the random number can be
     */
    function randomTen(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    /**
     * Creates random set of coordinates for the snake food.
     */
    function createFood() {
      food.FOOD_COLOUR = food.colours[Math.floor(Math.random()*7)]
      // Generate a random number the food x-coordinate
      food.x = randomTen(0, gameCanvas.width - 10);
      // Generate a random number for the food y-coordinate
      food.y = randomTen(0, gameCanvas.height - 10);
  

      // if the new food location is where the snake currently is, generate a new food location
      snakeOne.snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == food.x && part.y == food.y;
        if (foodIsoNsnake) createFood();
      });
    }

    /**
     * Draws the snake on the canvas
     */
    function drawSnake() {
      // loop through the snake parts drawing each part on the canvas
      snakeOne.snake.forEach(drawSnakePart)
      snakeTwo.snake.forEach(drawSnakePart)
    }

    /**
     * Draws a part of the snake on the canvas
     * @param { object } snakePart - The coordinates where the part should be drawn
     */
    function drawSnakePart(snakePart) {
      // Set the colour of the snake part
      ctx.fillStyle = snakeOne.SNAKE_COLOUR;

      // Set the border colour of the snake part
      ctx.strokestyle = snakeOne.SNAKE_BORDER_COLOUR;

      // Draw a "filled" rectangle to represent the snake part at the coordinates
      // the part is located
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

      // Draw a border around the snake part
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    function changeDirection(event) {
      const keyPressed = event.keyCode;
      snakeOne.changeDirection (keyPressed);
      snakeTwo.changeDirection (keyPressed);
    }