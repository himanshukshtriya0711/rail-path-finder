import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Train, Search, Calendar as CalendarIcon, User, Shield } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trainClass, setTrainClass] = useState("");

  const handleSearch = () => {
    if (from && to && date && trainClass) {
      navigate("/search", { 
        state: { from, to, date: format(date, "yyyy-MM-dd"), trainClass } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <Train className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">RailBook</h1>
                <p className="text-sm text-white/70">Indian Railway Reservation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate("/auth")}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => navigate("/admin")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Book Your Train Journey
          </h2>
          <p className="text-xl text-white/80">
            Search trains, check availability, and book tickets instantly across India
          </p>
        </div>

        {/* Search Card */}
        <Card className="mx-auto max-w-4xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input 
                  id="from" 
                  placeholder="Enter origin station" 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input 
                  id="to" 
                  placeholder="Enter destination station"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Journey Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={trainClass} onValueChange={setTrainClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sleeper">Sleeper (SL)</SelectItem>
                    <SelectItem value="3ac">Third AC (3A)</SelectItem>
                    <SelectItem value="2ac">Second AC (2A)</SelectItem>
                    <SelectItem value="1ac">First AC (1A)</SelectItem>
                    <SelectItem value="chair">AC Chair Car (CC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-5 w-5" />
              Search Trains
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Train className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Wide Coverage</h3>
            <p className="text-muted-foreground">
              Book trains across all routes in India
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Search className="h-8 w-8 text-success" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Real-time Availability</h3>
            <p className="text-muted-foreground">
              Check live seat availability and book instantly
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
            <p className="text-muted-foreground">
              Safe and secure payment gateway
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
