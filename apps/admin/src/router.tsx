import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth } from './lib/auth/RequireAuth';
import { AdminShell } from './components/shell/AdminShell';
import { LoginPage } from './routes/login/LoginPage';
import { DashboardPage } from './routes/dashboard/DashboardPage';
import { OrdersPage } from './routes/orders/OrdersPage';
import { OrderDetailPage } from './routes/orders/detail/OrderDetailPage';
import { CustomersPage } from './routes/customers/CustomersPage';
import { CustomerDetailPage } from './routes/customers/detail/CustomerDetailPage';
import { ProductsPage } from './routes/products/ProductsPage';
import { ProductFormPage } from './routes/products/form/ProductFormPage';
import { CategoriesPage } from './routes/categories/CategoriesPage';
import { ZonesPage } from './routes/zones/ZonesPage';
import { SettingsPage } from './routes/settings/SettingsPage';
import { ReviewsPage } from './routes/reviews/ReviewsPage';
import { StaffPage } from './routes/staff/StaffPage';
import { AnalyticsPage } from './routes/analytics/AnalyticsPage';
import { InventoryLogPage } from './routes/inventory-log/InventoryLogPage';
import { AbandonedCartsPage } from './routes/abandoned-carts/AbandonedCartsPage';
import { RefundsPage } from './routes/refunds/RefundsPage';
import { ShippingLabelsPage } from './routes/shipping-labels/ShippingLabelsPage';
import { TemplatesPage } from './routes/templates/TemplatesPage';
import { PromosPage } from './routes/promos/PromosPage';
import { BannersPage } from './routes/banners/BannersPage';
import { LegalEditorPage } from './routes/settings/legal/LegalEditorPage';
import { NotFoundPage } from './routes/not-found/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AdminShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id/edit', element: <ProductFormPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
      { path: 'inventory-log', element: <InventoryLogPage /> },
      { path: 'abandoned-carts', element: <AbandonedCartsPage /> },
      { path: 'shipping-labels', element: <ShippingLabelsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'refunds', element: <RefundsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'promos', element: <PromosPage /> },
      { path: 'banners', element: <BannersPage /> },
      { path: 'zones', element: <ZonesPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/:tab', element: <SettingsPage /> },
      { path: 'settings/legal/:slug', element: <LegalEditorPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

// Silence "no-unused" by referencing the redirect helper for future use.
void Navigate;
