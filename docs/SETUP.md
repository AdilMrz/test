# Setup Guide

This guide will walk you through setting up the Lottti POC application from scratch.

## Prerequisites

### Required Software

- **Node.js** (v18 or higher)
  ```bash
  # Check version
  node --version
  npm --version
  ```

- **Git**
  ```bash
  # Check version
  git --version
  ```

### Required Accounts

- **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
- **GitHub Account**: For version control (optional)
- **Vercel Account**: For deployment (optional)

## Step 1: Project Setup

### Clone the Repository

```bash
git clone <repository-url>
cd lottti-poc
```

### Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- React Admin
- Material-UI components
- TypeScript
- Vite build tool
- Supabase client

## Step 2: Supabase Setup

### Create a New Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `lottti-poc`
   - Database Password: (generate a strong password)
   - Region: (choose closest to your users)

### Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key

### Database Schema Setup

Run the following SQL in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fullname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_role table
CREATE TABLE user_role (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS) Setup

```sql
-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - customize as needed)
-- Customers policies
CREATE POLICY "Users can view customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete customers" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for products and purchases
-- (Add similar policies for products, purchases, user_role, and audit_logs)
```

### Storage Setup (Optional)

If you plan to use image uploads:

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `product-images`
3. Set it to public if you want direct image access
4. Configure upload policies

## Step 3: Environment Configuration

### Create Environment File

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### Verify Configuration

```bash
# Start the development server
npm run dev
```

The application should start at `http://localhost:5173`

## Step 4: Initial Data Setup

### Create First Admin User

1. Go to your running application
2. Click "Sign Up" to create an account
3. In Supabase dashboard, go to Authentication → Users
4. Find your user and copy the User ID
5. In SQL Editor, run:

```sql
INSERT INTO user_role (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

### Add Sample Data (Optional)

```sql
-- Sample customers
INSERT INTO customers (fullname, email, address) VALUES
('John Doe', 'john@example.com', '123 Main St, City, State'),
('Jane Smith', 'jane@example.com', '456 Oak Ave, City, State'),
('Bob Johnson', 'bob@example.com', '789 Pine Rd, City, State');

-- Sample products
INSERT INTO products (name, description) VALUES
('Laptop', 'High-performance laptop for business use'),
('Mouse', 'Wireless optical mouse'),
('Keyboard', 'Mechanical keyboard with RGB lighting');

-- Sample purchases
INSERT INTO purchases (customer_id, product_id, price, purchase_date)
SELECT 
  c.id,
  p.id,
  ROUND((RANDOM() * 1000 + 100)::numeric, 2),
  CURRENT_DATE - (RANDOM() * 30)::integer
FROM customers c
CROSS JOIN products p
LIMIT 10;
```

## Step 5: Verification

### Test Core Features

1. **Authentication**: Log in with your admin account
2. **Customers**: Create, view, edit, and delete customers
3. **Products**: Manage product catalog
4. **Purchases**: Record and track purchases
5. **Dashboard**: View analytics and charts
6. **Permissions**: Test different user roles

### Check Console for Errors

Open browser developer tools and check for:
- Network errors
- JavaScript errors
- Authentication issues
- Permission errors

## Step 6: Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Configure Environment Variables

In your deployment platform, set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Troubleshooting

### Common Issues

**1. Supabase Connection Failed**
- Check environment variables
- Verify Supabase project is active
- Check network connectivity

**2. Authentication Issues**
- Verify auth settings in Supabase
- Check redirect URLs
- Ensure user_role table is populated

**3. Permission Errors**
- Check RLS policies
- Verify user roles
- Review audit logs

**4. Build Errors**
- Run `npm run type-check`
- Check for missing dependencies
- Verify environment variables

### Getting Help

- Check the main README.md for detailed documentation
- Review Supabase documentation
- Check React Admin documentation
- Create an issue in the repository

## Next Steps

After successful setup:

1. Customize the application for your needs
2. Add additional features or modify existing ones
3. Set up monitoring and analytics
4. Configure backup and disaster recovery
5. Implement additional security measures

Your Lottti POC application should now be fully functional!
