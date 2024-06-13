import { html, render } from 'lit-html';
import { certificacion_motoko_backend } from 'declarations/certificacion_motoko_backend';

class App {
  events = [];
  reservations = [];

  constructor() {
    this.#render();
    this.loadEvents();
    this.loadReservations();
  }

  #handleEventSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      id: parseInt(document.getElementById('eventId').value),
      name: document.getElementById('eventName').value,
      description: document.getElementById('eventDescription').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      location: document.getElementById('eventLocation').value,
      capacity: parseInt(document.getElementById('eventCapacity').value),
      price: parseFloat(document.getElementById('eventPrice').value)
    };
    await certificacion_motoko_backend.createEvent(newEvent);
    this.loadEvents();
  };

  #handleReservationSubmit = async (e) => {
    e.preventDefault();
    const newReservation = {
      userId: document.getElementById('reservationUserId').value,
      eventId: parseInt(document.getElementById('reservationEventId').value),
      tickets: parseInt(document.getElementById('reservationTickets').value),
      status: "reserved"
    };
    await certificacion_motoko_backend.makeReservation(newReservation);
    this.loadReservations();
  };

  #handleDeleteEvent = async (eventId) => {
    // Función para eliminar el evento (debe estar implementada en el backend)
    await certificacion_motoko_backend.deleteEvent(eventId);
    this.loadEvents();
  };

  #handleDeleteReservation = async (userId, eventId) => {
    await certificacion_motoko_backend.cancelReservation(userId, eventId);
    this.loadReservations();
  };

  loadEvents = async () => {
    this.events = await certificacion_motoko_backend.listEvents();
    this.#render();
  };

  loadReservations = async () => {
    this.reservations = await certificacion_motoko_backend.listReservations();
    this.#render();
  };

  #render() {
    let body = html`
      <main>
        <form id="eventForm">
          <h2>Create Event</h2>
          <label for="eventId">ID: </label>
          <input id="eventId" type="number" required />
          <label for="eventName">Name: </label>
          <input id="eventName" type="text" required />
          <label for="eventDescription">Description: </label>
          <input id="eventDescription" type="text" required />
          <label for="eventDate">Date: </label>
          <input id="eventDate" type="date" required />
          <label for="eventTime">Time: </label>
          <input id="eventTime" type="time" required />
          <label for="eventLocation">Location: </label>
          <input id="eventLocation" type="text" required />
          <label for="eventCapacity">Capacity: </label>
          <input id="eventCapacity" type="number" required />
          <label for="eventPrice">Price: </label>
          <input id="eventPrice" type="number" step="0.01" required />
          <button type="submit">Create Event</button>
        </form>
        <br />
        <form id="reservationForm">
          <h2>Make Reservation</h2>
          <label for="reservationUserId">User ID: </label>
          <input id="reservationUserId" type="text" required />
          <label for="reservationEventId">Event ID: </label>
          <input id="reservationEventId" type="number" required />
          <label for="reservationTickets">Tickets: </label>
          <input id="reservationTickets" type="number" required />
          <button type="submit">Make Reservation</button>
        </form>
        <section>
          <h2>Events</h2>
          <div id="events">
            ${this.events.map(event => html`
              <div class="event">
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <p>Date: ${event.date}</p>
                <p>Time: ${event.time}</p>
                <p>Location: ${event.location}</p>
                <p>Capacity: ${event.capacity}</p>
                <p>Price: ${event.price}</p>
                <button @click="${() => this.#handleDeleteEvent(event.id)}">Delete</button>
              </div>
            `)}
          </div>
        </section>
        <section>
          <h2>Reservations</h2>
          <div id="reservations">
            ${this.reservations.map(reservation => html`
              <div class="reservation">
                <p>User ID: ${reservation.userId}</p>
                <p>Event ID: ${reservation.eventId}</p>
                <p>Tickets: ${reservation.tickets}</p>
                <p>Status: ${reservation.status}</p>
                <button @click="${() => this.#handleDeleteReservation(reservation.userId, reservation.eventId)}">Cancel</button>
              </div>
            `)}
          </div>
        </section>
      </main>
    `;
    render(body, document.getElementById('root'));
    document.getElementById('eventForm').addEventListener('submit', this.#handleEventSubmit);
    document.getElementById('reservationForm').addEventListener('submit', this.#handleReservationSubmit);
  }
}

export default App;

const app = new App();
