# Library Management System

A full-stack Library Management System built with Node.js, Express, MongoDB, and Vanilla JavaScript.

## Features

### 📚 Book Management
- Add, edit, delete books
- Search books by title, author, or ISBN
- Filter books by category
- Track available copies

### 👥 Member Management
- Member registration and authentication
- View member details and status
- Different membership types (Student, Faculty, Public)

### 📖 Transaction Management
- Borrow and return books
- Track due dates and overdue books
- Calculate fines for late returns
- Transaction history

### 📊 Dashboard
- Overview statistics
- Quick access to all features
- Real-time data updates

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- Vanilla JavaScript
- HTML5 & CSS3
- Axios for API calls
- Font Awesome icons

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd library-management/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd library-management/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Usage

1. **First Time Setup:**
   - Register as a new member
   - Login with your credentials

2. **Adding Books:**
   - Go to Books section
   - Click "Add Book" button
   - Fill in book details

3. **Borrowing Books:**
   - Go to Transactions section
   - Click "New Borrow" button
   - Select member and book
   - Set due date

4. **Returning Books:**
   - Go to Transactions section
   - Find active transaction
   - Click "Return" button

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new member
- `POST /api/auth/login` - Login member

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `PUT /api/members/:id` - Update member

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/borrow` - Borrow book
- `POST /api/transactions/return/:id` - Return book
- `GET /api/transactions/overdue` - Get overdue books

## Default Admin Account

After setting up, you can create an admin account by registering normally. The first registered user will have admin privileges.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.