import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { error } from "console";
import { toast } from "sonner";

const CustomerDashboard = () => {
    const queryClient = useQueryClient();

    const {data: userProfile, isLoading } = useQuery({
        queryKey: ["userProfle"],
        queryFn: () => fetchWithAuth("/users/me")
    });

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        if (userProfile) {
            setProfile({
                firstName: userProfile.firstName || "",
                lastName: userProfile.lastName || "",
                userName: userProfile.userName || "",
                phone: userProfile.phone || "",
                address: userProfile.address || "",
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

            queryClient.invalidateQueries({ queryKey: ["userProfile"]});

            const cachedUser =localStorage.getItem("user");
            if (cachedUser) {
                try {
                    const userObj = JSON.parse(cachedUser);
                    localStorage.setItem("user", JSON.stringify({ ...userObj, ...updatedUser}));
                } catch (e) {
                    console.error("error updating local storage cache", e);
                }
            }
            toast.success("profile updated successfully"); 
        },
        onError: (error: any) => {
            toast.error(error.message || "failed to update profile");
        }
    });

    const handleSubmit =(e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profile);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-display mb-8">My Dashboard</h1>

                <Tabs defaultValue= "orders" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="orders">Order History</TabsTrigger>
                        <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">Past Orders</h2>
                            <div className="text-muted-foreground py-8 text-center">
                                You have no previous orders
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile">
                        <div className="glass rounded-xl p-6 max-w-2xl">
                            <h2 className="text-xl font-bold mb-4">Account Information</h2>
                            {isLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading profile details ...</div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
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
                                        <label className="text-sm font-medium">Username</label>
                                        <input 
                                            type="text"
                                            value={profile.userName}
                                            onChange={e => setProfile({ ...profile, userName: e.target.value})}
                                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2" 
                                            placeholder="username"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input 
                                            type="text"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value})}
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
                                            placeholder="Shipping address"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={updateProfileMutation.isPending} 
                                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover-neon transition-all mt-4"
                                    >
                                        Save Changes
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