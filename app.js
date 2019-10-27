class Snake {
    constructor (player){
        this.player = player;
        this.SNAKE_COLOUR = "lightgreen";
        this.SNAKE_BORDER_COLOUR = "darkgreen";
        this.score = 0;
        this.changingDirection = false;
        this.snake =  [
            {x: 150, y: 150},
            {x: 140, y: 150},
            {x: 130, y: 150},
            {x: 120, y: 150},
            {x: 110, y: 150}
          ]
    }
    move (dx, dy) {
          // Create the new Snake's head
          const head = {x: this.snake[0].x + dx, y: this.snake[0].y + dy};
          // Add the new head to the beginning of snake body
          this.snake.unshift(head);
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
    const CANVAS_BORDER_COLOUR = 'black';
    const CANVAS_BACKGROUND_COLOUR = "white";

    // Horizontal velocity
    let dx = 10;
    // Vertical velocity
    let dy = 0;
    const food = new Food ();

    // Get the canvas element
    const gameCanvas = document.getElementById("gameCanvas");
    // Return a two dimensional drawing context
    const ctx = gameCanvas.getContext("2d");


    const snakeOne = new Snake ("Player One")

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
        clearCanvas();
        drawFood();
        advanceSnake();
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

    /**
     * Advances the snake by changing the x-coordinates of its parts
     * according to the horizontal velocity and the y-coordinates of its parts
     * according to the vertical veolocity
     */
    function advanceSnake() {

      snakeOne.move (dx, dy);

      const didEatFood = snakeOne.snake[0].x === food.x && snakeOne.snake[0].y === food.y;
      if (didEatFood) {
        // Increase score
        snakeOne.score += 10;
        snakeOne.SNAKE_COLOUR = food.FOOD_COLOUR;
        // Display score on screen
        document.getElementById('score').innerHTML = snakeOne.score;

        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        snakeOne.snake.pop();
      }
    }

    /**
     * Returns true if the head of the snake touched another part of the game
     * or any of the walls
     */
    function didGameEnd() {
      for (let i = 4; i < snakeOne.snake.length; i++) {
        if (snakeOne.snake[i].x === snakeOne.snake[0].x && snakeOne.snake[i].y === snakeOne.snake[0].y) return true
      }

      const hitLeftWall = snakeOne.snake[0].x < 0;
      const hitRightWall = snakeOne.snake[0].x > gameCanvas.width - 10;
      const hitToptWall = snakeOne.snake[0].y < 0;
      const hitBottomWall = snakeOne.snake[0].y > gameCanvas.height - 10;

      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
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

    /**
     * Changes the vertical and horizontal velocity of the snake according to the
     * key that was pressed.
     * The direction cannot be switched to the opposite direction, to prevent the snake
     * from reversing
     * For example if the the direction is 'right' it cannot become 'left'
     * @param { object } event - The keydown event
     */
    function changeDirection(event) {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      /**
       * Prevent the snake from reversing
       * Example scenario:
       * Snake is moving to the right. User presses down and immediately left
       * and the snake immediately changes direction without taking a step down first
       */
      if (snakeOne.changingDirection) return;
      snakeOne.changingDirection = true;

      const keyPressed = event.keyCode;

      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;

      if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
      }
      if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
      }
    }