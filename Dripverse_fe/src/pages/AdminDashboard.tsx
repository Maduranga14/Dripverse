import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
// Added this comment to trigger Vite's HMR and clear the module cache
const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchWithAuth("/categories")
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchWithAuth("/products")
  });
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, stock: 0, categoryId: "", imageUrl: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      setNewProduct({ name: "", description: "", price: 0, stock: 0, categoryId: "", imageUrl: "" });
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
    
    createProductMutation.mutate({ ...newProduct, imageUrl: finalImageUrl });
  };
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
                <p className="text-4xl font-display">0</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <h3 className="text-muted-foreground mb-2">Total Revenue</h3>
                <p className="text-4xl font-display">$0.00</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <h3 className="text-muted-foreground mb-2">Total Products</h3>
                <p className="text-4xl font-display">0</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Categories</h2>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover-neon">Add Category</button>
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
                          <button className="text-blue-500 hover:underline">Edit</button>
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
                  <input required placeholder="Product Name" className="bg-secondary px-4 py-2 rounded border" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input required type="number" placeholder="Price" className="bg-secondary px-4 py-2 rounded border" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                  <input required type="number" placeholder="Stock" className="bg-secondary px-4 py-2 rounded border" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                  <select required className="bg-secondary px-4 py-2 rounded border" value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <textarea placeholder="Description" className="bg-secondary px-4 py-2 rounded border md:col-span-2" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  
                  <div className="md:col-span-2 p-4 border border-dashed border-border rounded">
                    <p className="text-sm font-bold mb-2">Product Image (Optional)</p>
                    <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="mb-2 block text-sm" />
                    <p className="text-xs text-muted-foreground mb-2">- OR -</p>
                    <input placeholder="Image URL" className="bg-secondary px-4 py-2 rounded border w-full" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
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
              <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
              <div className="text-center py-8 text-muted-foreground">No orders found.</div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="glass rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
              <div className="text-center py-8 text-muted-foreground">Profile settings here...</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};
export default AdminDashboard;