# Architecture Documentation

## Overview

Lottti POC is built using a modern React architecture with the following key principles:

- **Component-based architecture** using React and TypeScript
- **Feature-driven development** with modular organization
- **Role-based access control** for security
- **Real-time data synchronization** via Supabase
- **Responsive design** with Material-UI and Tailwind CSS

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Admin   │    │    Supabase     │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │   UI    │             │  Auth   │             │  Storage│
    │Components│             │ Service │             │ Buckets │
    └─────────┘             └─────────┘             └─────────┘
```

## Frontend Architecture

### Core Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and better developer experience
- **React Admin 5**: Admin interface framework
- **Material-UI 5**: Component library and design system
- **TanStack Query**: Server state management
- **Vite**: Fast build tool and development server

### Component Hierarchy

```
App
├── QueryClientProvider
├── BrowserRouter
├── RBACProvider
└── AdminApp
    ├── Admin (React Admin)
    ├── Resources
    │   ├── Customers
    │   ├── Products
    │   ├── Purchases
    │   ├── Dashboard
    │   ├── Audit Logs
    │   └── Maintenance
    └── CustomLayout
        ├── CustomAppBar
        └── Navigation
```

### Data Flow

1. **User Action** → Component
2. **Component** → Data Provider
3. **Data Provider** → Supabase Client
4. **Supabase** → PostgreSQL Database
5. **Response** → Data Provider → Component
6. **Component** → UI Update

### State Management

- **Server State**: TanStack Query for caching and synchronization
- **Authentication State**: Supabase Auth with React context
- **RBAC State**: Custom React context for role-based permissions
- **UI State**: Local component state and React Admin state

## Backend Architecture

### Supabase Services

1. **Database**: PostgreSQL with real-time subscriptions
2. **Authentication**: Built-in auth with JWT tokens
3. **Storage**: File storage for images and documents
4. **Edge Functions**: Serverless functions (if needed)
5. **Realtime**: WebSocket connections for live updates

### Database Design

#### Entity Relationships

```
Users (Supabase Auth)
    ↓ (1:1)
UserRole
    ↓ (1:many)
[Customers, Products, Purchases] ← created_by

Customers (1:many) → Purchases ← (many:1) Products
```

#### Security Model

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Role-based Permissions**: Application-level authorization
- **Audit Logging**: Complete activity tracking

## Security Architecture

### Authentication Flow

1. User submits credentials
2. Supabase Auth validates and returns JWT
3. JWT stored in browser (httpOnly cookie recommended)
4. All requests include JWT in Authorization header
5. Supabase validates JWT and user permissions

### Authorization Layers

1. **Database Level**: RLS policies in PostgreSQL
2. **API Level**: Supabase client-side filtering
3. **Application Level**: React component protection
4. **UI Level**: Conditional rendering based on permissions

### RBAC Implementation

```typescript
// Permission checking
const hasPermission = await checkPermission(
  'create',      // action
  'customers',   // resource
  userId         // optional: for ownership-based permissions
);

// Component protection
<Protected action="delete" resource="customers">
  <DeleteButton />
</Protected>
```

## Performance Considerations

### Frontend Optimization

- **Code Splitting**: Lazy loading of feature modules
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large data lists
- **Image Optimization**: Lazy loading and responsive images

### Backend Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **Caching**: Query result caching with TanStack Query
- **Real-time Subscriptions**: Selective data synchronization

### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Minification**: Compressed production builds
- **Asset Optimization**: Optimized images and fonts
- **CDN Integration**: Fast content delivery

## Scalability Patterns

### Horizontal Scaling

- **Stateless Components**: No server-side state
- **Database Scaling**: Supabase handles database scaling
- **CDN Distribution**: Global content delivery
- **Load Balancing**: Multiple application instances

### Vertical Scaling

- **Component Optimization**: Efficient React patterns
- **Query Optimization**: Efficient database queries
- **Memory Management**: Proper cleanup and garbage collection
- **Resource Monitoring**: Performance tracking and alerts

## Development Patterns

### Feature Organization

```
features/
├── customers/
│   ├── components/
│   ├── CustomerList.tsx
│   ├── CustomerCreate.tsx
│   ├── CustomerEdit.tsx
│   ├── CustomerShow.tsx
│   ├── types.ts
│   ├── constants.ts
│   └── index.ts
```

### Code Standards

- **TypeScript First**: Strong typing throughout
- **Component Composition**: Reusable, composable components
- **Custom Hooks**: Shared logic extraction
- **Error Boundaries**: Graceful error handling
- **Testing Strategy**: Unit and integration tests

### API Patterns

- **RESTful Design**: Standard HTTP methods and status codes
- **Consistent Responses**: Standardized response formats
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validation at multiple layers

## Deployment Architecture

### Build Process

1. **Type Checking**: TypeScript compilation
2. **Linting**: Code quality checks
3. **Testing**: Automated test execution
4. **Building**: Production bundle creation
5. **Optimization**: Asset optimization and compression

### Deployment Pipeline

```
Development → Staging → Production
     ↓           ↓          ↓
   Local      Preview    Live
   Testing    Testing   Environment
```

### Environment Configuration

- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized build with monitoring

This architecture provides a solid foundation for a scalable, maintainable, and secure business management application.
