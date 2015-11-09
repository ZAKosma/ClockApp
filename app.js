//Player One's set time
var oneSeconds = 30;
//Player Two's set time
var twoSeconds = 10;
//Bool which stores which clock is active
var oneIsActive;

function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
  this.isPaused = true;
  this.startTime = Date.now();
  this.pauseTime = Date.now();
}

CountDownTimer.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  this.isPaused = false;
  //this.pauseTime = false;
  this.startTime = Date.now();
  var that = this,
      diff, obj;

  (function timer() {
    console.log("Start Time: " + that.startTime);
    console.log("Time: " + Date.now());
    if(that.isPaused){
      setTimeout(timer, that.granularity);
      return;
    }
    diff = that.duration -  (((Date.now() - that.startTime) / 1000) | 0);
    if (diff > 0){
      setTimeout(timer, that.granularity);
    } else {
      diff = 0;
      that.running = false;
    }

    obj = CountDownTimer.parse(diff);
    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }());
};

CountDownTimer.prototype.unpause = function(){
  this.isPaused = false;
  this.startTime += Date.now() - this.pauseTime;
};
CountDownTimer.prototype.pause = function(){
  //clearInterval(timerId);
  this.isPaused = true;
  this.pauseTime = Date.now();
};
CountDownTimer.prototype.togglePause = function(){
  //clearInterval(timerId);
  if(this.isPaused){
    this.unpause();
  }
  else {
    this.pause();
  }
};

CountDownTimer.prototype.onTick = function(ftn) {
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};


var main = function(){

  var displayOne = document.querySelector('#btntwo > p'),
      timerOne = new CountDownTimer(twoSeconds),
      timeObjOne = CountDownTimer.parse(timerOne.duration);

  var displayTwo = document.querySelector('#btnone > p'),
      timerTwo = new CountDownTimer(oneSeconds),
      timeObjTwo = CountDownTimer.parse(timerTwo.duration);

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
    timerOne.start();
  });
  $("#btntwo").click( function() {
    /*$("#btntwo > p").text(displayClock(seconds));*/
      timerTwo.start();
  });
  $("#pause").click( function(){
    timerOne.togglePause();
  });
};

$(document).ready(main);
