export interface HardTrain {
  id: string;
  number: string;
  name: string;
  route: string[]; // station names
  fare: number;
  departure: string;
  arrival: string;
  duration: string;
  availableSeats: number;
}

const cityPool = [
  // Core metro / large cities + common tourist/destination cities
  'New Delhi','Mumbai','Kolkata','Chennai','Bengaluru','Hyderabad','Ahmedabad','Pune','Jaipur','Lucknow',
  'Bhopal','Patna','Vadodara','Coimbatore','Nagpur','Indore','Thane','Guwahati','Amritsar','Varanasi',
  // Added to improve coverage for search examples
  'Agra','Surat','Rajkot','Nashik'
];

const pad = (n:number) => n.toString().padStart(2,'0');

function rand(seed:number, max:number){
  // simple deterministic LCG
  seed = (seed * 1664525 + 1013904223) % 0x100000000;
  return seed % max;
}

export function generateHardTrains(count = 60){
  const trains: HardTrain[] = [];
  for(let i=0;i<count;i++){
    const seed = i + 12345;
    const routeLen = 3 + (seed % 5); // 3..7
    const route: string[] = [];
    const used = new Set<number>();
    let s = seed;
    while(route.length < routeLen){
      const idx = rand(s++, cityPool.length);
      if(used.has(idx)) continue;
      used.add(idx);
      route.push(cityPool[idx]);
    }

    // times
    const depHour = 1 + (seed % 23);
    const durHours = 5 + (seed % 12);
    const arrHour = (depHour + durHours) % 24;

    const train: HardTrain = {
      id: `ht-${i}`,
      number: (10000 + i).toString(),
      name: `Express ${i+1}`,
      route,
      fare: 500 + ((seed * 13) % 2000),
      departure: `${pad(depHour)}:00`,
      arrival: `${pad(arrHour)}:00`,
      duration: `${durHours}h 00m`,
      availableSeats: 10 + (seed % 90),
    };
    trains.push(train);
  }
  return trains;
}

// Export a ready-made dataset
export const HARD_TRAINS = generateHardTrains(60);
