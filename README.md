# Lottti POC - React Admin Application

A comprehensive business management application built with React Admin, TypeScript, and Supabase. This application provides a complete solution for managing customers, products, purchases, and business analytics with role-based access control.

## 🚀 Features

- **Customer Management** - Create, view, edit, and manage customer information with custom dialogs
- **Product Management** - Manage product catalog with images and descriptions
- **Purchase Tracking** - Record and track customer purchases with detailed analytics
- **Role-Based Access Control (RBAC)** - Admin, Manager, and User roles with granular permissions
- **Audit Logging** - Track all system activities and changes
- **Multi-language Support** - Complete English and French localization
- **Custom UI Components** - Enhanced forms and dialogs with Tailwind CSS styling
- **Dark/Light Theme** - Customizable UI themes
- **PDF Export** - Export dashboard data and reports

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, React Admin 5
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI Framework**: Material-UI (MUI) 5 + Tailwind CSS
- **Styling**: Hybrid approach - React Admin with Tailwind CSS enhancements
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Routing**: React Router DOM

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (version 18 or higher)
- npm or yarn package manager
- Supabase account and project
- Git

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lottti-poc
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Optional: Maintenance mode
   VITE_MAINTENANCE_MODE=false
   ```

4. **Supabase Setup**
   - Create a new Supabase project
   - Set up the database schema (see Database Schema section)
   - Configure authentication settings
   - Enable Row Level Security (RLS) policies

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Tailwind UI component library
│   ├── forms/          # Enhanced form components
│   ├── TailwindCustomLayout.tsx    # Custom React Admin layout
│   ├── TailwindCustomMenu.tsx      # Enhanced navigation menu
│   ├── TailwindLoginPage.tsx       # Custom login page
│   └── Protected.tsx   # RBAC protection wrapper
├── contexts/           # React contexts (RBAC, etc.)
├── features/           # Feature-based modules
│   ├── customers/      # Customer management with custom dialogs
│   ├── products/       # Product management with image upload
│   ├── purchases/      # Purchase tracking with enhanced forms
│   ├── dashboard/      # Analytics dashboard
│   └── audit-logs/     # Activity logging
├── providers/          # Data providers and auth
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── i18n/              # Internationalization (EN/FR)
├── themes.ts          # UI theme configuration
├── supabase.ts        # Supabase client setup
└── App.tsx            # Main application component
```

## 🔐 Authentication & Authorization

### User Roles

The application implements a three-tier role-based access control system:

1. **Admin** - Full system access

   - Manage all customers, products, and purchases
   - Access maintenance panel and audit logs
   - User management capabilities

2. **Manager** - Business operations access

   - Manage customers, products, and purchases
   - View audit logs
   - Limited administrative functions

3. **User** - Basic access
   - View and create purchases
   - Limited customer and product access
   - Read-only dashboard access

### Authentication Flow

- Users authenticate via Supabase Auth
- Role assignment through `user_role` table
- Real-time role updates and permission checking
- Protected routes and components based on permissions

## 📊 Database Schema

### Core Tables

**customers**

```sql
- id (uuid, primary key)
- fullname (text)
- email (text)
- address (text)
- created_by (uuid, foreign key to auth.users)
- created_at (timestamp)
- updated_at (timestamp)
```

**products**

```sql
- id (uuid, primary key)
- name (text)
- description (text)
- image_url (text, optional)
- created_by (uuid, foreign key to auth.users)
- created_at (timestamp)
- updated_at (timestamp)
```

**purchases**

```sql
- id (uuid, primary key)
- customer_id (uuid, foreign key to customers)
- product_id (uuid, foreign key to products)
- price (decimal)
- purchase_date (date)
- created_by (uuid, foreign key to auth.users)
- created_at (timestamp)
- updated_at (timestamp)
```

**user_role**

```sql
- user_id (uuid, foreign key to auth.users)
- role (text: 'admin' | 'manager' | 'user')
- created_at (timestamp)
```

