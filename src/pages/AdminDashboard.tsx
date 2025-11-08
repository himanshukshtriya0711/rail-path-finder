import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Train, Users, TrendingUp, Calendar, Plus } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Bookings", value: "12,845", icon: Calendar, trend: "+12.5%" },
    { label: "Active Trains", value: "486", icon: Train, trend: "+2.3%" },
    { label: "Total Users", value: "45,239", icon: Users, trend: "+18.2%" },
    { label: "Revenue", value: "₹48.5L", icon: TrendingUp, trend: "+24.1%" },
  ];

  const recentBookings = [
    { pnr: "PNR2345678901", train: "12301 - Rajdhani Express", status: "confirmed", amount: 1850 },
    { pnr: "PNR2345678902", train: "12951 - Mumbai Rajdhani", status: "rac", amount: 2150 },
    { pnr: "PNR2345678903", train: "12423 - Dibrugarh Express", status: "confirmed", amount: 1450 },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Train className="h-5 w-5 text-primary" />
                <span className="text-xl font-semibold text-primary">Admin Dashboard</span>
              </div>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Admin Panel
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-success">{stat.trend}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="trains">Manage Trains</TabsTrigger>
            <TabsTrigger value="routes">Manage Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.pnr}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold">{booking.pnr}</p>
                      <p className="text-sm text-muted-foreground">{booking.train}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "outline"}
                        className={booking.status === "confirmed" ? "bg-success" : ""}
                      >
                        {booking.status.toUpperCase()}
                      </Badge>
                      <p className="font-semibold">₹{booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trains">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Train Management</h2>
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Train
                </Button>
              </div>
              <p className="text-muted-foreground">
                Train management interface coming soon. You'll be able to add, edit, and
                remove trains from the system.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Route Management</h2>
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Route
                </Button>
              </div>
              <p className="text-muted-foreground">
                Route management interface coming soon. You'll be able to configure
                routes, stations, and schedules.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
