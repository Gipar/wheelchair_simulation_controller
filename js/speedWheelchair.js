/**
 *   Robot Speed
 */
var btnSpeedIncrease = document.getElementById('btn-speed-increase');
var btnSpeedDecrease = document.getElementById('btn-speed-decrease');
 
btnSpeedIncrease.addEventListener('click', () => {
  var speedValue = document.getElementById('speed-value');

  if(speedValue.value < 5) {
    speedFactor = speedFactor + 0.5;
    speedValue.value = speedFactor;
  }
});
 
btnSpeedDecrease.addEventListener('click', () => {
  var speedValue = document.getElementById('speed-value');

  if(speedValue.value > 0.5) {
    speedFactor = speedFactor - 0.5;
    speedValue.value = speedFactor;
  }
});
