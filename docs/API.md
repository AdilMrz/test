# API Documentation

## Overview

The Lottti POC application uses Supabase as its backend, providing a PostgreSQL database with real-time capabilities, authentication, and storage. The frontend communicates with Supabase through the React Admin data provider pattern.

## Data Provider Interface

The application uses React Admin's data provider interface with Supabase integration:

```typescript
import { supabaseDataProvider } from 'ra-supabase';

const dataProvider = supabaseDataProvider({
  instanceUrl: process.env.VITE_SUPABASE_URL,
  apiKey: process.env.VITE_SUPABASE_ANON_KEY,
  supabaseClient
});
```

## Core Resources

### Customers

**Resource Name**: `customers`

**Fields**:
- `id` (UUID): Unique identifier
- `fullname` (string): Customer full name
- `email` (string): Customer email address
- `address` (string): Customer address
- `created_by` (UUID): User who created the record
- `created_at` (timestamp): Creation timestamp
- `updated_at` (timestamp): Last update timestamp

**Operations**:

```typescript
// Get list of customers
dataProvider.getList('customers', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'fullname', order: 'ASC' },
  filter: { fullname: 'John' }
});

// Get single customer
dataProvider.getOne('customers', { id: 'customer-uuid' });

// Create customer
dataProvider.create('customers', {
  data: {
    fullname: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St'
  }
});

// Update customer
dataProvider.update('customers', {
  id: 'customer-uuid',
  data: { fullname: 'John Smith' }
});

// Delete customer
dataProvider.delete('customers', { id: 'customer-uuid' });
```

### Products

**Resource Name**: `products`

**Fields**:
- `id` (UUID): Unique identifier
- `name` (string): Product name
- `description` (string): Product description
- `image_url` (string, optional): Product image URL
- `created_by` (UUID): User who created the record
- `created_at` (timestamp): Creation timestamp
- `updated_at` (timestamp): Last update timestamp

**Operations**:

```typescript
// Get products with image filtering
dataProvider.getList('products', {
  pagination: { page: 1, perPage: 20 },
  sort: { field: 'name', order: 'ASC' },
  filter: { name: 'laptop' }
});

// Create product with image
dataProvider.create('products', {
  data: {
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop',
    image_url: 'https://example.com/image.jpg'
  }
});
```

### Purchases

**Resource Name**: `purchases`

**Fields**:
- `id` (UUID): Unique identifier
- `customer_id` (UUID): Reference to customer
- `product_id` (UUID): Reference to product
- `price` (decimal): Purchase price
- `purchase_date` (date): Date of purchase
- `created_by` (UUID): User who created the record
- `created_at` (timestamp): Creation timestamp
- `updated_at` (timestamp): Last update timestamp

**Relationships**:
- `customers` (object): Joined customer data
- `products` (object): Joined product data

**Operations**:

```typescript
// Get purchases with related data
dataProvider.getList('purchases', {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'purchase_date', order: 'DESC' },
  filter: { 
    purchase_date_gte: '2024-01-01',
    purchase_date_lte: '2024-12-31'
  }
});

// Create purchase
dataProvider.create('purchases', {
  data: {
    customer_id: 'customer-uuid',
    product_id: 'product-uuid',
    price: 999.99,
    purchase_date: '2024-01-15'
  }
});
```

## Authentication API

### Login

```typescript
// Login with email/password
authProvider.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### User Identity

```typescript
// Get current user identity
const identity = await authProvider.getIdentity();
// Returns: { id, fullName, email, role }
```

### Logout

```typescript
// Logout current user
authProvider.logout();
```

### Password Reset

```typescript
// Request password reset
supabaseClient.auth.resetPasswordForEmail('user@example.com');
```

## RBAC API

### Permission Checking

```typescript
import { useRBAC } from './contexts/RBACContext';

const { checkPermission } = useRBAC();

// Check if user can perform action
const canCreate = await checkPermission('create', 'customers');
const canDelete = await checkPermission('delete', 'products', recordUserId);
```

### Role Management

```typescript
// Get current user role
const { role } = useRBAC();

// Role-based component rendering
if (role === 'admin') {
  // Show admin features
}
```

## Audit Logs API

**Resource Name**: `audit_logs`

**Fields**:
- `id` (UUID): Unique identifier
- `user_id` (UUID): User who performed the action
- `action` (string): Action performed (create, update, delete)
- `resource` (string): Resource type (customers, products, purchases)
- `resource_id` (UUID): ID of the affected resource
- `old_values` (JSON): Previous values (for updates)
- `new_values` (JSON): New values
- `created_at` (timestamp): When the action occurred

**Operations**:

```typescript
// Get audit logs
dataProvider.getList('audit_logs', {
  pagination: { page: 1, perPage: 50 },
  sort: { field: 'created_at', order: 'DESC' },
  filter: { 
    resource: 'customers',
    user_id: 'user-uuid'
  }
});
```

## Real-time Subscriptions

### Subscribe to Changes

```typescript
import { supabaseClient } from './supabase';

// Subscribe to customer changes
const subscription = supabaseClient
  .channel('customers')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'customers' },
    (payload) => {
      console.log('Customer changed:', payload);
      // Refresh data or update UI
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## File Upload API

### Upload Product Images

```typescript
// Upload image to Supabase Storage
const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `product-images/${fileName}`;

  const { data, error } = await supabaseClient.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabaseClient.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
};
```

## Error Handling

### Common Error Types

```typescript
// Network errors
try {
  const result = await dataProvider.getList('customers', params);
} catch (error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.status === 403) {
    // Forbidden - insufficient permissions
  } else if (error.status >= 500) {
    // Server error - show error message
  }
}
```

### Validation Errors

```typescript
// Handle validation errors from Supabase
try {
  await dataProvider.create('customers', { data });
} catch (error) {
  if (error.body?.code === '23505') {
    // Unique constraint violation
    throw new Error('Email already exists');
  }
}
```

## Rate Limiting

Supabase has built-in rate limiting:
- **Anonymous requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour
- **Database connections**: Limited by plan

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Require authentication for all operations
- Allow users to access records they created
- Provide role-based access for admin/manager roles

### API Key Security

- Use environment variables for API keys
- Never commit secrets to version control
- Use different keys for development/production
- Rotate keys regularly

### Input Validation

- All inputs are validated at the database level
- Use TypeScript for compile-time type checking
- Implement client-side validation for better UX
- Sanitize user inputs to prevent injection attacks

## Performance Optimization

### Query Optimization

```typescript
// Use select to limit fields
dataProvider.getList('purchases', {
  meta: {
    select: 'id,price,purchase_date,customers(fullname),products(name)'
  }
});

// Use pagination for large datasets
dataProvider.getList('customers', {
  pagination: { page: 1, perPage: 25 }
});
```

### Caching

React Admin with TanStack Query provides automatic caching:
- GET requests are cached by default
- Cache invalidation on mutations
- Background refetching for fresh data

This API documentation provides the foundation for working with the Lottti POC application's backend services.
