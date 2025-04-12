"use client";

import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  // Datos de ejemplo para las gráficas
  const [operationsData] = useState({
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    datasets: [
      {
        label: "Rendimiento por día",
        data: [120, -50, 200, -80, 150],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const [assetsData] = useState({
    labels: ["EURUSD", "GBPUSD", "BTCUSD", "XAUUSD", "SPX500"],
    datasets: [
      {
        label: "Rendimiento por activo",
        data: [300, 150, -200, 100, -50],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const [resultData] = useState({
    labels: ["Operaciones Ganadoras", "Operaciones Perdedoras"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>
        <p className="text-gray-600 mb-4">
          Última actualización: {new Date().toLocaleString("es-ES")}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-700">Total Operaciones</h3>
          <p className="text-3xl font-bold">42</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-700">Operaciones Ganadoras</h3>
          <p className="text-3xl font-bold text-green-600">27</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-700">Operaciones Perdedoras</h3>
          <p className="text-3xl font-bold text-red-600">15</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-700">Ratio de Ganancia</h3>
          <p className="text-3xl font-bold text-blue-600">64.3%</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Rendimiento por Día</h2>
          <div className="h-80">
            <Bar data={operationsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Rendimiento por Activo</h2>
          <div className="h-80">
            <Bar data={assetsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Distribución de Resultados</h2>
          <div className="h-80 flex items-center justify-center">
            <div className="w-64">
              <Pie data={resultData} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resumen de Rendimiento</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Beneficio Total:</span>
              <span className="text-green-600 font-bold">$1,250.75</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Beneficio Promedio:</span>
              <span className="text-green-600 font-bold">$46.32</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Pérdida Promedio:</span>
              <span className="text-red-600 font-bold">-$28.15</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Mejor Operación:</span>
              <span className="text-green-600 font-bold">$215.50</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Peor Operación:</span>
              <span className="text-red-600 font-bold">-$120.30</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
