let eventsByMonth = {}; // Object to store events by month

function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDayIndex = new Date(year, month, daysInMonth).getDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let calendarHTML = `
    <div class="calendar-header">
      <h2>${months[month]} ${year}</h2>
      <button onclick="prevMonth()">&#60;</button> <!-- Button for previous month -->
      <button onclick="nextMonth()">&#62;</button> <!-- Button for next month -->
    </div>
    <table>
      <tr>
        ${weekdays.map(day => `<th>${day}</th>`).join('')}
      </tr>
  `;

  let day = 1;

  for (let i = 0; i < 6; i++) {
    calendarHTML += '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayIndex) {
        calendarHTML += `<td></td>`;
      } else if (day > daysInMonth) {
        break;
      } else {
        const currentDate = new Date();
        const isCurrentMonth = currentDate.getMonth() === month;
        const isCurrentDay = isCurrentMonth && day === currentDate.getDate();
        const eventDescription = eventsByMonth[year] && eventsByMonth[year][month] && eventsByMonth[year][month][day]; // Retrieve event for current day
        const isEvent = eventDescription !== undefined;
        const eventClass = isCurrentDay ? 'current-day' : isEvent ? 'event-day' : '';

        calendarHTML += `<td class="${eventClass}">${day}</td>`;
        day++;
      }
    }
    calendarHTML += '</tr>';
  }

  calendarHTML += `
    </table>
  `;

  const calendar = document.getElementById('calendar');
  calendar.innerHTML = calendarHTML;

  // Display events below the calendar
const eventContainer = document.getElementById('event-container');
eventContainer.innerHTML = ''; // Clear previous events

for (const day in eventsByMonth[year][month]) {
  const event = eventsByMonth[year][month][day];
  const eventElement = document.createElement('div');
  eventElement.classList.add('event');
  eventElement.innerHTML = `
    <div class="event-date" id = "eventDate">${months[month]} ${day}, ${year}</div>
    <div class="event-description">
      <a href="#" onclick="showImagePopup('${event.imagePath}')">${event.description}</a>
    </div>
  `;
  eventContainer.appendChild(eventElement);
}


}

function prevMonth() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  generateCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  generateCalendar(currentYear, currentMonth);
}

// Add a new event with a local image path
function addEvent(year, month, day, description, imagePath) {
  if (!eventsByMonth[year]) eventsByMonth[year] = {};
  if (!eventsByMonth[year][month]) eventsByMonth[year][month] = {};
  eventsByMonth[year][month][day] = { description, imagePath };
}

// Example events
addEvent(2024, 2, 16, "Shamrockpalooza!", "./images/Events/sea2marchEvent.png");
addEvent(2024, 3, 20, "The Final Season 2 Tournament!", "./images/Events/sea2aprilEvent.png");

function showImagePopup(imagePath) {
  if (imagePath) {
    const popupWidth = 600;
    const popupHeight = 400;
    const leftPosition = (window.screen.width - popupWidth) / 2;
    const topPosition = (window.screen.height - popupHeight) / 2;
    const popupWindow = window.open(imagePath, '', `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`);
    popupWindow.focus();
  }
}

// Initialize current year and month
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Generate calendar for the current month
generateCalendar(currentYear, currentMonth);