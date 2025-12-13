# 🛫 Airplane Ticket Booking System — Development Plan

## 🎯 Project Goal
A system to browse flights, select seats, and reserve tickets, including airports and destinations, with seat availability and expiration logic, but without payments.

---

## 🧱 Core Features
- Airports & destinations
- Flights (flight number, origin, destination, departure/arrival times)
- Airplane models (rows, columns)
- Seats per airplane
- Seat reservation with locking & expiration
- User accounts
- Flight filtering by origin/destination/date
- Optional React/Vite frontend for seat selection and filtering

❌ Payments  
❌ Boarding passes  
❌ Real-time updates / WebSockets  

---

## 🧠 Data Model

### Entities
- **Airport**: name, code (e.g., JFK), city, country
- **Airplane**: name, rows, columns
- **Seat**: airplane, row, column (A, B, C…)
- **Flight**: flight_number, airplane, origin, destination, departure_time, arrival_time
- **Reservation**: user, flight, seat, status (LOCKED / CONFIRMED / EXPIRED), expires_at
- **User**: Django built-in user

---

## 🗓️ Weekly Development Plan

### Week 1 — Project Setup & Base Models
**Tasks**
- Create Django project + `booking` app  
- Add models: Airport, Airplane, Flight  
- Setup admin panel  
- Flight list page (template)

**Outcome:** Users can see flights with origins and destinations.

---

### Week 2 — Seats
**Tasks**
- Create Seat model linked to Airplane  
- Auto-generate seats per airplane  
- Display seat grid for a flight

**Outcome:** Users can see seat layout and availability.

---

### Week 3 — Basic Reservation System
**Tasks**
- Create Reservation model  
- Book seat → status = LOCKED  
- Prevent double booking

**Outcome:** Basic seat reservation works.

---

### Week 4 — User Accounts & Authentication
**Tasks**
- Add Django authentication (register/login)  
- Associate reservations with users  
- “My reservations” page

**Outcome:** Users see only their reservations.

---

### Week 5 — Seat Lock Expiration Logic
**Tasks**
- Automatically release locked seats after X minutes  
- Can implement with Django management command + cron or check on page load

**Outcome:** Realistic seat locking behavior.

---

### Week 6 — Flight Filtering & Sorting
**Tasks**
- Filter flights by origin, destination, and date  
- Optional: sort by departure time or available seats

**Outcome:** Users can find flights efficiently.

---

### Week 7 — Admin Enhancements (Optional)
**Tasks**
- Add seat types (Business, Economy)  
- Flight creation with assigned airplane  
- Optional price calculation (without payments)

**Outcome:** Shows advanced modeling skills.

---

### Week 8 — Optional React/Vite Frontend
**Tasks**
- Create API endpoints for flights, seats, reservations  
- Replace seat grid / flight list with React components  
- Fetch data via `api.js` or Axios

**Outcome:** Modern interactive frontend with SPA behavior.

---

## 💡 Tips for Standing Out
- Implement **seat locking + expiration** as your signature feature  
- Add **flight filtering by origin/destination/date**  
- Keep **clean, normalized data models**  
- Make seat grid **visual with colors for available/locked/reserved**  
- API-first approach to show professionalism

---

## ✅ Safe Scope
| Feature | Complexity | Included? |
|---------|-----------|-----------|
| Airports & destinations | Low | ✅ |
| Flights | Low | ✅ |
| Airplane models & seats | Medium | ✅ |
| Seat reservation | Medium | ✅ |
| Seat locking & expiration | Medium-High | ✅ |
| User auth & reservations page | Medium | ✅ |
| Flight filtering/sorting | Medium | ✅ |
| API endpoints / React frontend | Optional | ✅ |

This keeps the project **manageable, expandable, and impressive**.
