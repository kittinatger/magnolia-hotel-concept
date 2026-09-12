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

const eventModal = document.getElementById('eventModal');
const eventInfo = {};
if (eventModal) {
  const modalEyebrow = document.getElementById('eventModalEyebrow');
  const modalTitle = document.getElementById('eventModalTitle');
  const modalBody = document.getElementById('eventModalBody');
  let lastFocused = null;

  // body is an array of segments: a string renders as a paragraph,
  // a nested array renders as a bullet list — lets a single modal
  // mix narrative paragraphs with a detail list in any order.
  const openInfoModal = (eyebrow, title, body) => {
    modalEyebrow.textContent = eyebrow || '';
    modalTitle.textContent = title;
    modalBody.innerHTML = '';
    const segments = Array.isArray(body) ? body : [body];
    segments.forEach((segment) => {
      if (Array.isArray(segment)) {
        const ul = document.createElement('ul');
        ul.className = 'event-modal-list';
        segment.forEach((line) => {
          const li = document.createElement('li');
          li.textContent = line;
          ul.appendChild(li);
        });
        modalBody.appendChild(ul);
      } else if (segment) {
        const p = document.createElement('p');
        p.textContent = segment;
        modalBody.appendChild(p);
      }
    });
    lastFocused = document.activeElement;
    eventModal.classList.add('open');
    eventModal.setAttribute('aria-hidden', 'false');
    eventModal.querySelector('.event-modal-close').focus();
  };

  const closeEventModal = () => {
    eventModal.classList.remove('open');
    eventModal.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
  };

  eventModal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeEventModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eventModal.classList.contains('open')) closeEventModal();
  });

  document.querySelectorAll('.event-pill[data-event]').forEach((pill) => {
    const name = pill.dataset.event;
    const desc = pill.dataset.desc;
    const detail = pill.dataset.detail;
    const facts = (pill.dataset.facts || '').split('|').filter(Boolean);
    eventInfo[name] = detail ? `${desc} ${detail}` : desc;
    pill.addEventListener('click', () => openInfoModal('Weekend Event', name, [desc, detail, facts]));
  });

  const seasonExtras = {
    Summer: {
      intro: 'Long days on the water and in the pines — Magnolia’s busiest, brightest season, with warm afternoons and cool evenings on the lake.',
      moment: 'Guests linger longest at golden hour, when the paddle boats come out and the light on Fallen Leaf Lake turns amber.',
      facts: ['Average highs: 75–85°F (24–29°C)', 'Pack: swimwear, sun hat, insect repellent', 'Signature moment: sunset paddle on the lake']
    },
    Autumn: {
      intro: 'The mountains turn gold before the first snow, and the crowds thin out — a quieter, slower stretch on the grounds.',
      moment: 'The Honeymoon Bluff trail is at its best here, with the whole valley turning color below the lookout.',
      facts: ['Average highs: 55–68°F (13–20°C)', 'Pack: layers, waterproof boots', 'Signature moment: sunrise at Honeymoon Bluff']
    },
    Winter: {
      intro: 'The season Magnolia’s North Wing was built for: deep snow, deep quiet, and a fire waiting in every room.',
      moment: 'Evenings end on the lake, where a cleared rink stays lit for skating long after the ski trails close.',
      facts: ['Average highs: 25–40°F (-4–4°C)', 'Pack: ski gear, thermal layers', 'Signature moment: ice skating under string lights']
    },
    Spring: {
      intro: 'The quietest, greenest season on the grounds, as the wildlife wakes up and the trails empty out.',
      moment: 'Otters are most active in the early morning, playing in the shallows just past the lobby dock.',
      facts: ['Average highs: 50–65°F (10–18°C)', 'Pack: light layers, rain jacket', 'Signature moment: otters at play near the lobby dock']
    }
  };

  document.querySelectorAll('.season-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const months = card.querySelector('.season-months').textContent;
    const items = Array.from(card.querySelectorAll('li')).map((li) => li.textContent);
    const extra = seasonExtras[title] || {};
    card.addEventListener('click', () =>
      openInfoModal(`Season · ${months}`, title, [extra.intro, items, extra.moment, extra.facts])
    );
  });

  const roomAmenities = {
    'Standard Rooms': ['Premium bathroom with rain shower', 'Separate soaking tub in select rooms', 'Small indoor lounge or desk nook', 'Daily housekeeping'],
    'Luxury Suites': ['Distinct, separate living room', 'Private bedroom with enhanced closets', 'Upgraded balcony or terrace', 'Premium bath amenities'],
    'Resort Villas & Bungalows': ['Private plunge pool or Jacuzzi', 'Dedicated outdoor seating', 'Sun deck among the pines', 'Expansive indoor-outdoor flow']
  };

  document.querySelectorAll('.room-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const tag = card.querySelector('.room-tag').textContent;
    const size = card.querySelector('.room-size').textContent;
    const desc = card.querySelector('.room-body > p:last-child').textContent;
    const note = 'Available in all four wings — South, East, North & West — each priced individually.';
    const amenities = roomAmenities[title] || [];
    card.addEventListener('click', () => openInfoModal(tag, title, [size, desc, amenities, note]));
  });

  const buildingNarratives = {
    South: {
      paragraphs: [
        "Step through the South Wing's carved lattice screens and the air changes — warmer, greener, closer to the coast. This is Magnolia's tribute to the beach towns and river deltas of Southeast Asia: open-air walkways, dark tropical hardwoods, and gardens that spill right up to the windows.",
        "Rooms open onto private courtyards planted with ferns and flowering shrubs, echoing the region's love of bringing the outdoors in. Woven rattan, batik-inspired textiles, and soft brass fixtures carry the palette through every suite, while a rain-shower bathroom nods to the monsoon season the region is built around.",
        "In the evenings, the wing's ground-floor terrace becomes an informal night market corner during weekend shows — the closest thing on the property to a street food lane in Bangkok or Hoi An, minus the flight."
      ],
      details: ['Open-air lattice screens throughout', 'Private courtyards with rain-shower baths', 'Ground-floor terrace hosts the weekend night market']
    },
    East: {
      paragraphs: [
        "The East Wing slows you down on purpose. Clean timber lines, paper-soft light through shoji-style screens, and long sightlines toward the garden borrow from a design language built around stillness — the kind found in a tea room or a temple courtyard.",
        "Interiors favor restraint over ornament: a single ceramic vessel, a low platform bed, a window framed like a piece of art. Materials are natural and honest — unlacquered wood, stone, washi-textured paper — chosen to age quietly rather than demand attention.",
        "It's the wing guests return to for the seasonal rituals Magnolia is built around: watching the first snow settle over the pines, or the blueberry bushes ripen in summer, from a room designed to make watching feel like the whole point."
      ],
      details: ['Shoji-style screens and low platform beds', 'Natural, unlacquered materials throughout', 'Long sightlines framed toward the garden']
    },
    North: {
      paragraphs: [
        "The North Wing is built for the mountain — thick felted textiles, deep saturated color, and a hearth-forward layout that makes every room feel like it's facing a fire even when it isn't. It draws on the nomadic craft traditions of North and Central Asia: hand-knotted rugs, embroidered wool, carved wooden furniture with real weight to it.",
        "This is the wing that leans hardest into Magnolia's winter identity. Rooms are oriented toward the Gunflint Trail views, with boot rooms and gear storage built in rather than bolted on, so the transition from a day of skiing or ice fishing to a warm room is as short as possible.",
        "Color does the work other wings leave to texture — rust, ochre, and deep indigo against pale plaster walls, a palette meant to hold its own against a snow-white world outside the window."
      ],
      details: ['Hearth-forward room layouts', 'Built-in boot rooms and gear storage', 'Hand-knotted rugs and embroidered wool textiles']
    },
    West: {
      paragraphs: [
        "The West Wing carries the pattern language of the old spice routes — hand-blocked textiles, geometric tilework underfoot, and archways that turn every hallway into a small procession. It's the most ornamented of Magnolia's four wings, built on the idea that beauty can be structural, not just decorative.",
        "Deep jewel tones sit against whitewashed walls, and courtyard-facing rooms use latticed screens to filter light into shifting geometric patterns through the day — a nod to the region's long history of turning climate control into art.",
        "In the evenings, the wing's covered walkway is where the weekend market's textile and spice-inspired craft booths tend to gather, keeping the wing's spirit alive outside its own walls."
      ],
      details: ['Hand-blocked textiles and geometric tilework', 'Latticed screens filter light into shifting pattern', 'Covered walkway hosts the weekend craft booths']
    }
  };

  document.querySelectorAll('.building-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const wing = buildingNarratives[title];
    if (!wing) return;
    card.addEventListener('click', () =>
      openInfoModal('Wing', title, [...wing.paragraphs, wing.details])
    );
  });

  // Expose so the calendar (built below) can reuse the same modal.
  window.__openEventModal = (name, desc) => openInfoModal('Weekend Event', name, desc);
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

  const monthHtml = (group, hidden) => `
    <div class="calendar-month${hidden ? ' calendar-extra' : ''}"${hidden ? ' hidden' : ''}>
      <p class="calendar-month-label">${group.label}</p>
      <div class="calendar-strip">
        ${group.dates
          .map(
            ({ date, activity }) => `
              <button type="button" class="calendar-card" data-event="${activity}" data-date="${weekdayFmt.format(date)} ${monthFmt.format(date)} ${date.getDate()}">
                <span class="cal-weekday">${weekdayFmt.format(date)}</span>
                <span class="cal-day">${date.getDate()}</span>
                <span class="cal-month">${monthFmt.format(date)}</span>
                <span class="cal-activity">${activity}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </div>
  `;

  // Start collapsed to just the first month; the rest expand on demand.
  const monthsHtml = monthGroups
    .map((group, i) => monthHtml(group, i > 0))
    .join('');

  const hasMore = monthGroups.length > 1;
  const toggleHtml = hasMore
    ? `<button type="button" class="btn btn-ghost calendar-toggle" id="calendarToggle">View More Weekends</button>`
    : '';

  eventCalendar.innerHTML = `<div class="calendar-months">${monthsHtml}</div>${toggleHtml}`;

  eventCalendar.querySelectorAll('.calendar-card[data-event]').forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.dataset.event;
      const desc = eventInfo[name] || '';
      const date = card.dataset.date;
      if (window.__openEventModal) {
        window.__openEventModal(name, date ? `${date} — ${desc}` : desc);
      }
    });
  });

  const calendarToggle = document.getElementById('calendarToggle');
  if (calendarToggle) {
    calendarToggle.addEventListener('click', () => {
      const expanded = eventCalendar.classList.toggle('calendar-expanded');
      eventCalendar.querySelectorAll('.calendar-extra').forEach((el) => {
        el.hidden = !expanded;
      });
      calendarToggle.textContent = expanded ? 'View Fewer Weekends' : 'View More Weekends';
    });
  }
}
