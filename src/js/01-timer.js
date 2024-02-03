import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const inputData = document.querySelector('input#datetime-picker');
const daysData = document.querySelector('[data-days]');
const hoursData = document.querySelector('[data-hours]');
const minutesData = document.querySelector('[data-minutes]');
const secondsData = document.querySelector('[data-seconds]');
let timeInterval;
let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
    updateTimerDisplay();
  },
};

function updateTimerDisplay() {
  const timeDifference = userSelectedDate - Date.now();
  const { days, hours, minutes, seconds } = convertMs(timeDifference);
  daysData.textContent = days.toString().padStart(2, '0');
  hoursData.textContent = hours.toString().padStart(2, '0');
  minutesData.textContent = minutes.toString().padStart(2, '0');
  secondsData.textContent = seconds.toString().padStart(2, '0');

  if (timeDifference <= 0) {
    stopTimer();
  }
}

startBtn.addEventListener('click', startTimer);

function startTimer() {
  inputData.disabled = true;
  startBtn.disabled = true;
  timeInterval = setInterval(() => {
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timeInterval);
  daysData.textContent = '00';
  hoursData.textContent = '00';
  minutesData.textContent = '00';
  secondsData.textContent = '00';
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
flatpickr(inputData, options);
