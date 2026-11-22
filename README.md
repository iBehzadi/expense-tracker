# Expense Tracker

A personal finance management application built to help users track income, expenses, manage financial accounts, and set monthly budgets.

The application provides a simple and intuitive interface for monitoring financial activities and keeping personal finances organized.

## ✨ Features

- **Account Management:** Create and manage bank, cash, savings, and other accounts.
- **Transaction Management:** Create, edit, and delete income and expense transactions.
- **Category Management:** Organize income and expenses into categories.
- **Budget Management:** Set monthly spending limits for different expense categories.
- **Balance Calculation:** Calculate account balances based on initial balances and transactions.
- **Financial Dashboard:** View an overview of income, expenses, and total assets.
- **Authentication:** User registration, login, and secure session management.
- **Form Validation:** Validate user input on both client and server sides.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Dark & Light Mode:** Support for both visual themes.

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Main application framework |
| React | User interface development |
| TypeScript | Static type checking |
| Tailwind CSS | Styling and responsive design |
| Prisma ORM | Database access and management |
| PostgreSQL | Relational database |
| Formik | Form state management |
| Zod | Data validation |
| Jose | Secure session management |

## 📁 Project Structure

```text
expense-tracker/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── generated/
├── Components/
├── lib/
│   ├── actions/
│   ├── api/
│   ├── services/
│   └── validations/
├── prisma/
├── public/
├── utils/
├── .env
└── package.json
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iBehzadi/expense-tracker.git
cd expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/expense_tracker"
AUTH_SECRET="YOUR_SECRET_KEY"
```

Generate a secure random secret with at least 32 characters for `AUTH_SECRET`.

### 4. Set up the database

Make sure PostgreSQL is running and the database connection is configured.

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Security

- Secure session management using HTTP-only cookies.
- Server-side input validation.
- User ownership verification before data operations.
- Separation of business logic and server actions.
- Protected application routes.

## 🎯 Project Goals

This project was developed to practice and demonstrate modern web development concepts, including:

- Building full-stack applications with Next.js.
- Designing responsive user interfaces.
- Implementing authentication and authorization.
- Managing relational data with Prisma and PostgreSQL.
- Structuring server-side business logic.
- Building reusable React components.

## 👨‍💻 Author

**Behzad Sadeghi**

- GitHub: [@iBehzadi](https://github.com/iBehzadi)

---

If you find this project useful, feel free to explore the repository and share your feedback.
