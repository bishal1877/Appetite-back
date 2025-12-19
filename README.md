🛠️ Appetite Backend - Node.js & PostgreSQL API

This is the robust backend for the Appetite food delivery platform. It handles user authentication, restaurant data management, and order processing.

---

## 🏗️ Architecture & Features
- **RESTful API Design:** Clean and predictable endpoints for all resources.
- **Relational Database:** Powered by **PostgreSQL** for strict data integrity.
- **Security:** - JWT (JSON Web Tokens) for stateless authentication.
  - Password hashing using `bcrypt`.
- **Middleware Integration:** Custom middleware for authentication and error handling.
- **File Uploads:** Handled via `multer` for restaurant/food images.


### Authentication
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user and return a JWT.


## 🛠️ Tech Stack
- **Server:** Node.js, Express.js
- **Database:** PostgreSQL
- **Security:** JWT, Bcrypt
