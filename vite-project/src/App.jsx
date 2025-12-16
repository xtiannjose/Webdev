import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { HomePage } from './pages/home/HomePage.jsx'
import { MenPage } from './pages/men/MenPage.jsx'
import { MenPage2 } from './pages/men/MenPage2.jsx'
import { WomenPage } from './pages/women/WomenPage.jsx'
import { ProductPage } from './pages/product/ProductPage.jsx'
import { ContactPage } from './pages/contact/ContactPage.jsx'
import { AboutPage } from './pages/about/AboutPage.jsx'
import { SupportPage } from './pages/support/SupportPage.jsx'
import { LookbookPage } from './pages/lookbook/LookbookPage.jsx'
import { CollectionPage } from './pages/collection/CollectionPage.jsx'
import { ReturnPolicyPage } from './pages/returns/ReturnPolicyPage.jsx'
import { TermsPage } from './pages/terms/TermsPage.jsx'
import { ShippingInfoPage } from './pages/shipping/ShippingInfoPage.jsx'
import { PrivacyPolicyPage } from './pages/privacy/PrivacyPolicyPage.jsx'
import { WishlistPage } from './pages/wishlist/WishlistPage.jsx'
import { CartPage } from './pages/cart/CartPage.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { AuthPage } from './pages/auth/AuthPage.jsx'
import { CheckoutPage } from './pages/checkout/CheckoutPage.jsx'
import { ProfilePage } from './pages/profile/ProfilePage.jsx'
import { SearchPage } from './pages/search/SearchPage.jsx'

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/men/page-2" element={<MenPage2 />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/lookbook" element={<LookbookPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/product/:id?" element={<ProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/shipping" element={<ShippingInfoPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
