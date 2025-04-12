"use client";

import { useState } from "react";
import { Operation } from "@/lib/database";

export default function ImportMetaTrader() {
  const [file, setFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  // Procesar el archivo CSV de MetaTrader 5
  const processFile = () => {
    if (!file) {
      setError("Por favor selecciona un archivo para importar");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        
        // Verificar si el formato es correcto (MetaTrader 5 CSV)
        if (lines.length < 2) {
          throw new Error("El archivo está vacío o no tiene el formato correcto");
        }
        
        // Verificar encabezados
        const headers = lines[0].split(',');
        const requiredHeaders = ['Time', 'Symbol', 'Type', 'Volume', 'Price', 'S / L', 'T / P', 'Profit'];
        
        // Verificar si al menos algunos encabezados requeridos están presentes
        const hasRequiredHeaders = requiredHeaders.some(header => 
          headers.some(h => h.trim().includes(header))
        );
        
        if (!hasRequiredHeaders) {
          throw new Error("El archivo no parece ser una exportación de MetaTrader 5. Verifica el formato.");
        }
        
        // Procesar las líneas de datos
        const operations: Operation[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length < 8) continue;
          
          // Extraer datos según el formato de MT5
          // Nota: El formato exacto puede variar, esto es una aproximación
          const dateStr = values[0].trim();
          const symbol = values[1].trim();
          const type = values[2].trim().toLowerCase().includes('buy') ? 'compra' : 'venta';
          const volume = parseFloat(values[3].trim());
          const entryPrice = parseFloat(values[4].trim());
          
          // En MT5, el precio de salida no siempre está directamente disponible
          // A menudo se calcula a partir del precio de entrada y el beneficio
          const profit = parseFloat(values[7].trim());
          
          // Calcular precio de salida aproximado (esto es una simplificación)
          let exitPrice = entryPrice;
          if (type === 'compra' && profit !== 0) {
            exitPrice = entryPrice + (profit / volume);
          } else if (type === 'venta' && profit !== 0) {
            exitPrice = entryPrice - (profit / volume);
          }
          
          // Crear objeto de operación
          const operation: Operation = {
            date: new Date(dateStr).toISOString().split('T')[0],
            asset: symbol,
            operation_type: type,
            entry_price: entryPrice,
            exit_price: exitPrice,
            volume: volume,
            profit_loss: profit,
            created_at: new Date().toISOString()
          };
          
          operations.push(operation);
        }
        
        setImportedData(operations);
        setSuccess(`Se han importado ${operations.length} operaciones correctamente.`);
      } catch (err) {
        setError(`Error al procesar el archivo: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        setImportedData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Error al leer el archivo");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  // Guardar las operaciones importadas
  const saveImportedOperations = () => {
    // En una aplicación real, aquí enviaríamos los datos al servidor
    // Para esta demo, simplemente mostramos un mensaje de éxito
    setSuccess("Las operaciones han sido guardadas exitosamente en la base de datos.");
    
    // Resetear el estado
    setTimeout(() => {
      setFile(null);
      setImportedData([]);
      if (document.getElementById('file-input') instanceof HTMLInputElement) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Importar desde MetaTrader 5</h1>
        <p className="text-gray-600 mb-4">
          Importa tus operaciones directamente desde MetaTrader 5 sin necesidad de ingreso manual.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Seleccionar Archivo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV de MetaTrader 5
            </label>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Selecciona el archivo CSV exportado desde MetaTrader 5
            </p>
          </div>
          
          <div>
            <button
              onClick={processFile}
              disabled={!file || isLoading}
              className={`px-4 py-2 rounded-md ${
                !file || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Procesando...' : 'Procesar Archivo'}
            </button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
              {success}
            </div>
          )}
        </div>
      </section>

      {importedData.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Operaciones Importadas</h2>
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
                </tr>
              </thead>
              <tbody>
                {importedData.map((op, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <button
              onClick={saveImportedOperations}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Guardar Operaciones Importadas
            </button>
          </div>
        </section>
      )}

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Instrucciones para Exportar desde MetaTrader 5</h2>
        <div className="space-y-3">
          <p>Sigue estos pasos para exportar tus operaciones desde MetaTrader 5:</p>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>Abre tu plataforma MetaTrader 5</li>
            <li>Ve a la pestaña "Historial" en la ventana "Terminal" (Ctrl+T)</li>
            <li>Haz clic derecho en cualquier operación</li>
            <li>Selecciona "Informe" y luego "Detallado"</li>
            <li>Elige el período de tiempo que deseas exportar</li>
            <li>Haz clic en "Guardar como informe detallado (CSV)"</li>
            <li>Guarda el archivo en tu computadora</li>
            <li>Sube el archivo CSV usando el formulario de arriba</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
            <p className="font-semibold">Nota importante:</p>
            <p>El formato exacto del CSV puede variar según la versión de MetaTrader 5. Si tienes problemas con la importación, asegúrate de que el archivo contenga al menos las columnas: Fecha, Símbolo, Tipo, Volumen, Precio y Beneficio.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
