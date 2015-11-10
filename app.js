//Player One's set time
var oneSeconds = 65;
//Player Two's set time
var twoSeconds = 15;
//Bool which stores which clock is active
var oneIsActive;

function CountDownTimer(duration, granularity) {
  //The time to count
  this.duration = duration;
  //In miliseconds how often to refresh the timer
  this.granularity = granularity || 1000;
  //All the functions to call when the timer ticks
  this.tickFtns = [];
  //True if the clock has not reached zero and has been started
  this.running = false;
  //Tells the timer function not to tick if it is paused
  this.isPaused = true;
  //Stores when the clock started according to local machine time
  this.startTime = Date.now();
  //Stores when the clock paused according to the local machine time
  this.pauseTime = Date.now();
}

CountDownTimer.prototype.start = function() {
  //If the clock is already running it doesn't need to be started again
  if (this.running) {
    return;
  }
  this.running = true;
  this.isPaused = false;
  //Sets the start time to the current date as of the timer starting
  this.startTime = Date.now();
  //Gives the timer function access to CountDownTimer variables
  var that = this,
      diff, obj;

  (function timer() {
    //Prevents the timer from ticking and calculating time past inbetween calls
    if(that.isPaused){
      setTimeout(timer, that.granularity);
      return;
    }
    //Calculates the difference between now and the start time
    //Divides by 1000 to take away the miliseconds from the Timer
    // | 0 bit wise operator that prevents skipping
    // Calls to tick again if there are seconds left
    // Otherwise it sets the diff to 0 and turns running to false
    diff = that.duration -  (((Date.now() - that.startTime) / 1000) | 0);
    if (diff > 0){
      setTimeout(timer, that.granularity);
    } else {
      diff = 0;
      that.running = false;
    }
    //Parses the diff into a Minutes:Seconds format and sets it to the obj variable
    obj = CountDownTimer.parse(diff);
    //Calls all the tick functions (Format)
    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }());
};

CountDownTimer.prototype.unpause = function(){
  this.isPaused = false;
  //Adds the total time paused to startTime
  this.startTime += Date.now() - this.pauseTime;
};
CountDownTimer.prototype.pause = function(){
  this.isPaused = true;
  this.pauseTime = Date.now();
};
CountDownTimer.prototype.togglePause = function(){
  //If paused unpause, otherwise pause
  if(this.isPaused){
    this.unpause();
  }
  else{
    this.pause();
  }
};

CountDownTimer.prototype.onTick = function(ftn) {
  //Pushes function to the tickFtns array if it is a function
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  //Tells you if the timer has run out or if it has not started
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  //Converts seconds into minute:second format
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};


var main = function(){
  //Query selector selects the HTML paragraph object of the opposite player
  //Sets a variable to a new CountDownTimer with playerOne's default seconds
  var displayOne = document.querySelector('#btntwo > p'),
      timerOne = new CountDownTimer(twoSeconds);

  var displayTwo = document.querySelector('#btnone > p'),
      timerTwo = new CountDownTimer(oneSeconds);

  timerOne.onTick(format(displayOne));
  timerTwo.onTick(format(displayTwo));


    function format(display) {
        return function (minutes, seconds) {
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ':' + seconds;
        };
    }
  if(timerOne.running === false && timerTwo.running === false){
    timerOne.start();
    timerTwo.start();

    timerOne.pause();
    oneIsActive= true;
  }

  $("#btnone").click( function() {
    console.log("btnone: Pressed");
    if(timerOne.isPaused === false && timerTwo.isPaused === true){
      console.log("btnone: Ran");
      timerOne.togglePause();
      timerTwo.togglePause();

      oneIsActive = false;
    }
  });
  $("#btntwo").click( function() {
    console.log("btntwo: Pressed");
    if(timerOne.isPaused === true && timerTwo.isPaused === false){
      console.log("btntwo: Ran");
      timerOne.togglePause();
      timerTwo.togglePause();

      oneIsActive = true;
    }
  });
  $("#pause").click( function(){
    if(oneIsActive === true){
      timerOne.togglePause();
    }
    else {
      timerTwo.togglePause();
    }
  });
};

$(document).ready(main);
