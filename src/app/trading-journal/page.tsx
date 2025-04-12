"use client";

import { useState, useEffect } from "react";
import { getJournalEntries, getOperations, JournalEntry, Operation } from "@/lib/database";
import Link from "next/link";

export default function TradingJournal() {
  const [journalEntries, setJournalEntries] = useState<(JournalEntry & { operation: Operation })[]>([]);
  const [emotionalStates] = useState([
    "Calmado", "Ansioso", "Confiado", "Temeroso", "Impaciente", 
    "Frustrado", "Eufórico", "Indeciso", "Otro"
  ]);
  
  useEffect(() => {
    // Obtener entradas del diario y operaciones
    const entries = getJournalEntries();
    const operations = getOperations();
    
    // Combinar entradas del diario con sus operaciones correspondientes
    const entriesWithOperations = entries.map(entry => {
      const operation = operations.find(op => op.id === entry.operation_id);
      return {
        ...entry,
        operation: operation!
      };
    });
    
    setJournalEntries(entriesWithOperations);
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Diario de Trading - Análisis Psicológico</h1>
        <p className="text-gray-600 mb-4">
          Este diario te ayudará a analizar el componente psicológico de tus operaciones de trading.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Registrar Nueva Entrada</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operación
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Selecciona una operación</option>
                {getOperations().map(op => (
                  <option key={op.id} value={op.id}>
                    {op.date} - {op.asset} - {op.operation_type} - {op.profit_loss > 0 ? '+' : ''}{op.profit_loss}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Emocional
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Selecciona un estado</option>
                {emotionalStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción / Errores
            </label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              placeholder="Describe cualquier error cometido o situación relevante..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aspectos a Mejorar
            </label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              placeholder="Anota qué podrías hacer diferente la próxima vez..."
            ></textarea>
          </div>
          <div>
            <button 
              type="button" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar Entrada
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Entradas Recientes</h2>
        <div className="space-y-4">
          {journalEntries.length > 0 ? (
            journalEntries.map(entry => (
              <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      {entry.operation.date} - {entry.operation.asset} - {entry.operation.operation_type}
                    </h3>
                    <p className={`text-sm font-medium ${entry.operation.profit_loss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Resultado: {entry.operation.profit_loss > 0 ? '+' : ''}{entry.operation.profit_loss}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    entry.emotional_state === 'Calmado' || entry.emotional_state === 'Confiado' 
                      ? 'bg-green-100 text-green-800' 
                      : entry.emotional_state === 'Ansioso' || entry.emotional_state === 'Temeroso' || entry.emotional_state === 'Frustrado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {entry.emotional_state}
                  </span>
                </div>
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripción / Errores:</h4>
                  <p className="text-gray-600">{entry.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Aspectos a Mejorar:</h4>
                  <p className="text-gray-600">{entry.improvements}</p>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Registrado: {new Date(entry.created_at || '').toLocaleString('es-ES')}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No hay entradas en el diario todavía.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Instrucciones</h2>
        <div className="space-y-2">
          <p>Este diario te ayudará a analizar el componente psicológico de tus operaciones de trading.</p>
          <p>Completa una entrada después de cada operación o al final del día de trading.</p>
          <p>En "Estado Emocional" selecciona cómo te sentías durante la operación.</p>
          <p>En "Descripción/Errores" describe cualquier error cometido o situación relevante.</p>
          <p>En "Aspectos a Mejorar" anota qué podrías hacer diferente la próxima vez.</p>
        </div>
      </section>
    </div>
  );
}
