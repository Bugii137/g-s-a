# KabHub Kenya - Garage Management System

## Overview

KabHub Kenya is a Garage Management System designed to streamline automotive service bookings, manage appointments, billing, and service offerings for garages across Kenya. The system features both user and admin interfaces, allowing customers to book services and administrators to manage garage operations efficiently.

## Features

### User Side
- **Home Page:** Overview of services and garage information.
- **Service Booking:** Users can book automotive services by filling out a booking form.
- **Authentication:** Secure login for users and admins.

### Admin Side
- **Dashboard:** View and manage appointments, billing, and services.
- **Appointment Management:** Approve, update, or complete service appointments.
- **Billing Management:** Track payments and update billing statuses.
- **Service Management:** Add, edit, or remove available garage services.
- **Role-Based Access:** Only authenticated admins can access the admin dashboard.

## Tech Stack

- **Frontend:** React (with Vite)
- **Routing:** React Router
- **State Management:** React Hooks
- **Styling:** Inline styles (customizable)
- **Authentication:** Local storage-based (demo purposes)

## Folder Structure

```
g-s-a/
│
├── FE/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── LoginForm.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── README.md
└── ... (other backend or config files if present)
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/g-s-a.git
    cd g-s-a/FE
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Admin Login

- Use the login form and select the "admin" role to access the admin dashboard.
- Credentials are demo-based; adjust authentication logic as needed for production.

## Customization

- **Services, appointments, and billing** use mock data for demonstration. Integrate with a backend API for production use.
- **Styling** can be customized in the component files.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

**KabHub Kenya - Empowering Garages Across Kenya**