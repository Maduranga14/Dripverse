import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth, getImageUrl } from "@/lib/api";
import AddCategoryModal from "@/components/AddCategoryModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import { toast } from "sonner";
import fallbackImage from "@/assets/product-1.jpg";

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // Fetch active admin profile details from /users/me endpoint
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchWithAuth("/users/me")
  });

  // State to track form inputs
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });

  // Populate form inputs from backend response when loaded
  useEffect(() => {
    if (userProfile) {
      setProfile({
        username: userProfile.username || "",
        email: userProfile.email || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phone: userProfile.phone || "",
        address: userProfile.address || ""
      });
    }
  }, [userProfile]);

  // Mutation to submit profile edits
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
      
      // Update localStorage user info if cache is active
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        try {
          const userObj = JSON.parse(cachedUser);
          localStorage.setItem("user", JSON.stringify({ ...userObj, ...updatedUser }));
        } catch (e) {
          console.error("Error updating local storage cache", e);
        }
      }
      toast.success("Admin profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile details");
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchWithAuth("/categories")
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchWithAuth("/products")
  });
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery<any[]>({
    queryKey: ["adminOrders"],
    queryFn: () => fetchWithAuth("/orders")
  });
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      fetchWithAuth(`/orders/${orderId}/status`, {
        method: "POST",
        body: JSON.stringify(status)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Order status updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update order status");
    }
  });
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "", details: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showcaegoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/upload/image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.text();
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (product: any) => fetchWithAuth("/products", {
      method: "POST",
      body: JSON.stringify({ ...product, category: { id: product.categoryId } })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setNewProduct({ name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "", details: "" });
      setSelectedFile(null);
    }
  });
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = newProduct.imageUrl;

    if (selectedFile) {
      try {
        finalImageUrl = await uploadImageMutation.mutateAsync(selectedFile);
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      }
    }

    createProductMutation.mutate({ 
      ...newProduct, 
      price: newProduct.price === "" ? 0 : Number(newProduct.price), 
      stock: newProduct.stock === "" ? 0 : Number(newProduct.stock), 
      imageUrl: finalImageUrl 
    });
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

  const totalRevenue = orders
    .filter((o: any) => o.status?.toUpperCase() !== "CANCELLED")
    .reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-display mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 text-center">
                <h3 className="text-muted-foreground mb-2">Total Orders</h3>
                <p className="text-4xl font-display">{orders.length}</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <h3 className="text-muted-foreground mb-2">Total Revenue</h3>
                <p className="text-4xl font-display">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <h3 className="text-muted-foreground mb-2">Total Products</h3>
                <p className="text-4xl font-display">{products.length}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Categories</h2>
                <button
                  id="add-category-btn"
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover-neon"
                >
                    Add Category
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-secondary">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat: any) => (
                      <tr key={cat.id} className="border-b border-border">
                        <td className="px-6 py-4">{cat.id}</td>
                        <td className="px-6 py-4">{cat.name}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowEditCategoryModal(true);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-muted-foreground">No categories found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="products">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Products</h2>
              </div>

              <div className="mb-8 p-4 border border-border rounded-lg">
                <h3 className="font-bold mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Product Name" className="bg-secondary px-4 py-2 rounded border" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                  <input required type="number" placeholder="Price" className="bg-secondary px-4 py-2 rounded border" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  <input required type="number" placeholder="Qty" className="bg-secondary px-4 py-2 rounded border" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                  <select required className="bg-secondary px-4 py-2 rounded border" value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <textarea placeholder="Description" className="bg-secondary px-4 py-2 rounded border md:col-span-2" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                  <textarea placeholder="Details (One per line)" className="bg-secondary px-4 py-2 rounded border md:col-span-2 h-28" value={newProduct.details} onChange={e => setNewProduct({ ...newProduct, details: e.target.value })} />

                  <div className="md:col-span-2 p-4 border border-dashed border-border rounded">
                    <p className="text-sm font-bold mb-2">Product Image (Optional)</p>
                    <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="mb-2 block text-sm" />
                    <p className="text-xs text-muted-foreground mb-2">- OR -</p>
                    <input placeholder="Image URL" className="bg-secondary px-4 py-2 rounded border w-full" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                  </div>

                  <button type="submit" disabled={createProductMutation.isPending || uploadImageMutation.isPending} className="bg-primary text-primary-foreground px-4 py-2 rounded hover-neon md:col-span-2 disabled:opacity-50">
                    {createProductMutation.isPending || uploadImageMutation.isPending ? "Creating..." : "Create Product"}
                  </button>
                </form>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-secondary">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod: any) => (
                      <tr key={prod.id} className="border-b border-border">
                        <td className="px-6 py-4">{prod.name}</td>
                        <td className="px-6 py-4">${prod.price}</td>
                        <td className="px-6 py-4">{prod.stock}</td>
                        <td className="px-6 py-4 text-blue-500 cursor-pointer">Edit</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Manage Orders</h2>
              
              {isOrdersLoading ? (
                <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-3" />
                  <p>Loading orders...</p>
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-secondary text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Order Info</th>
                        <th className="px-4 py-3">Customer details</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => {
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

                        return (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                            <td className="px-4 py-4 space-y-1">
                              <span className="font-bold text-foreground block">#DRIP{order.id}</span>
                              <span className="text-xs text-muted-foreground block">
                                {formatDate(order.orderDate)}
                              </span>
                            </td>
                            <td className="px-4 py-4 space-y-1">
                              <span className="font-medium text-foreground block">{order.receiverName}</span>
                              <span className="text-xs text-muted-foreground block">{order.phoneNumber}</span>
                              <span className="text-[11px] text-muted-foreground block max-w-xs truncate" title={order.shippingAddress}>
                                {order.shippingAddress}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-2 max-w-xs">
                                {order.items?.map((item: any) => (
                                  <div key={item.id} className="flex items-center gap-2 text-xs">
                                    <img
                                      src={getImageUrl(item.product?.imageUrl) || fallbackImage}
                                      alt={item.product?.name}
                                      className="w-8 h-10 object-cover rounded bg-secondary shrink-0"
                                    />
                                    <span className="truncate flex-1 text-foreground" title={item.product?.name}>
                                      {item.product?.name || "Product"} (x{item.quantity})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-bold text-foreground">
                              ₹{order.totalAmount?.toLocaleString()}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyles(order.status)}`}>
                                {order.status || "PENDING"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={order.status || "PENDING"}
                                onChange={(e) => updateOrderStatusMutation.mutate({ orderId: order.id, status: e.target.value })}
                                disabled={updateOrderStatusMutation.isPending}
                                className="bg-secondary text-foreground text-xs rounded border border-border px-2 py-1 focus:outline-none focus:border-primary disabled:opacity-50"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="glass rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Admin Profile Settings</h2>
              {isProfileLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading admin details...</div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <input 
                        type="text" 
                        value={profile.username}
                        onChange={e => setProfile({ ...profile, username: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" 
                        placeholder="Username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" 
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input 
                        type="text" 
                        value={profile.firstName}
                        onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" 
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.lastName}
                        onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" 
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
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" 
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Office/Shipping Address</label>
                    <textarea 
                      value={profile.address}
                      onChange={e => setProfile({ ...profile, address: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 min-h-[100px] focus:border-primary focus:outline-none" 
                      placeholder="Your office or shipping address"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover-neon transition-all mt-4 disabled:opacity-50 font-medium"
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
      <AddCategoryModal isOpen={showcaegoryModal} onClose={() => setShowCategoryModal(false)} />
      <EditCategoryModal isOpen={showEditCategoryModal} onClose={() => setShowEditCategoryModal(false)} category={selectedCategory} />
    </div>
  );
};
export default AdminDashboard;