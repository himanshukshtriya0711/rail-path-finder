import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Train, IndianRupee, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { train, from, to, date, trainClass } = location.state || {};
  
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "" }
  ]);
  const [contact, setContact] = useState({ email: "", phone: "" });

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", gender: "" }]);
  };

  const handleBooking = () => {
    const pnr = `PNR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your PNR is ${pnr}. Check your email for details.`,
    });
    setTimeout(() => navigate("/"), 2000);
  };

  if (!train) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">No train selected</p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Train className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">RailBook</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Complete Your Booking</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Details */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Passenger Details
              </h2>
              
              {passengers.map((passenger, index) => (
                <div key={index} className="mb-6 rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Passenger {index + 1}</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Enter name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" placeholder="Age" />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={handleAddPassenger}
                className="w-full"
              >
                + Add Passenger
              </Button>
            </Card>

            {/* Contact Details */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com"
                    value={contact.email}
                    onChange={(e) => setContact({...contact, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    type="tel" 
                    placeholder="+91 1234567890"
                    value={contact.phone}
                    onChange={(e) => setContact({...contact, phone: e.target.value})}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="mb-4 text-xl font-semibold">Booking Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-bold text-lg text-primary">{train.name}</div>
                  <div className="text-muted-foreground">{train.number}</div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-semibold">{from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-semibold">{to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span className="font-semibold capitalize">{trainClass}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passengers</span>
                  <span className="font-semibold">{passengers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <div className="flex items-center">
                    <IndianRupee className="h-3 w-3" />
                    <span className="font-semibold">{train.fare * passengers.length}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <div className="flex items-center">
                    <IndianRupee className="h-3 w-3" />
                    <span>{Math.round(train.fare * passengers.length * 0.05)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <div className="flex items-center text-primary">
                    <IndianRupee className="h-4 w-4" />
                    <span>{Math.round(train.fare * passengers.length * 1.05)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="mt-6 w-full bg-accent hover:bg-accent/90 h-12"
                onClick={handleBooking}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Button>
              
              <p className="mt-3 text-xs text-center text-muted-foreground">
                By proceeding, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
