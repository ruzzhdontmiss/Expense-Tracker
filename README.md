<<<<<<< HEAD
# Expense Management App

A mobile app for tracking expenses, connecting bank accounts, and getting insights into spending habits.

## Features

- User authentication with email and password
- Add, view, and search transactions
- Connect and manage bank accounts
- Dashboard with expense summaries
- Categorize expenses
- Dark/light mode support

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/expense-management.git
   cd expense-management
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.io/)
   - Create the following tables in your Supabase database:
     - `users`
     - `transactions`
     - `bank_connections`
     - `categories`
     - `user_categories`
     - `alerts`
   - Update the Supabase URL and anon key in `services/supabase.ts`

4. Start the development server:
   ```
   npx expo start
   ```

5. Run on a simulator or physical device:
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android emulator
   - Scan the QR code with the Expo Go app on your physical device

## Project Structure

```
expense-management/
├── app/                    # Main app screens
│   ├── (auth)/             # Authentication screens
│   ├── (dashboard)/        # Dashboard and transaction screens
│   └── (banks)/            # Bank connection screens
├── assets/                 # Images and other assets
├── components/             # Reusable components
│   ├── bank/               # Bank-related components
│   ├── charts/             # Chart and graph components
│   ├── transaction/        # Transaction-related components
│   └── ui/                 # General UI components
├── constants/              # App constants
├── hooks/                  # Custom hooks
├── services/               # API and service integrations
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Tech Stack

- React Native / Expo
- TypeScript
- React Native Paper (UI)
- Supabase (Backend & Authentication)
- Expo Router (Navigation)
- AsyncStorage (Local Storage)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
=======
# Expense-Tracker
expense tracker mobile app with react native
>>>>>>> c9cd1e2e2e7daef66b973bacc2753abeeff4b32e
