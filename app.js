//Player One's set time
var oneSeconds = 150;
//Player Two's set time
var twoSeconds = 150;
//Bool which stores which clock is active
var oneIsActive;

function Timer(duration, granularity){
  //Used to track which clock to pause/start
  var timerId = null;
  //Duration in seconds
  this.duration = duration;
  //How often the clock is refreshed in miliseconds. (Defaults to 1000 miliseconds)
  this.granularity = granularity || 1000;
  //Functions that get called on tick
  this.tickFtns = [];
  //Similar to oneIsActive tells if the clock is running
  this.running = false;
}

//Start's the clock
Timer.prototype.clockStart = function() {
  if (this.timerId) return;
  timerId = setInterval(this.update(), 1000);
  var start = Date.now();
  this.update();
};
//Pause's the clock
Timer.prototype.clockStop = function() {
  clearInterval(timerId);
  timerId = null;
};
//Updates the time on the clock
Timer.prototype.update = function() {
  if(this.running){
    duration = duration - ((start - Date.now()) / 1000);

    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }
};
Timer.prototype.onTick = function(ftn){
  if(typeof ftn === 'function'){
    this.tickFtns.push(ftn);
  }
  return this;
};
Timer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};

var main = function(){

  var displayOne = document.querySelector('#btntwo > p'),
      timerOne = new Timer(oneSeconds),
      timeObjOne = Timer.parse(timerOne.duration);

  var displayTwo = document.querySelector('#btnone > p'),
      timerTwo = new Timer(twoSeconds),
      timeObjTwo = Timer.parse(timerTwo.duration);

  format(timeObjOne.minutes, timeObjOne.seconds);
  format(timeObjTwo.minutes, timeObjTwo.seconds);

  timerOne.onTick(format(displayOne));
  timerTwo.onTick(format(displayTwo));


    function format(display) {
        return function (minutes, seconds) {
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ':' + seconds;
        };
    }

  $("#btnone").click( function() {
    timerOne.clockStart();
  });
  $("#btntwo").click( function() {
    /*$("#btntwo > p").text(displayClock(seconds));*/
      timerTwo.clockStart();
  });
};

$(document).ready(main);
