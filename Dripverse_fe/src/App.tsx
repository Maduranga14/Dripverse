import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import { CartProvider } from "./contexts/CartContext";
import Checkout from "./pages/Checkout";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />}/>


          <Route element= {<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
            <Route path="/admin" element= {<AdminDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </CartProvider> 
  </QueryClientProvider>
);

export default App;