import List "mo:base/List";

actor Reservas{
    public type Event = {
        id: Nat;
        name: Text;
        description: Text;
        date: Text;
        time: Text;
        location: Text;
        capacity: Nat;
        price: Float;
    };

    public type Reservation = {
        userId: Text;
        eventId: Nat;
        tickets: Nat;
        status: Text;  // "reserved", "paid", "cancelled"
    };

    private var events: List.List<Event> = List.nil<Event>();
    private var reservations: List.List<Reservation> = List.nil<Reservation>();

    public func createEvent(newEvent: Event): async Bool {
        events := List.push(newEvent, events);
        return true;
    };

    public func listEvents(): async [Event] {
        return List.toArray(events);
    };

    public func listReservations(): async [Reservation] {
        return List.toArray(reservations);
    };

    public func makeReservation(newReservation: Reservation): async Bool {
        reservations := List.push(newReservation, reservations);
        return true;
    };

    public func cancelReservation(userId: Text, eventId: Nat): async Bool {
        var updatedReservations: List.List<Reservation> = List.nil<Reservation>();
        var updated = false;

        for (res in List.toArray(reservations).vals()) {
            if (res.userId == userId and res.eventId == eventId) {
                updatedReservations := List.push({ res with status = "cancelled" }, updatedReservations);
                updated := true;
            } else {
                updatedReservations := List.push(res, updatedReservations);
            }
        };

        reservations := updatedReservations;
        return updated;
    };

        public func deleteEvent(eventId: Nat): async Bool {
        var updatedEvents: List.List<Event> = List.nil<Event>();
        var updated = false;

        for (event in List.toArray(events).vals()) {
            if (event.id != eventId) {
                updatedEvents := List.push(event, updatedEvents);
            } else {
                updated := true;
            }
        };

        events := updatedEvents;
        return updated;
    }
}