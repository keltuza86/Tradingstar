"use client";

import { useState, useEffect } from "react";
import { getOperations, getAssets, Operation, Asset } from "@/lib/database";
import Link from "next/link";

export default function Operations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newOperation, setNewOperation] = useState<Partial<Operation>>({
    date: new Date().toISOString().split('T')[0],
    asset: '',
    operation_type: 'compra',
    entry_price: 0,
    exit_price: 0,
    volume: 0.1,
    profit_loss: 0
  });
  
  useEffect(() => {
    // Cargar operaciones y activos
    setOperations(getOperations());
    setAssets(getAssets());
  }, []);

  // Calcular profit/loss automáticamente
  useEffect(() => {
    if (newOperation.entry_price && newOperation.exit_price && newOperation.volume) {
      let profitLoss = 0;
      
      if (newOperation.operation_type === 'compra') {
        profitLoss = (newOperation.exit_price - newOperation.entry_price) * newOperation.volume;
      } else {
        profitLoss = (newOperation.entry_price - newOperation.exit_price) * newOperation.volume;
      }
      
      setNewOperation({
        ...newOperation,
        profit_loss: Number(profitLoss.toFixed(2))
      });
    }
  }, [newOperation.entry_price, newOperation.exit_price, newOperation.volume, newOperation.operation_type]);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewOperation({
      ...newOperation,
      [name]: name === 'entry_price' || name === 'exit_price' || name === 'volume' 
        ? parseFloat(value) 
        : value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En una aplicación real, aquí enviaríamos los datos al servidor
    // Para esta demo, simplemente añadimos la operación al estado local
    const newOp: Operation = {
      id: operations.length + 1,
      date: newOperation.date || new Date().toISOString().split('T')[0],
      asset: newOperation.asset || '',
      operation_type: newOperation.operation_type || 'compra',
      entry_price: newOperation.entry_price || 0,
      exit_price: newOperation.exit_price || 0,
      volume: newOperation.volume || 0,
      profit_loss: newOperation.profit_loss || 0,
      created_at: new Date().toISOString()
    };
    
    setOperations([newOp, ...operations]);
    
    // Resetear el formulario
    setNewOperation({
      date: new Date().toISOString().split('T')[0],
      asset: '',
      operation_type: 'compra',
      entry_price: 0,
      exit_price: 0,
      volume: 0.1,
      profit_loss: 0
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Registro de Operaciones</h1>
        <p className="text-gray-600 mb-4">
          Registra y gestiona todas tus operaciones de trading en un solo lugar.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Registrar Nueva Operación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={newOperation.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activo
              </label>
              <select
                name="asset"
                value={newOperation.asset}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecciona un activo</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.symbol}>
                    {asset.symbol} - {asset.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Operación
              </label>
              <select
                name="operation_type"
                value={newOperation.operation_type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="compra">Compra</option>
                <option value="venta">Venta</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Entrada
              </label>
              <input
                type="number"
                name="entry_price"
                value={newOperation.entry_price}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Salida
              </label>
              <input
                type="number"
                name="exit_price"
                value={newOperation.exit_price}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volumen
              </label>
              <input
                type="number"
                name="volume"
                value={newOperation.volume}
                onChange={handleInputChange}
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beneficio/Pérdida
              </label>
              <input
                type="number"
                name="profit_loss"
                value={newOperation.profit_loss}
                readOnly
                className={`w-full p-2 border rounded-md ${
                  newOperation.profit_loss > 0 
                    ? 'border-green-300 bg-green-50 text-green-700' 
                    : newOperation.profit_loss < 0 
                      ? 'border-red-300 bg-red-50 text-red-700' 
                      : 'border-gray-300'
                }`}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar Operación
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Historial de Operaciones</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Activo</th>
                <th className="py-3 px-4 text-left">Tipo</th>
                <th className="py-3 px-4 text-right">Precio Entrada</th>
                <th className="py-3 px-4 text-right">Precio Salida</th>
                <th className="py-3 px-4 text-right">Volumen</th>
                <th className="py-3 px-4 text-right">Beneficio/Pérdida</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {operations.map(op => (
                <tr key={op.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{op.date}</td>
                  <td className="py-3 px-4">{op.asset}</td>
                  <td className="py-3 px-4 capitalize">{op.operation_type}</td>
                  <td className="py-3 px-4 text-right">{op.entry_price.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right">{op.exit_price.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right">{op.volume}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    op.profit_loss > 0 ? 'text-green-600' : op.profit_loss < 0 ? 'text-red-600' : ''
                  }`}>
                    {op.profit_loss > 0 ? '+' : ''}{op.profit_loss.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link 
                      href={`/trading-journal?operation=${op.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Añadir al diario
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
