import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Train, Clock, IndianRupee, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";

interface Train {
  train: { id: string; number: string; name: string };
  departure: string;
  arrival: string;
  duration: string;
  availableSeats: number;
  fare: number;
  status: "available" | "rac" | "waiting";
  route?: string[];
  scheduleId?: string;
}

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, trainClass } = location.state || {};
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (date) params.set('date', date);
        if (trainClass) params.set('trainClass', trainClass);
        const res = await get(`/api/trains/search?${params.toString()}`);
        setTrains(res.trains || []);
      } catch (err) {
        console.error(err);
        // surface a friendly error to the UI so user knows backend failed
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || 'Failed to load trains. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    if (from && to) load();
  }, [from, to, date, trainClass]);
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
        <h2 className="mb-6 text-2xl font-bold">Available Trains ({trains.length})</h2>
        {loading && <div>Loading...</div>}
        {!loading && error && (
          <div className="p-6 rounded-md bg-destructive/10 text-destructive">
            <strong>Unable to load trains:</strong>
            <div className="mt-2">{error}</div>
            <div className="mt-2 text-sm">Check that the backend is running at <code>http://localhost:4000</code> and try again.</div>
          </div>
        )}
        {!loading && !error && (
          <div className="space-y-4">
            {trains.map((t) => (
              <Card key={t.train.id} className="p-6 transition-shadow hover:shadow-lg">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-primary">
                        {t.train.number}
                      </h3>
                      <span className="text-lg font-semibold">{t.train.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div>
                        <div className="text-2xl font-bold">{t.departure}</div>
                        <div className="text-sm text-muted-foreground">{from}</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm font-medium">{t.duration}</div>
                      </div>
                      
                      <div>
                        <div className="text-2xl font-bold">{t.arrival}</div>
                        <div className="text-sm text-muted-foreground">{to}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 md:items-center">
                    {getStatusBadge(t.status, t.availableSeats)}
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold">
                        <IndianRupee className="h-5 w-5" />
                        {t.fare}
                      </div>
                      <div className="text-xs text-muted-foreground">per person</div>
                    </div>
                    
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 md:w-auto"
                      onClick={() => navigate('/booking', { 
                        // pass the full train result so booking page has fare, departure, arrival etc.
                        state: { train: { ...t.train, fare: t.fare, departure: t.departure, arrival: t.arrival, duration: t.duration }, from, to, date, trainClass, scheduleId: t.scheduleId } 
                      })}
                      disabled={t.status === "waiting"}
                    >
                      {t.status === "available" ? "Book Now" : "Book Anyway"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
