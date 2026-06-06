import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWithAuth, getImageUrl } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import fallbackImage from "@/assets/product-1.jpg";

interface ProfileData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { items, cartTotal, totalItems, clearCart, loading: cartLoading } = useCart();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.error("Please login to access checkout");
      navigate("/login");
    }
  }, [token, navigate]);

  // Subtotal, shipping, and total calculation
  const subtotal = cartTotal;
  const shipping = subtotal === 0 ? 0 : subtotal > 2000 ? 0 : 149;
  const total = subtotal + shipping;

  // Profile data state
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });
  const [profileLoading, setProfileLoading] = useState(true);

  // Form states
  const [addressOption, setAddressOption] = useState<"saved" | "custom">("saved");
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [finalTotal, setFinalTotal] = useState(0);

  // Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const data = await fetchWithAuth("/users/me");
        setProfile(data);
        // Default prefill custom shipping fields too
        setShippingDetails({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        toast.error("Failed to load user profile");
      } finally {
        setProfileLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Sync shipping details when profile loads and "saved" option is active
  useEffect(() => {
    if (addressOption === "saved") {
      setShippingDetails({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
  }, [profile, addressOption]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setCardDetails((prev) => ({ ...prev, [name]: formatted }));
      }
    }
    // Format expiry (MM/YY)
    else if (name === "expiry") {
      const cleaned = value.replace(/\//g, '');
      if (cleaned.length <= 4) {
        const formatted = cleaned.length >= 3 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
        setCardDetails((prev) => ({ ...prev, [name]: formatted }));
      }
    }
    // Limit CVV to 3 digits
    else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 3) {
        setCardDetails((prev) => ({ ...prev, [name]: cleaned }));
      }
    }
    else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Validation
    if (!shippingDetails.firstName.trim() || !shippingDetails.lastName.trim()) {
      toast.error("Please fill out your full name.");
      return;
    }
    if (!shippingDetails.phone.trim() || shippingDetails.phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!shippingDetails.address.trim() || shippingDetails.address.length < 10) {
      toast.error("Please enter a detailed shipping address (at least 10 characters).");
      return;
    }

    if (paymentMethod === "CARD") {
      if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardDetails.cardName.trim()) {
        toast.error("Please enter the name on your card.");
        return;
      }
      if (cardDetails.expiry.length !== 5) {
        toast.error("Please enter a valid card expiry (MM/YY).");
        return;
      }
      if (cardDetails.cvv.length !== 3) {
        toast.error("Please enter a valid 3-digit CVV.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // 1. If "Ship to my saved profile address" is selected, sync the shipping info to the user's permanent profile
      if (addressOption === "saved") {
        const changesNeedSync =
          shippingDetails.firstName !== profile.firstName ||
          shippingDetails.lastName !== profile.lastName ||
          shippingDetails.phone !== profile.phone ||
          shippingDetails.address !== profile.address;

        if (changesNeedSync) {
          await fetchWithAuth("/users/me", {
            method: "PUT",
            body: JSON.stringify({
              username: profile.username,
              firstName: shippingDetails.firstName,
              lastName: shippingDetails.lastName,
              phone: shippingDetails.phone,
              address: shippingDetails.address
            })
          });
          toast.success("Profile address details updated successfully.");
        }
      }

      // 2. Assemble backend Order payload
      const orderItems = items.map((item) => ({
        product: {
          id: item.product.id
        },
        quantity: item.quantity,
        price: item.product.price
      }));

      const receiverName = `${shippingDetails.firstName.trim()} ${shippingDetails.lastName.trim()}`;

      const orderPayload = {
        totalAmount: total,
        shippingAddress: shippingDetails.address,
        phoneNumber: shippingDetails.phone,
        receiverName: receiverName,
        items: orderItems
      };

      // 3. Post the order to the backend
      const response = await fetchWithAuth("/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload)
      });

      // 4. Trigger success & clear cart locally
      setPlacedOrder(response);
      setFinalTotal(total);
      clearCart();
      setCheckoutSuccess(true);
      toast.success("Order placed successfully!");
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error("Order submission failure:", err);
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 5);
    return delivery.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (checkoutSuccess) {
    const displayTotal = placedOrder?.totalAmount !== undefined
      ? Number(placedOrder.totalAmount)
      : finalTotal;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-16 px-4 sm:px-6 max-w-3xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/30 relative"
          >
            <CheckCircle2 size={56} className="text-primary animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -inset-2 border border-dashed border-primary/30 rounded-full"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl text-foreground mb-4 tracking-tight"
          >
            THANK YOU FOR YOUR <span className="text-gradient">ORDER</span>!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg mb-8 max-w-md"
          >
            Your payment was processed successfully, and order{" "}
            <span className="text-foreground font-semibold">#DRIP{placedOrder?.id || "9921"}</span> has been placed.
          </motion.p>

          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass w-full rounded-2xl p-6 sm:p-8 text-left mb-8 space-y-6 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-display text-xl tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Truck size={18} className="text-primary" /> DELIVERY & ORDER SUMMARY
            </h3>

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Receiver Name:{" "}
                  <span className="text-foreground font-medium">{placedOrder?.receiverName || `${shippingDetails.firstName} ${shippingDetails.lastName}`}</span>
                </p>
                <p className="text-muted-foreground">
                  Shipping To:{" "}
                  <span className="text-foreground font-medium block mt-0.5">{placedOrder?.shippingAddress || shippingDetails.address}</span>
                </p>
                <p className="text-muted-foreground">
                  Contact Phone:{" "}
                  <span className="text-foreground font-medium">{placedOrder?.phoneNumber || shippingDetails.phone}</span>
                </p>
              </div>

              <div className="space-y-3 sm:border-l sm:border-border sm:pl-6">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Calendar size={16} />
                  <span>Estimated Delivery:</span>
                </div>
                <p className="text-foreground font-semibold text-base pl-6">
                  {getEstimatedDeliveryDate()}
                </p>
                <p className="text-xs text-muted-foreground pl-6 flex items-center gap-1">
                  <Sparkles size={12} className="text-primary" /> Delivery estimate is in Indian Standard Time (IST)
                </p>
              </div>
            </div>

            <div className="h-px bg-border mt-4" />
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground font-medium">Total to Pay (COD):</span>
              <span className="text-2xl font-bold text-primary">₹{displayTotal.toLocaleString()}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link
              to="/dashboard"
              className="bg-secondary text-foreground hover:bg-secondary/80 border border-border px-8 py-3 rounded-lg font-display tracking-wider transition-all"
            >
              VIEW ORDER HISTORY
            </Link>
            <Link
              to="/shop"
              className="bg-primary text-primary-foreground hover-neon px-8 py-3 rounded-lg font-display tracking-wider transition-all flex items-center justify-center gap-2"
            >
              CONTINUE SHOPPING <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-8">
          SECURE <span className="text-gradient">CHECKOUT</span>
        </h1>

        {cartLoading || profileLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4" />
            <p>Loading checkout details...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl p-8">
            <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground text-lg mb-6">Your cart is empty. Cannot proceed to checkout.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display tracking-wider px-8 py-3 rounded-lg hover-neon transition-all"
            >
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
            {/* Left side: Address & Payment */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Address selection cards */}
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="font-display text-lg tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> 1. SHIPPING ADDRESS OPTIONS
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Option 1: Saved Profile */}
                  <div
                    onClick={() => setAddressOption("saved")}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      addressOption === "saved"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-border bg-secondary hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-foreground">Saved Profile Address</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        addressOption === "saved" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {addressOption === "saved" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {profile.firstName || profile.lastName ? (
                        <>
                          <span className="text-foreground font-medium block mb-1">
                            {profile.firstName} {profile.lastName}
                          </span>
                          {profile.address || "No address saved. Fill below to save to profile."}
                          {profile.phone && <span className="block mt-1">📞 {profile.phone}</span>}
                        </>
                      ) : (
                        "No saved profile information. Enter billing details below to save permanently."
                      )}
                    </p>
                  </div>

                  {/* Option 2: Custom Shipping Address */}
                  <div
                    onClick={() => setAddressOption("custom")}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      addressOption === "custom"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-border bg-secondary hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-foreground">Ship to a Different Place</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        addressOption === "custom" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {addressOption === "custom" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Input a custom delivery address for this specific order only. It will not overwrite your profile settings.
                    </p>
                  </div>
                </div>

                {/* Form fields for address */}
                <div className="pt-4 border-t border-border/50 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <User size={12} /> First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingDetails.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        placeholder="John"
                        required
                        disabled={addressOption === "saved" && profileLoading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <User size={12} /> Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingDetails.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                        placeholder="Doe"
                        required
                        disabled={addressOption === "saved" && profileLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Phone size={12} /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      disabled={addressOption === "saved" && profileLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <MapPin size={12} /> Detailed Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="House No, Apartment, Street, City, State, ZIP Code"
                      required
                      disabled={addressOption === "saved" && profileLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Payment selector and fields */}
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="font-display text-lg tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> 2. PAYMENT METHODS
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between h-24 ${
                      paymentMethod === "COD"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <Truck size={20} className={paymentMethod === "COD" ? "text-primary" : "text-muted-foreground"} />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "COD" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-foreground block">Cash on Delivery</span>
                      <span className="text-[10px] text-muted-foreground">Pay with cash upon arrival</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between h-24 ${
                      paymentMethod === "CARD"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <CreditCard size={20} className={paymentMethod === "CARD" ? "text-primary" : "text-muted-foreground"} />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "CARD" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {paymentMethod === "CARD" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-foreground block">Credit/Debit Card</span>
                      <span className="text-[10px] text-muted-foreground">Fast & secure mock payment</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === "CARD" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pt-4 border-t border-border/50 space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                          placeholder="4111 2222 3333 4444"
                          required={paymentMethod === "CARD"}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">Name on Card</label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardDetails.cardName}
                          onChange={handleCardInputChange}
                          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                          placeholder="John Doe"
                          required={paymentMethod === "CARD"}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground font-medium">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardInputChange}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                            placeholder="MM/YY"
                            maxLength={5}
                            required={paymentMethod === "CARD"}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground font-medium">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                            placeholder="***"
                            maxLength={3}
                            required={paymentMethod === "CARD"}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side: Summary & Submit */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-xl p-6 sticky top-24 space-y-6">
                <h3 className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                  <ShoppingBag size={18} className="text-primary" /> ORDER SUMMARY
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs items-center">
                      <img
                        src={getImageUrl(item.product?.imageUrl) || fallbackImage}
                        alt={item.product?.name}
                        className="w-12 h-14 object-cover rounded bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.product?.name}</h4>
                        <p className="text-muted-foreground text-[10px]">
                          Qty: {item.quantity} | Size: {item.size}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground">
                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border/50" />

                {/* Costs */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-primary" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-muted-foreground italic">
                      Free shipping on orders above ₹2,000
                    </p>
                  )}
                  <div className="h-px bg-border/50 my-1" />
                  <div className="flex justify-between text-sm text-foreground font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary text-base">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Secure checkout note */}
                <div className="bg-secondary rounded-lg p-3 text-[11px] text-muted-foreground flex gap-2 items-start">
                  <Lock size={14} className="text-primary shrink-0 mt-0.5" />
                  <p>
                    Your transaction is encrypted and secured. This is a fully compliant demo checkout for Dripverse.
                  </p>
                </div>

                {/* Checkout Submit button */}
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-display text-base tracking-wider py-3.5 rounded-lg hover-neon transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary-foreground" />
                      PROCESSING ORDER...
                    </>
                  ) : (
                    <>
                      PLACE ORDER (₹{total.toLocaleString()})
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
