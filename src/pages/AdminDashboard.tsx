import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Train, Users, TrendingUp, Calendar, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post, get } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [fare, setFare] = useState<number | ''>('');
  const [route, setRoute] = useState("");

  const handleCreate = async () => {
    try {
      const payload = { number, name, fare: typeof fare === 'number' ? fare : undefined, route: route.split(',').map(s => s.trim()).filter(Boolean) };
      const res = await post('/api/trains', payload, false);
      setOpen(false);
      toast({ title: 'Train added', description: `Train ${res.train.number} - ${res.train.name} added.` });
      // reset
      setNumber(''); setName(''); setFare(''); setRoute('');
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: 'Failed to add train', description: msg });
    }
  };

  // Routes management (client-side for now)
  const [openRoute, setOpenRoute] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState("");
  const [routesList, setRoutesList] = useState<Array<{ id: string; name: string; stations: string[] }>>([]);

  const handleCreateRoute = () => {
    const stations = routeStations.split(',').map(s => s.trim()).filter(Boolean);
    if (!routeName || stations.length < 2) {
      toast({ title: 'Invalid route', description: 'Provide a name and at least two stations.' });
      return;
    }
    const newRoute = { id: `r-${Date.now()}`, name: routeName, stations };
    setRoutesList(prev => [newRoute, ...prev]);
    setOpenRoute(false);
    setRouteName(''); setRouteStations('');
    toast({ title: 'Route added', description: `Route ${newRoute.name} added with ${stations.length} stations.` });
  };

  // Users management (server-backed)
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string; createdAt: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await get('/api/admin/users', true);
      setUsers(res.users || []);
    } catch (err: any) {
      console.error('loadUsers error', err);
      toast({ title: 'Failed to load users', description: err.message || String(err) });
    } finally {
      setLoadingUsers(false);
    }
  };

  // load users on mount
  useEffect(() => { loadUsers(); }, []);

  const changeUserRole = async (id: string, newRole: 'USER' | 'ADMIN') => {
    try {
      await post(`/api/admin/users/${id}/role`, { role: newRole }, true);
      toast({ title: 'Role updated', description: `User role updated to ${newRole}` });
      loadUsers();
    } catch (err: any) {
      toast({ title: 'Failed to update role', description: err.message || String(err) });
    }
  };

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
            <TabsTrigger value="users">Manage Users</TabsTrigger>
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
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Train
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Train</DialogTitle>
                          <DialogDescription>Provide basic train details. Route should be comma-separated station names.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div>
                            <Label>Train Number</Label>
                            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 12345" />
                          </div>
                          <div>
                            <Label>Train Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rajdhani Express" />
                          </div>
                          <div>
                            <Label>Fare (per passenger)</Label>
                            <Input type="number" value={fare} onChange={(e) => setFare(e.target.value ? Number(e.target.value) : '')} placeholder="e.g. 500" />
                          </div>
                          <div>
                            <Label>Route (comma separated)</Label>
                            <Input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="New Delhi, Mathura, Agra" />
                          </div>
                        </div>
                        <DialogFooter>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Train</Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-muted-foreground">
                    Train management interface coming soon. You'll be able to add, edit, and
                    remove trains from the system.
                  </p>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Button variant="outline" size="sm" onClick={loadUsers}>Refresh</Button>
              </div>
              {loadingUsers ? (
                <div>Loading users...</div>
              ) : (
                <div className="space-y-3">
                  {users.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No users found.</div>
                  ) : (
                    users.map(u => (
                      <div key={u.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-sm text-muted-foreground">{u.email}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">{u.role}</div>
                          {u.role !== 'ADMIN' ? (
                            <Button size="sm" onClick={() => changeUserRole(u.id, 'ADMIN')}>Promote</Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => changeUserRole(u.id, 'USER')}>Demote</Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Route Management</h2>
                  <Dialog open={openRoute} onOpenChange={setOpenRoute}>
                    <DialogTrigger asChild>
                      <Button className="bg-accent hover:bg-accent/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Route
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription>Provide a route name and a comma-separated list of stations.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div>
                          <Label>Route Name</Label>
                          <Input value={routeName} onChange={(e) => setRouteName(e.target.value)} placeholder="e.g. Delhi - Agra" />
                        </div>
                        <div>
                          <Label>Stations (comma separated)</Label>
                          <Input value={routeStations} onChange={(e) => setRouteStations(e.target.value)} placeholder="New Delhi, Mathura, Agra" />
                        </div>
                      </div>
                      <DialogFooter>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setOpenRoute(false)}>Cancel</Button>
                          <Button onClick={handleCreateRoute}>Create Route</Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-muted-foreground">Manage routes and station sequences used by trains.</p>
                <div className="mt-4 space-y-3">
                  {routesList.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No routes added yet.</div>
                  ) : (
                    routesList.map(r => (
                      <div key={r.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{r.name}</div>
                            <div className="text-sm text-muted-foreground">{r.stations.join(' → ')}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
