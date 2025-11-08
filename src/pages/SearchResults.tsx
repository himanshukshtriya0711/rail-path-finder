import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Train, Clock, IndianRupee, Users } from "lucide-react";

interface Train {
  id: string;
  number: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  availableSeats: number;
  fare: number;
  status: "available" | "rac" | "waiting";
}

const mockTrains: Train[] = [
  {
    id: "1",
    number: "12301",
    name: "Rajdhani Express",
    departure: "06:00",
    arrival: "14:30",
    duration: "8h 30m",
    availableSeats: 45,
    fare: 1850,
    status: "available",
  },
  {
    id: "2",
    number: "12951",
    name: "Mumbai Rajdhani",
    departure: "16:55",
    arrival: "08:35",
    duration: "15h 40m",
    availableSeats: 12,
    fare: 2150,
    status: "rac",
  },
  {
    id: "3",
    number: "12423",
    name: "Dibrugarh Express",
    departure: "09:45",
    arrival: "19:20",
    duration: "9h 35m",
    availableSeats: 78,
    fare: 1450,
    status: "available",
  },
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, trainClass } = location.state || {};

  const getStatusBadge = (status: string, seats: number) => {
    if (status === "available" && seats > 20) {
      return <Badge className="bg-success">Available - {seats}</Badge>;
    } else if (status === "available") {
      return <Badge variant="secondary">Tatkal - {seats}</Badge>;
    } else if (status === "rac") {
      return <Badge variant="outline" className="border-accent text-accent">RAC - {seats}</Badge>;
    } else {
      return <Badge variant="destructive">WL - {seats}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div className="flex items-center gap-3">
              <Train className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">RailBook</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Summary */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">{from}</span>
                <div className="h-px flex-1 bg-border"></div>
                <Train className="h-5 w-5 text-muted-foreground" />
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-2xl font-bold text-primary">{to}</span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>{date}</span>
                <span>•</span>
                <span className="capitalize">{trainClass?.replace("ac", "AC ")}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Modify Search
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Available Trains ({mockTrains.length})</h2>
        
        <div className="space-y-4">
          {mockTrains.map((train) => (
            <Card key={train.id} className="p-6 transition-shadow hover:shadow-lg">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-primary">
                      {train.number}
                    </h3>
                    <span className="text-lg font-semibold">{train.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-2xl font-bold">{train.departure}</div>
                      <div className="text-sm text-muted-foreground">{from}</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm font-medium">{train.duration}</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold">{train.arrival}</div>
                      <div className="text-sm text-muted-foreground">{to}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 md:items-center">
                  {getStatusBadge(train.status, train.availableSeats)}
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold">
                      <IndianRupee className="h-5 w-5" />
                      {train.fare}
                    </div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                  
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 md:w-auto"
                    onClick={() => navigate("/booking", { 
                      state: { train, from, to, date, trainClass } 
                    })}
                    disabled={train.status === "waiting"}
                  >
                    {train.status === "available" ? "Book Now" : "Book Anyway"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