**audit_logs**

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- action (text)
- resource (text)
- resource_id (uuid)
- old_values (jsonb)
- new_values (jsonb)
- created_at (timestamp)
```

## 🎯 Key Features

### Customer Management

- **Customer List**: Searchable and filterable customer directory with custom actions
- **Customer Details**: Comprehensive customer information management
- **Custom Create Dialog**: Enhanced customer creation with Tailwind styling
- **Bulk Operations**: Mass delete and update operations
- **Purchase History**: View all purchases by customer
- **Email Validation**: Built-in email format validation

### Product Management

- **Product Catalog**: Visual product listing with images
- **Product Details**: Detailed product information and descriptions
- **Custom Create Dialog**: Enhanced product creation interface
- **Image Upload**: Product image management via Supabase Storage
- **Inventory Tracking**: Basic product availability status

### Purchase Tracking

- **Purchase Records**: Complete purchase transaction management
- **Customer-Product Linking**: Associate purchases with customers and products
- **Inline Customer Creation**: Create customers directly from purchase form
- **Date Filtering**: Filter purchases by date ranges
- **Price Tracking**: Monitor pricing trends and history
- **Enhanced Forms**: Custom form components with better UX

### Dashboard & Analytics

- **Standard React Admin Dashboard**: Clean, professional interface
- **Purchase Distribution**: Visual charts showing purchase patterns
- **Revenue Analytics**: Product-wise revenue breakdown
- **Recent Activity**: Latest purchase transactions
- **Date Range Filtering**: Customizable reporting periods
- **PDF Export**: Generate and download reports

### Audit & Maintenance

- **Activity Logs**: Complete audit trail of all system changes
- **User Tracking**: Monitor user actions and system usage
- **Data Integrity**: Automated data validation and cleanup
- **Programmatic Maintenance Mode**: Environment-based maintenance control

## 🌐 Internationalization

The application supports complete multilingual functionality:

- **English** (default)
- **French** (Français) - Complete translation including all UI elements

### Translation Features

- **Complete Coverage**: All UI elements, buttons, forms, and messages translated
- **React Admin Integration**: Core React Admin components fully localized
- **Custom Components**: All custom dialogs and forms support translations
- **Dynamic Language Switching**: Real-time language switching without page reload

Language files are located in `src/i18n/` directory. To add a new language:

1. Create a new language file (e.g., `src/i18n/es.ts` for Spanish)
2. Add translations for all keys including React Admin overrides
3. Update the i18n provider in `App.tsx`
4. Test all custom components for proper translation support

## 🎨 Theming

The application includes a hybrid styling approach:

- **Light Theme** (default)
- **Dark Theme**
- **Material-UI (MUI)** - Core React Admin components
- **Tailwind CSS** - Enhanced custom components and utilities
- **Custom Login Page** - Tailwind-styled authentication
- **Enhanced Forms** - Hybrid MUI + Tailwind form components

### Styling Architecture

- **React Admin Core**: Uses Material-UI for standard admin functionality
- **Custom Components**: Enhanced with Tailwind CSS for modern styling
- **Consistent Design**: Unified color scheme and typography
- **Responsive Design**: Mobile-first approach with Tailwind utilities

Theme configuration is in `src/themes.ts` and Tailwind config in `tailwind.config.js`.

## 🏗️ Architecture & Design Decisions

### Current Implementation

The application follows a **hybrid approach** combining React Admin's robust admin functionality with selective Tailwind CSS enhancements:

**✅ What's Included:**

- **Standard React Admin Dashboard** - Clean, professional interface
- **Enhanced Custom Components** - Tailwind-styled dialogs and forms
- **Complete French Translation** - All UI elements properly localized
- **RBAC Integration** - Role-based access control throughout
- **Custom Login Page** - Tailwind-styled authentication
- **Hybrid Form Components** - Available for future development

**🗑️ What Was Removed (Production-Ready):**

- Demo/showcase components
- Maintenance panel UI (functionality preserved programmatically)
- Custom notification system (uses standard React Admin notifications)
- Testing/debugging components
- Tailwind dashboard widgets (uses standard React Admin dashboard)

### Benefits of Current Architecture

- **Production-Ready**: Clean interface without demo components
- **Maintainable**: Standard React Admin patterns with selective enhancements
- **Scalable**: Easy to add new features using established patterns
- **Professional**: Consistent user experience throughout the application
- **Flexible**: Hybrid approach allows for future customizations when needed

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Maintenance Mode
VITE_MAINTENANCE_MODE=false

# Optional: Application Configuration
VITE_APP_TITLE=Lottti POC
VITE_APP_VERSION=1.0.0

# Optional: Sentry Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_ENVIRONMENT=development
```

