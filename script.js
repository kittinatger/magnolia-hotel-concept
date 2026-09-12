document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formNote = document.getElementById('formNote');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thank you — this is a demo form and does not send a real message yet.';
    contactForm.reset();
  });
}

const eventCalendar = document.getElementById('eventCalendar');
if (eventCalendar) {
  const activities = [
    'Paddle Boat', 'Fire Dance', 'Traditional Craft Booths', 'Fashion Show',
    'Traditional Cooking & Baking', 'Art: Paint, Clay & Flower Crafts',
    'Spa', 'Fishing', 'Animal Watching', 'Mini World — Landmarks of the World'
  ];
  const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const monthLabelFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect every upcoming Saturday/Sunday for the next ~4 months so
  // guests can plan that far ahead. Always computed from "today", so
  // this list is never stale no matter when the page loads.
  const horizonEnd = new Date(today);
  horizonEnd.setMonth(horizonEnd.getMonth() + 4);

  const upcomingWeekendDates = [];
  const cursor = new Date(today);
  while (cursor < horizonEnd) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      upcomingWeekendDates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  // Group into month sections so the calendar reads as a scannable
  // list rather than one giant scrolling row.
  const monthGroups = [];
  upcomingWeekendDates.forEach((date, i) => {
    const label = monthLabelFmt.format(date);
    let group = monthGroups.find((g) => g.label === label);
    if (!group) {
      group = { label, dates: [] };
      monthGroups.push(group);
    }
    group.dates.push({ date, activity: activities[i % activities.length] });
  });

  eventCalendar.innerHTML = monthGroups
    .map(
      (group) => `
        <div class="calendar-month">
          <p class="calendar-month-label">${group.label}</p>
          <div class="calendar-strip">
            ${group.dates
              .map(
                ({ date, activity }) => `
                  <div class="calendar-card">
                    <span class="cal-weekday">${weekdayFmt.format(date)}</span>
                    <span class="cal-day">${date.getDate()}</span>
                    <span class="cal-month">${monthFmt.format(date)}</span>
                    <span class="cal-activity">${activity}</span>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `
    )
    .join('');
}
