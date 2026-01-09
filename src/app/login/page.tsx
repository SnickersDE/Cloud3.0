import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">Anmelden</h1>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
            Einloggen
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Noch kein Konto?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
