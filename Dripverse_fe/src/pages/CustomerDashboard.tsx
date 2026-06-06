import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth, getImageUrl } from "@/lib/api";
import { toast } from "sonner";
import fallbackImage from "@/assets/product-1.jpg";
import { Calendar, MapPin, Phone, ShoppingBag, Package } from "lucide-react";

const CustomerDashboard = () => {
    const queryClient = useQueryClient();
    
    
    const { data: userProfile, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: () => fetchWithAuth("/users/me")
    });

    
    const { data: orders, isLoading: ordersLoading } = useQuery<any[]>({
        queryKey: ["userOrders"],
        queryFn: () => fetchWithAuth("/orders/me")
    });

    
    const [profile, setProfile] = useState({
        username: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: ""
    });

    
    useEffect(() => {
        if (userProfile) {
            setProfile({
                username: userProfile.username || "",
                firstName: userProfile.firstName || "",
                lastName: userProfile.lastName || "",
                phone: userProfile.phone || "",
                address: userProfile.address || ""
            });
        }
    }, [userProfile]);

    
    const updateProfileMutation = useMutation({
        mutationFn: (updatedData: typeof profile) => fetchWithAuth("/users/me", {
            method: "PUT",
            body: JSON.stringify(updatedData)
        }),
        onSuccess: (response) => {
            
            const updatedUser = response.user || response;
            const newToken = response.token;
            
            if (newToken) {
                localStorage.setItem("token", newToken);
            }

            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            
            
            const cachedUser = localStorage.getItem("user");
            if (cachedUser) {
                try {
                    const userObj = JSON.parse(cachedUser);
                    localStorage.setItem("user", JSON.stringify({ ...userObj, ...updatedUser }));
                } catch (e) {
                    console.error("Error updating local storage cache", e);
                }
            }
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update profile details");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profile);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-display mb-8">My Dashboard</h1>

                <Tabs defaultValue="orders" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="orders">Order History</TabsTrigger>
                        <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Package className="text-primary" size={22} /> Order History
                            </h2>
                            
                            {ordersLoading ? (
                                <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-3" />
                                    <p>Loading your order history...</p>
                                </div>
                            ) : !orders || orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
                                    <p className="text-muted-foreground text-lg mb-6">You have no previous orders</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => {
                                        
                                        const getStatusStyles = (status: string) => {
                                            switch (status?.toUpperCase()) {
                                                case "DELIVERED":
                                                    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                                                case "SHIPPED":
                                                    return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
                                                case "PROCESSING":
                                                    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
                                                case "PENDING":
                                                    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
                                                case "CANCELLED":
                                                    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
                                                default:
                                                    return "bg-secondary text-foreground border-border";
                                            }
                                        };

                                        
                                        const formatDate = (dateString: string) => {
                                            if (!dateString) return "N/A";
                                            try {
                                                const d = new Date(dateString);
                                                return d.toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                });
                                            } catch (e) {
                                                return dateString;
                                            }
                                        };

                                        return (
                                            <div key={order.id} className="border border-border/60 rounded-xl overflow-hidden bg-background/50 hover:border-primary/30 transition-all">
                                                {/* Card Header */}
                                                <div className="bg-secondary/40 px-4 py-3 sm:px-6 border-b border-border/50 flex flex-wrap justify-between items-center gap-2">
                                                    <div className="space-y-0.5">
                                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Order ID</span>
                                                        <p className="text-sm font-bold text-foreground">#DRIP{order.id}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(order.status)}`}>
                                                            {order.status || "PENDING"}
                                                        </span>
                                                    </div>
                                                </div>

                                                
                                                <div className="p-4 sm:p-6 grid md:grid-cols-3 gap-6">
                                                    
                                                    <div className="md:col-span-2 space-y-4">
                                                        <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Items</span>
                                                        {order.items && order.items.map((item: any) => (
                                                            <div key={item.id} className="flex gap-4 items-center border-b border-border/20 last:border-b-0 pb-3 last:pb-0">
                                                                <img 
                                                                    src={getImageUrl(item.product?.imageUrl) || fallbackImage}
                                                                    alt={item.product?.name}
                                                                    className="w-12 h-14 sm:w-16 sm:h-20 object-cover rounded bg-secondary shrink-0"
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="text-sm font-medium text-foreground truncate">{item.product?.name || "Product Item"}</h4>
                                                                    <p className="text-xs text-muted-foreground mt-1">₹{item.price?.toLocaleString()} &times; {item.quantity}</p>
                                                                </div>
                                                                <span className="text-sm font-semibold text-foreground">
                                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    
                                                    <div className="bg-secondary/20 p-4 rounded-xl border border-border/40 text-xs space-y-3 h-fit">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block border-b border-border/40 pb-1.5 mb-2">
                                                            Shipping & Delivery
                                                        </span>
                                                        
                                                        {order.receiverName && (
                                                            <div className="flex gap-2 items-start">
                                                                <Package size={14} className="text-primary shrink-0 mt-0.5" />
                                                                <span className="text-foreground font-medium">{order.receiverName}</span>
                                                            </div>
                                                        )}
                                                        
                                                        {order.shippingAddress && (
                                                            <div className="flex gap-2 items-start">
                                                                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                                                                <span className="text-muted-foreground leading-relaxed">{order.shippingAddress}</span>
                                                            </div>
                                                        )}

                                                        {order.phoneNumber && (
                                                            <div className="flex gap-2 items-start">
                                                                <Phone size={14} className="text-primary shrink-0 mt-0.5" />
                                                                <span className="text-muted-foreground">{order.phoneNumber}</span>
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2 items-start pt-2 border-t border-border/30">
                                                            <Calendar size={14} className="text-primary shrink-0 mt-0.5" />
                                                            <span className="text-muted-foreground">Placed: {formatDate(order.orderDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                <div className="bg-secondary/10 px-4 py-3 sm:px-6 border-t border-border/30 flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {order.status?.toUpperCase() === "DELIVERED"
                                                            ? "Total Paid:"
                                                            : order.status?.toUpperCase() === "CANCELLED"
                                                                ? "Total Amount:"
                                                                : "Total to Pay (COD):"}
                                                    </span>
                                                    <span className="text-base sm:text-lg font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="profile">
                        <div className="glass rounded-xl p-6 max-w-2xl">
                            <h2 className="text-xl font-bold mb-4">Account Information</h2>
                            {isLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading profile details...</div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Username</label>
                                        <input 
                                            type="text" 
                                            value={profile.username}
                                            onChange={e => setProfile({ ...profile, username: e.target.value })}
                                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2" 
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                First Name
                                            </label>
                                            <input 
                                                type="text" 
                                                value={profile.firstName}
                                                onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                                className="w-full bg-secondary border border-border rounded-lg px-4 py-2" 
                                                placeholder="First name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Last Name
                                            </label>
                                            <input 
                                                type="text" 
                                                value={profile.lastName}
                                                onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                                className="w-full bg-secondary border border-border rounded-lg px-4 py-2" 
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input 
                                            type="text" 
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2" 
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Shipping Address</label>
                                        <textarea 
                                            value={profile.address}
                                            onChange={e => setProfile({ ...profile, address: e.target.value })}
                                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2 min-h-[100px]" 
                                            placeholder="Your shipping address"
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={updateProfileMutation.isPending}
                                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover-neon transition-all mt-4 disabled:opacity-50"
                                    >
                                        {updateProfileMutation.isPending ? "Saving Changes..." : "Save Changes"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <Footer />
        </div>
    );
};

export default CustomerDashboard;