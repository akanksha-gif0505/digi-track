# DigiTrack Frontend

React-based frontend for DigiTrack expense and budget management application.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🏗️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **Tailwind CSS v4** - Styling
- **Recharts** - Charts and graphs
- **Motion** - Animations
- **Lucide React** - Icons
- **Canvas Confetti** - Celebration effects

## 📁 Project Structure

```
frontend/
├── components/          # React components
│   ├── DashboardScreen.tsx
│   ├── AddExpenseScreen.tsx
│   ├── BudgetScreen.tsx
│   ├── SavingsScreen.tsx
│   ├── SplitExpenseScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── SettingsScreen.tsx
│   └── ... (more)
├── context/            # React Context (state management)
│   └── ExpenseContext.tsx
├── data/               # Data utilities
├── App.tsx             # Main app component
├── main.tsx            # Entry point
├── index.css           # Global styles
├── types.ts            # TypeScript types
└── vite.config.ts      # Vite configuration
```

## 🔌 API Integration

The frontend communicates with the backend API running on `http://localhost:3000` by default.

API calls are proxied through Vite dev server to avoid CORS issues during development.

To change the backend URL, update `VITE_API_URL` in `.env`:
```env
VITE_API_URL=http://localhost:3000
```

## 🎨 Features

- **Dashboard** - Overview of expenses, budgets, and savings
- **Expense Management** - Add, edit, delete expenses with categories
- **Budget Tracking** - Set and monitor budgets per category
- **Savings Vault** - Protected salary savings tracking
- **Bill Splitting** - Group expense management with settlements
- **Charts & Analytics** - Visual spending insights
- **Responsive Design** - Mobile and desktop optimized
- **Authentication** - JWT-based secure login

## 🔧 Configuration

### Environment Variables
Create or edit `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=DigiTrack
VITE_APP_DESCRIPTION=Smart Expense & Budget Manager
```

### Proxy Configuration
Vite is configured to proxy `/api/*` requests to the backend server. See `vite.config.ts`.

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # TypeScript type checking
```

## 🎯 Development

### Adding a New Component
1. Create component in `components/` folder
2. Import and use in `App.tsx` or other components
3. Update routing/navigation if needed

### State Management
- Global state is managed via React Context (`context/ExpenseContext.tsx`)
- Local component state uses `useState` hook

### Styling
- Tailwind CSS utility classes
- Global styles in `index.css`
- Responsive breakpoints: mobile (< 768px), desktop (>= 768px)

## 🔒 Authentication

Frontend stores JWT token in:
- React Context (in-memory)
- localStorage (persistence)

Token is sent in `Authorization` header for API requests:
```
Authorization: Bearer <token>
```

## 🚀 Deployment

### Static Hosting (Recommended)
Deploy to Vercel, Netlify, or Cloudflare Pages:

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder

3. Configure environment variables on hosting platform

4. Set backend API URL in environment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📱 Responsive Design

- **Mobile:** Bottom navigation bar
- **Desktop:** Sidebar navigation
- Touch-friendly UI elements
- Optimized for various screen sizes

## 🧪 Testing

Tests coming soon. Current focus:
- Component unit tests
- Integration tests
- E2E tests with Playwright/Cypress

## 🐛 Troubleshooting

### Port Already in Use
Change port in `vite.config.ts`:
```ts
server: {
  port: 5174, // or any other port
}
```

### API Connection Issues
- Ensure backend is running on port 3000
- Check CORS configuration in backend
- Verify `VITE_API_URL` in `.env`

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## 📄 License

Part of the DigiTrack project.
