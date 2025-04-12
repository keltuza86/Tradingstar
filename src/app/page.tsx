import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">TradingSync Pro</h1>
        <p className="text-xl">Sistema de Seguimiento y Análisis de Trading</p>
        <p className="mt-4 text-gray-600">Fecha y Hora Actual: {new Date().toLocaleString('es-ES')}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-3 text-blue-700">Panel de Control</h2>
          <p className="mb-4">Visualiza el rendimiento de tus operaciones con gráficos y estadísticas detalladas.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Ver Panel de Control →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-3 text-blue-700">Registro de Operaciones</h2>
          <p className="mb-4">Registra y gestiona todas tus operaciones de trading en un solo lugar.</p>
          <Link href="/operations" className="text-blue-600 hover:underline">Ver Operaciones →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-3 text-blue-700">Diario de Trading</h2>
          <p className="mb-4">Registra tus errores, sentimientos y aspectos a mejorar en cada operación.</p>
          <Link href="/trading-journal" className="text-blue-600 hover:underline">Ver Diario →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-3 text-blue-700">Calendario de Trading</h2>
          <p className="mb-4">Visualiza días buenos (calientes) y malos (fríos) para optimizar tus operaciones.</p>
          <Link href="/calendar" className="text-blue-600 hover:underline">Ver Calendario →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-3 text-blue-700">Importar desde MetaTrader</h2>
          <p className="mb-4">Importa tus operaciones directamente desde MetaTrader 5 sin ingreso manual.</p>
          <Link href="/import" className="text-blue-600 hover:underline">Importar Datos →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-3 text-blue-700">Operaciones Recientes</h2>
          <p className="mb-4">Acceso rápido a tus operaciones más recientes y su rendimiento.</p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">No hay operaciones recientes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
