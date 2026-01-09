import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">Registrieren</h1>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Mustermann"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="deine@email.de"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          
          <button className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all">
            Konto erstellen
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Bereits registriert?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
