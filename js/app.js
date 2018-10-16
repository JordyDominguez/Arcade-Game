let lives = 5;
let over = false;
let highScore = 0;
let boatsLeft = [];
let i = 0;
let randX = 0;
let randY = 0;

// Grabs boat for Boat System
const boats = document.querySelectorAll('ul.boats li');
//Get Score Class
const score = document.querySelector('.score');
//Get Modal element
const modal = document.querySelector('.modal');
//Get Outcome Class
const outcome = document.querySelector('.outcome');
//Get Modal Final Score Class
const finalScore = document.querySelector('.final-score');

// Sharks our player must avoid
class Shark {
    constructor(x, y, s) {
        this.sprite = 'images/enemy-shark.png';
        this.x = x;
        this.y = y;
        this.s = Math.random() * 100 + 100;
    }
}

// Update the Sharks's position, required method for game
// Parameter: dt, a time delta between ticks
Shark.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.s * dt;
    this.x += 1;
    if (this.x > 500) {
        this.x = -100;
        this.s = Math.random() * 100 + 100;
    }
};

// Draw the Shark on the screen, required method for game
Shark.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Crabs our player must avoid
class Crab {
    constructor(x, y, s) {
        this.sprite = 'images/enemy-crab.png';
        this.x = x;
        this.y = y;
        this.s = Math.random();
    }
}

// Update the Crab's position, required method for game
// Parameter: dt, a time delta between ticks
Crab.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.s * dt;
    this.x += 1;
    if (this.x > 500) {
        this.x = -100;
        this.s = Math.random() * 100 + 100;
    }
};

// Draw the Crab on the screen, required method for game
Crab.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem class
// This class requires an update(), and a render() method.
class Gem {
    constructor (x, y, s) {
        this.sprite = 'images/gem-orange.png';
        this.x = 200;
        this.y = 200;
    }
}

// Update the Crab's position based on the randomized
//gemPosition function
Gem.prototype.update = function() {
    this.x = randX;
    this.y = randY;
};

// Draw the Gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Randomizes position of Gem function
const gemPosition = function() {
    const xPos = [0, 100, 200, 300, 400];
    const yPos = [-20, 64, 148, 232, 316, 400];

    randX = xPos[Math.floor(Math.random() * xPos.length)];
    randY = yPos[Math.floor(Math.random() * yPos.length)];
};

gemPosition();

//Hides Gem when collected
const gemCollected = function() {
    randX = -200;
    randY = -200;
};

// Player class
// This class requires an update(), render() and
// a handleInput() method.
class Player{
    constructor (x, y, s) {
        this.sprite = 'images/boat.png';
        this.x = 200;
        this.y = 400;
        this.s = s;
    }
}

// Checks for Collision, Checks for Gem Collection, Checks for Game Over
Player.prototype.update = function(dt) {
// Collision detection
    if (over == false) {
      // Collision Shark
        for (let shark of allSharks) {
            let collisionX = this.x - shark.x - 15;
            let collisionY = this.y - shark.y - 20;
            let distance = Math.sqrt(collisionX * collisionX + collisionY * collisionY);
            if (distance < 56) {
                lives -= 1;
                this.y = 400;
                this.x = 200;
                i = boatsLeft.length - 1;
                boatSystem();
                gemPosition();
            }
      }
      // Collision Crab
        let crabCollisionX = this.x - crab.x;
        let crabCollisionY = this.y - crab.y;
        let crabDistance = Math.sqrt(crabCollisionX * crabCollisionX + crabCollisionY * crabCollisionY);
        if (crabDistance < 56) {
            lives -= 1;
            this.y = 400;
            this.x = 200;
            i = boatsLeft.length - 1;
            boatSystem();
            gemPosition();
        }



      // Did Player collect gem
        let collectionX = this.x - gem.x - 15;
        let collectionY = this.y - gem.y - 20;
        let distance = Math.sqrt(collectionX * collectionX + collectionY * collectionY);
        if (distance < 56) {
            highScore += 3;
            score.innerText = highScore;
            gemCollected();
        }


      // Did Player Score
        if (this.y < 10) {
            highScore += 1;
            this.y = 400;
            this.x = 200;
            score.innerText = highScore;
            gemPosition();
        }

      // Is game over
        if (lives == 0) {
            over = true;
            openModal();
        }
    }
};

// Update the Player's position
Player.prototype.handleInput = function(dt) {
    if (over == false){
        switch (dt) {
            case "up":
                this.y -= 84;
                break;
        }

        if (this.y <= 350){
            switch (dt) {
                case "down":
                    this.y += 84;
                    break;
            }
        }

        if (this.x >= 50){
            switch (dt) {
                case "left":
                    this.x -= 100;
                    break;
            }
        }

        if (this.x <= 350){
            switch (dt) {
                case "right":
                    this.x += 100;
                    break;
            }
        }
    }
};

// Draw the Gem on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Instantiate  objects.
var allSharks = [new Shark(-100, 226), new Shark(-100, 143), new Shark(-100, 60), new Shark(-100, 60)];
var crab = new Crab(-100, 316);
var gem = new Gem();
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// Add the boats to an array to then be able to remove
// the icon when the player loses a life, with boatSystem
boats.forEach(function(boat){
    boatsLeft.push(boat);
});

 const boatSystem = () => {
    boats[i].style.visibility = "hidden";
    boatsLeft.pop();
 };

// End Game Function to Open Modal
function openModal() {
    modal.style.display = "flex";
    if (lives == 0) {
        outcome.innerHTML += `GAME OVER!`;
        finalScore.innerHTML += `You made it out of the beach ${highScore} time(s)!`;
    }

}
// Restart button for the modal
 const restartButton = document.querySelector('.play-again');
 restartButton.addEventListener('click', function() {
    document.location.reload();
 });
