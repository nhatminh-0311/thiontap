// timer.js

let totalTime = 99999999999 * 5; // thời gian thi (tính bằng giây) - ở đây là 10 phút
let timerInterval;

function startTimer(onTimeUp) {
  const timeDisplay = document.getElementById("timeLeft");

  timerInterval = setInterval(() => {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    if (timeDisplay) {
      timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    totalTime--;

    if (totalTime < 0) {
      clearInterval(timerInterval);
      alert("⏰ Hết giờ! Bài thi sẽ được nộp tự động.");
      if (typeof onTimeUp === "function") onTimeUp();
    }
  }, 1000);
}
