import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";

const CustomerDashboard = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-display mb-8">My Dashboard</h1>

                <Tabs defaultValue= "orders" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger Value="orders">Order History</TabsTrigger>
                        <TabsTrigger Value="profile">Profile Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent Value="orders">
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">Past Orders</h2>
                            <div className="text-muted-foreground py-8 text-center">
                                You have no previous orders
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent Value="profile">
                        <div className="glass rounded-xl p-6 max-w-2xl">
                            <h2 className="text-xl font-bold mb-4">Account Information</h2>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            First Name
                                        </label>
                                        <input type="text" className="w-full bg-secondary border border-border rounded-lg px-4 py-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Last Name
                                        </label>
                                        <input type="text" className="w-full bg-secondary border border-border rounded-lg px-4 py-2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <input type="text" className="w-full bg-secondary border border-border rounded-lg px-4 py-2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Shipping Address</label>
                                    <textarea className="w-full bg-secondary border border-border rounded-lg px-4 py-2 min-h-[100px]" />
                                </div>
                                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover-neon transition-all mt-4">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </TabsContent>               
                </Tabs>
            </div>
            <Footer />
        </div>
    );
};

export default CustomerDashboard;