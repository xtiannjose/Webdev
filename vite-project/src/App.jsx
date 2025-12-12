import { useState, useMemo, useEffect } from 'react'
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
import { AuthProvider } from './context/AuthContext.jsx'
import { AuthPage } from './pages/auth/AuthPage.jsx'
import { CheckoutPage } from './pages/checkout/CheckoutPage.jsx'
import { ProfilePage } from './pages/profile/ProfilePage.jsx'
import { useAuth } from './context/AuthContext.jsx'

const pages = {
  home: HomePage,
  men: MenPage,
  men2: MenPage2,
  women: WomenPage,
  product: ProductPage,
  contact: ContactPage,
  about: AboutPage,
  support: SupportPage,
  lookbook: LookbookPage,
  collection: CollectionPage,
  returns: ReturnPolicyPage,
  terms: TermsPage,
  shipping: ShippingInfoPage,
  privacy: PrivacyPolicyPage,
  wishlist: WishlistPage,
  cart: CartPage,
  auth: AuthPage,
  checkout: CheckoutPage,
  profile: ProfilePage,
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StoreProvider>
          <InnerApp />
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

function InnerApp() {
  const [currentPage, setCurrentPage] = useState('home')
  const protectedPages = ['checkout', 'profile']
  const { user } = useAuth()

  const PageComponent = useMemo(() => pages[currentPage] ?? HomePage, [currentPage])

  useEffect(() => {
    if (!user && protectedPages.includes(currentPage)) {
      setCurrentPage('auth')
    }
  }, [user, currentPage])

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <PageComponent onNavigate={setCurrentPage} />
    </Layout>
  )
}

export default App
