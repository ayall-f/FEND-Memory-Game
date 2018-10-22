/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Create a list that holds all of your cards
 */

const icons = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];

/*
 * Global Variables
 */
const cardsContainer   = document.querySelector(".deck");
const movesContainer   = document.querySelector(".moves");
const starsContainer   = document.querySelector(".stars");
const rateContainer    = document.querySelector("#rate");
const restartBtn       = document.querySelector(".restart");
const modal            = document.querySelector(".modal");
const hoursContainer   = document.querySelector("#hours");
const minutesContainer = document.querySelector("#minutes");
const secondsContainer = document.querySelector("#seconds");


let openedCards = [];
let matchedCards = [];

/*
* Shuffle the Cards
*/
let shuffledIcons;
shuffledIcons = shuffle(icons);
console.log(shuffledIcons);

/*
* Initialize the Game
*/
function init() {
  for (let i = 0; i < icons.length; i++) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<i class="${icons[i]}"></i>`;
    cardsContainer.appendChild(card);

    // Add click event to each card
    click(card);

  }
}

/*
* Click Event
*/
function click(card) {
  //Card click event
  card.addEventListener("click", function () {

    const currentCard = this;
    const previousCard = openedCards[0];

    //We have an existing opened card
    if (openedCards.length === 1) {

      card.classList.add("open", "show", "disable");
      openedCards.push(this);

      //Compare 2 opened cards
      compare(currentCard, previousCard);

    } else {
      //We don't have any opened cards
      currentCard.classList.add("open", "show", "disable");
      openedCards.push(this);
    }

      //The First Click? Start the timer!
     if(firstClick) {
         startTimer();
         firstClick = false; // This will prevent the timer to start again if the user clicked on another card
     }

  })
}

/*
* Compare the 2 cards
*/
function compare(currentCard, previousCard) {

  // Matcher
  if (currentCard.innerHTML === previousCard.innerHTML) {

    //Matched cards
    currentCard.classList.add("match");
    previousCard.classList.add("match");

    matchedCards.push(currentCard, previousCard);

    openedCards = [];

    //Check if the game is over
    isOver();

  } else {

    //Wait 500ms then, do this
    setTimeout(function () {
      currentCard.classList.remove("open", "show", "disable");
      previousCard.classList.remove("open", "show", "disable");
    }, 500);

    openedCards = [];

  }

  // Add new move
  addMove();

}

/*
* Check if the game is over
*/
function isOver() {
  if (matchedCards.length === icons.length) {
    modalMessage();
    stopTimer();
  }
}

/*
* Add Move
*/
let moves = 0;
movesContainer.innerHTML = 0;
function addMove() {
    moves++;
    movesContainer.innerHTML = moves;

    // Set the rating
    rating();
}

/*
* Rating
*/
starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;
function rating() {

    if (17 < moves) {
      starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>`;
    } else {
       starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;
    }
}

/*
* Restart Button
*/
let seconds, minutes, hours, totalTime = 0;
let firstClick = true;
restartBtn.addEventListener("click", function (){

  // Delete all cards
  cardsContainer.innerHTML = "";

  // Call 'init' to create new cards
  init();

  // Reset any related variables
  matchedCards = [];
  moves = 0;
  totalTime = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  firstClick = true;
  stopTimer();

  movesContainer.innerHTML = moves;
  starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>`;
});


// Start the For the First Time
init();

/*
 * Timer [ Start ]
 */
let incrementer;
function startTimer() {

    // Start Incrementer
    incrementer = setInterval(function() {

        // Add totalTime by 1
        totalTime += 1;

        // Convert Total Time to H:M:S
        calculateTime(totalTime);

        // Change the current time values
        secondsContainer.innerHTML = seconds;
        minutesContainer.innerHTML = minutes;
        hoursContainer.innerHTML   = hours;

    }, 1000);

}

/*
 * Timer [ Calculate Time ]
 */
function calculateTime(totalTime) {
    hours   = Math.floor( totalTime / 60 / 60);
    minutes = Math.floor( (totalTime / 60) % 60);
    seconds = totalTime % 60;
}

/*
 * Timer [ Stop ]
 */
function stopTimer() {
    // Stop Timer
    clearInterval(incrementer);
    secondsContainer.innerHTML = 0;
    minutesContainer.innerHTML = 0;
    hoursContainer.innerHTML   = 0;

}

/*
* Modal
*/
function modalMessage() {
    // Display the modal
    modal.style.top = "0";

    // Add moves to the Modal
    const totalMoves = document.querySelector("#moves");
    totalMoves.innerHTML = moves;

    // Add Rate
    let starsNum;
    starsNum = document.getElementsByClassName("fa fa-star").length;
    rateContainer.innerHTML = starsNum;

    // Stop Timer
    stopTimer();

    // Add time to the Modal
    const modalHours       = document.querySelector("#modal-hours");
    const modalMinutes     = document.querySelector("#modal-minutes");
    const modalSeconds     = document.querySelector("#modal-seconds");
    modalHours.innerHTML   = hours;
    modalMinutes.innerHTML = minutes;
    modalSeconds.innerHTML = seconds;
}

/*
 * Start Again Buttons
 */
const repeatBtn          = document.querySelector(".start-again");
const repeatBtnFromModal = document.querySelector(".modal .start-again");

repeatBtn.addEventListener("click", function() {

    // Delete all cards
    cardsContainer.innerHTML = "";

});
repeatBtnFromModal.addEventListener("click", function () {

    // Hide the modal
    modal.style.top = "-150%";

    // Call 'init' to create new cards
    init();

    // Reset any related variables
    matchedCards = [];
    moves = 0;
    totalTime = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    firstClick = true;
    stopTimer();
    
    movesContainer.innerHTML = moves;
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`;
});




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
