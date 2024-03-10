const calendar = document.getElementById('calendar');

function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDayIndex = new Date(year, month, daysInMonth).getDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let calendarHTML = `
    <h2>${months[month]} ${year}</h2>
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
        calendarHTML += `<td>${day}</td>`;
        day++;
      }
    }
    calendarHTML += '</tr>';
  }

  calendarHTML += `
    </table>
  `;

  calendar.innerHTML = calendarHTML;
}

const now = new Date();
generateCalendar(now.getFullYear(), now.getMonth());