### Supabase Configuration

1. **Database Setup**: Run the SQL migrations in your Supabase project
2. **Storage Setup**: Create buckets for file uploads (if using image uploads)
3. **Auth Configuration**: Configure authentication providers and settings
4. **RLS Policies**: Set up Row Level Security policies for data protection

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

### Deployment Options

**Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify**

```bash
# Build command: npm run build
# Publish directory: dist
```

**Traditional Hosting**

- Upload the `dist/` folder contents to your web server
- Configure your server to serve `index.html` for all routes (SPA routing)

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🧪 Testing

### Running Tests

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Testing Strategy

- **Type Safety**: TypeScript for compile-time error checking
- **Code Quality**: ESLint for code quality and consistency
- **Formatting**: Prettier for consistent code formatting
- **Manual Testing**: Comprehensive user acceptance testing

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Issues**

- Verify environment variables are correctly set
- Check Supabase project URL and API key
- Ensure Supabase project is active

**2. Authentication Problems**

- Check user role assignments in `user_role` table
- Verify RLS policies are correctly configured
- Ensure auth provider settings match your domain

**3. Permission Errors**

- Verify user has correct role assigned
- Check RBAC permissions in the application
- Review audit logs for permission-related issues

**4. Build Issues**

- Clear node_modules and reinstall dependencies
- Check for TypeScript errors with `npm run type-check`
- Verify all environment variables are set

## 📚 API Reference

### Data Provider Methods

The application uses React Admin's data provider pattern with Supabase:

```typescript
// Get list of resources
dataProvider.getList("customers", { pagination, sort, filter });

// Get single resource
dataProvider.getOne("customers", { id });

// Create resource
dataProvider.create("customers", { data });

// Update resource
dataProvider.update("customers", { id, data });

// Delete resource
dataProvider.delete("customers", { id });
```

### RBAC Helper Functions

```typescript
// Check if user has permission
const hasPermission = await checkPermission('create', 'customers')

// Get current user role
const { role } = useRBAC()

// Protect components
<Protected action="delete" resource="customers">
  <DeleteButton />
</Protected>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use React Admin patterns and conventions
- Implement proper error handling
- Add appropriate RBAC protections
- Update documentation for new features

## 🆘 Support

For support and questions:

1. Check the troubleshooting section above
2. Review React Admin documentation: https://marmelab.com/react-admin/
3. Check Supabase documentation: https://supabase.com/docs
4. Create an issue in the repository

## 🔄 Changelog

### Version 1.0.0 (Current)

- **Core Features**: Customer, Product, and Purchase management
- **Enhanced UI**: Custom dialogs and forms with Tailwind CSS styling
- **Complete Localization**: Full English and French translation support
- **RBAC System**: Role-based access control with granular permissions
- **Audit Logging**: Complete activity tracking and system monitoring
- **Dashboard Analytics**: Visual insights with charts and export capabilities
- **Production-Ready**: Clean interface without demo components
- **Hybrid Architecture**: React Admin core with selective Tailwind enhancements

### Recent Updates

- ✅ **Translation Fixes**: Complete French localization for all components
- ✅ **UI Cleanup**: Removed demo components for production readiness
- ✅ **Enhanced Forms**: Custom create dialogs with improved UX
- ✅ **Navigation Improvements**: Streamlined menu and better user flow
- ✅ **Code Quality**: TypeScript improvements and better error handling

## 📄 License

This project is proprietary software. All rights reserved.

**Copyright (c) 2025 [Your Name/Company]**

This software and its source code are confidential and proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

For licensing inquiries, contact: [your-email@example.com]

---

**Built with ❤️ using React Admin and Supabase**
