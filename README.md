# Lottti POC - React Admin Application

A comprehensive business management application built with React Admin, TypeScript, and Supabase. This application provides a complete solution for managing customers, products, purchases, and business analytics with role-based access control.

## 🚀 Features

- **Customer Management** - Create, view, edit, and manage customer information
- **Product Management** - Manage product catalog with images and descriptions
- **Purchase Tracking** - Record and track customer purchases with detailed analytics
- **Dashboard & Analytics** - Visual insights with charts and export capabilities
- **Role-Based Access Control (RBAC)** - Admin, Manager, and User roles with granular permissions
- **Audit Logging** - Track all system activities and changes
- **Maintenance Panel** - System administration tools
- **Multi-language Support** - English and French localization
- **Dark/Light Theme** - Customizable UI themes
- **PDF Export** - Export dashboard data and reports

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, React Admin 5
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI Framework**: Material-UI (MUI) 5
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Charts**: Recharts
- **PDF Generation**: jsPDF

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

The application will be available at `http://localhost:5173`

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
├── contexts/           # React contexts (RBAC, etc.)
├── features/           # Feature-based modules
│   ├── customers/      # Customer management
│   ├── products/       # Product management
│   ├── purchases/      # Purchase tracking
│   ├── dashboard/      # Analytics dashboard
│   ├── audit-logs/     # Activity logging
│   └── maintenance/    # System maintenance
├── providers/          # Data providers
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── i18n/              # Internationalization
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
- **Customer List**: Searchable and filterable customer directory
- **Customer Details**: Comprehensive customer information management
- **Bulk Operations**: Mass delete and update operations
- **Purchase History**: View all purchases by customer

### Product Management
- **Product Catalog**: Visual product listing with images
- **Product Details**: Detailed product information and descriptions
- **Image Upload**: Product image management via Supabase Storage
- **Inventory Tracking**: Basic product availability status

### Purchase Tracking
- **Purchase Records**: Complete purchase transaction management
- **Customer-Product Linking**: Associate purchases with customers and products
- **Date Filtering**: Filter purchases by date ranges
- **Price Tracking**: Monitor pricing trends and history

### Dashboard & Analytics
- **Purchase Distribution**: Visual charts showing purchase patterns
- **Revenue Analytics**: Product-wise revenue breakdown
- **Recent Activity**: Latest purchase transactions
- **Date Range Filtering**: Customizable reporting periods
- **PDF Export**: Generate and download reports

### Audit & Maintenance
- **Activity Logs**: Complete audit trail of all system changes
- **User Tracking**: Monitor user actions and system usage
- **Maintenance Panel**: System administration tools (admin only)
- **Data Integrity**: Automated data validation and cleanup

## 🌐 Internationalization

The application supports multiple languages:

- **English** (default)
- **French** (Français)

Language files are located in `src/i18n/` directory. To add a new language:

1. Create a new language file (e.g., `src/i18n/es.ts` for Spanish)
2. Add translations for all keys
3. Update the i18n provider in `App.tsx`

## 🎨 Theming

The application includes:

- **Light Theme** (default)
- **Dark Theme**
- **Custom Material-UI theme configuration**
- **Tailwind CSS for utility styling**

Theme configuration is in `src/themes.ts`.

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom configuration
VITE_APP_TITLE=Lottti POC
VITE_APP_VERSION=1.0.0
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
dataProvider.getList('customers', { pagination, sort, filter })

// Get single resource
dataProvider.getOne('customers', { id })

// Create resource
dataProvider.create('customers', { data })

// Update resource
dataProvider.update('customers', { id, data })

// Delete resource
dataProvider.delete('customers', { id })
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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the troubleshooting section above
2. Review React Admin documentation: https://marmelab.com/react-admin/
3. Check Supabase documentation: https://supabase.com/docs
4. Create an issue in the repository

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Customer, Product, and Purchase management
- Dashboard with analytics
- Role-based access control
- Audit logging
- Multi-language support
- PDF export functionality

---

**Built with ❤️ using React Admin and Supabase**
