export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight">
        Berufspädagogik
      </h1>
      <p className="text-xl md:text-2xl text-white max-w-2xl">
        Die moderne Plattform für angehende Berufspädagogen. 
        Strukturiert, effizient und mobil optimiert.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-4xl">
        <div className="p-6 bg-white/5 rounded-xl transition-all border border-white/10 hover:border-white/20 hover:bg-white/10">
          <h3 className="text-2xl font-semibold mb-2 text-primary">Zusammenfassungen</h3>
          <p className="text-white/80">
            Greife auf strukturierte Modulinhalte zu, lade PDFs herunter und bearbeite deine Lernunterlagen.
          </p>
        </div>
        <div className="p-6 bg-white/5 rounded-xl transition-all border border-white/10 hover:border-white/20 hover:bg-white/10">
          <h3 className="text-2xl font-semibold mb-2 text-primary">Karteikarten</h3>
          <p className="text-white/80">
            Lerne effizient mit unserem integrierten Karteikartensystem. Erstelle Decks und tracke deinen Fortschritt.
          </p>
        </div>
      </div>
    </div>
  );
}
