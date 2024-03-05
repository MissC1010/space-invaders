const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

//Creates 225 grid squares and appends them to the grid container
for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

//creates squares array from grid div's
const squares = Array.from(document.querySelectorAll(".grid div"));

//Initializes the indices of initial alien invaders.
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

// draw adds invader class to grid squares where aliens present
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}

draw();

//Removes the "invader" class from grid squares.
function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}

//Adds the "shooter" class to the initial position of the player's shooter.
squares[currentShooterIndex].classList.add("shooter");

//Updates the position of the player's shooter based on arrow key input.
function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

//Manages the movement of alien invaders, including edge cases
// and collision detection with the player's shooter.
function moveInvaders() {
  // Determines whether the alien invaders have reached the left or right edge of the game grid.
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  //Calls the remove() function to clear the previous positions of the alien invaders on the grid.
  remove();

  //Handles the movement of alien invaders horizontally and adjusts their positions based on grid width and direction.
  //If invaders reach the right edge and are moving right, they move down and change direction. same logic is applied for left edge.
  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  //Calls the draw() function to display the alien invaders in their new positions on the grid.
  draw();

  //checks if the player's shooter has collided with any alien invader. If so, it displays "GAME OVER" and stops the game.
  if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
    resultsDisplay.innerHTML = "GAME OVER";
    clearInterval(invadersId);
  }
  //If alien invader reaches bottom of grid, it triggers a game over and stops the game.
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length) {
      resultsDisplay.innerHTML = "GAME OVER";
      clearInterval(invadersId);
    }
  }
  //If all alien invaders removed, player wins and  game stops.
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = " YOU WIN";
    clearInterval(invadersId);
  }
}
//controls speed of invaders
invadersId = setInterval(moveInvaders, 500);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  //The shoot(e) function is responsible for implementing the shooting mechanism when the player presses the arrow up key
  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultsDisplay.innerHTML = results;
      console.log(aliensRemoved);
    }
  }
  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
