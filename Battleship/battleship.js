var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipsSunk: 0,
	shipLength: 3,
	ships: [ { locations: ["06", "16", "26"], hits: ["", "", ""] },
		     { locations: ["24", "34", "44"], hits: ["", "", ""] },
		     { locations: ["10", "11", "12"], hits: ["", "", ""] } ],

	generateShipLocations: function() {
	var locations;
	for (var i = 0; i < this.numShips; i++) { // For each ship we want to generate locations for
		do {
			locations = this.generateShip(); // We generate a new set of locations
		} while (this.collision(locations)); // and check to see if those locations overlap with any existing ships on the board. If they do, then we need to try again. So keep generating new locations until there's no collision
		this.ships[1].locations = locations; // Once again we have locations that work, we assign locations to the ship's locations property in the model.ships array.
    }
},	     

	
	fire: function(guess) {

		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMessage(guess);
		view.displayMessage("You missed.");

		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}	   
};

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess); // Using parseGuess to validate the player's guess
		if (location) {
			this.guesses++; // Encrease by 1 if the player entered a valid guess
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + "guesses"); // Show the player the total number of guesses they took to sink the ship. The guesses property is a property of "this" object, the controller.
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"]; // An array loaded with each letter that could be part of a valid guess.

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		firstChar = guess.charAt(0); // Grab the first character of the guess.
		var row = alphabet.indexOf(firstChar); // Using indexOf, we get back a number between zero and six that corresponds to the letter.
		var column = guess.charAt(1); // Grab the second character of the guess.

		if (isNaN(row) || isNaN(column)) { // Check to see if either of the row or column is not a number using the isNaN function
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { // Making sure that the numbers match the size of the board
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return	null;
}

function init() {
	var fireButton = document.getElementById("fireButton"); // Get reference to the Fire! button using the button's id.
	fireButton.onclick = handleFireButton; // Add a click handler function named handleFireButton to the button.
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress; // handleKeyPress - handles key press event from the HTML input field.
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton() { // called whenever the Fire! button is clicked
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value; // Get the guess from the input element
	controller.processGuess(guess); // Passing the player's guess to the controller.

	guessInput.value = ""; // Resets the form input element to be the empty string. This way you don't have to explicitly select the text and delete it before entering the next guess.
}

window.onload = init; // Run init when the page is fully loaded


