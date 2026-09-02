
## Q_Order — Restaurant Ordering & Real-Time Kitchen Management API

Q_Order is a multi-tenant restaurant ordering backend system that manages
restaurant operations, table-based ordering, shared carts, order processing,
kitchen operations, billing, payments, customer assistance, and real-time
communication between guests, staff, and kitchen displays.

---

##  Tech Stack

### Backend
- Node.js
- Express.js
- JavaScript (ES Modules)

### Database
- PostgreSQL
- Supabase — PostgreSQL database hosting
- `pg` — PostgreSQL Node.js driver

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt
- Helmet
- CORS
- Environment variables using dotenv

### Real-Time Communication
- WebSockets
- Node.js WebSocket architecture

### API Documentation
- Swagger
- swagger-jsdoc
- swagger-ui-express

### Testing
- Postman
- End-to-End API Testing

### Development Tools
- Nodemon
- Git
- GitHub

---

#  Project Architecture

The backend follows a consistent layered architecture:

```text
Client / Frontend
       │
       ▼
     Routes
       │
       ▼
   Middleware
       │
       ▼
   Controller
       │
       ▼
    Service
       │
       ▼
  Repository
       │
       ▼
 PostgreSQL
       │
       ▼
    Supabase
    
##  Team & Module Ownership

| Team Member | Module |
|---|---|
| Gurram Sruthi | Super Admin Portal & SaaS Management |
| Karthik Kondameedi | Authentication & Floor Management |
| Kode Yesubabu | Menu & Catalog Management |
| Madhuri Papanaa | Shared Table Cart Engine |
| Nagalokesh Battula | Order Processing Engine |
| Rabbani Shaik | KDS Operations & Printing Integration |
| Shaik Sabiha | Real-Time Event Engine & WebSocket Architecture |
| Vasimalla Gowri | Complex Billing Engine & Payment Gateway Infrastructure |
| Venkatalingaiah Mekala | Customer Assistance & Feedback System |
| Yogeswararao Eragadindla | Database Architecture, Setup, End-to-End Testing & Comms |