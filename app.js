//Player One's set time
var oneSeconds = 150;
//Player Two's set time
var twoSeconds = 150;
//Bool which stores which clock is active
var oneIsActive;

function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
}

CountDownTimer.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  var start = Date.now(),
      that = this,
      diff, obj;

  (function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);

    if (diff > 0) {
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
  this.running = true;
};
CountDownTimer.prototype.pause = function(){
  clearInterval(timerId)
  timerId = null

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
      timerOne = new CountDownTimer(oneSeconds),
      timeObjOne = CountDownTimer.parse(timerOne.duration);

  var displayTwo = document.querySelector('#btnone > p'),
      timerTwo = new CountDownTimer(twoSeconds),
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
};

$(document).ready(main);
