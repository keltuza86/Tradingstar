// Funciones para interactuar con la base de datos

// Tipo para operaciones
export interface Operation {
  id?: number;
  date: string;
  asset: string;
  operation_type: string;
  entry_price: number;
  exit_price: number;
  volume: number;
  profit_loss: number;
  created_at?: string;
}

// Tipo para entradas del diario
export interface JournalEntry {
  id?: number;
  operation_id: number;
  emotional_state: string;
  description: string;
  improvements: string;
  created_at?: string;
}

// Tipo para activos
export interface Asset {
  id?: number;
  symbol: string;
  name: string;
  type: string;
}

// Datos de ejemplo para operaciones (simulando datos de la base de datos)
export const sampleOperations: Operation[] = [
  {
    id: 1,
    date: '2025-04-01',
    asset: 'EURUSD',
    operation_type: 'compra',
    entry_price: 1.0750,
    exit_price: 1.0780,
    volume: 0.1,
    profit_loss: 30.0,
    created_at: '2025-04-01T10:30:00'
  },
  {
    id: 2,
    date: '2025-04-02',
    asset: 'GBPUSD',
    operation_type: 'venta',
    entry_price: 1.2650,
    exit_price: 1.2620,
    volume: 0.1,
    profit_loss: 30.0,
    created_at: '2025-04-02T14:15:00'
  },
  {
    id: 3,
    date: '2025-04-03',
    asset: 'BTCUSD',
    operation_type: 'compra',
    entry_price: 65000,
    exit_price: 64500,
    volume: 0.01,
    profit_loss: -5.0,
    created_at: '2025-04-03T09:45:00'
  },
  {
    id: 4,
    date: '2025-04-04',
    asset: 'XAUUSD',
    operation_type: 'compra',
    entry_price: 2300,
    exit_price: 2320,
    volume: 0.05,
    profit_loss: 100.0,
    created_at: '2025-04-04T11:20:00'
  },
  {
    id: 5,
    date: '2025-04-05',
    asset: 'EURUSD',
    operation_type: 'venta',
    entry_price: 1.0780,
    exit_price: 1.0800,
    volume: 0.1,
    profit_loss: -20.0,
    created_at: '2025-04-05T15:30:00'
  },
  {
    id: 6,
    date: '2025-04-08',
    asset: 'SPX500',
    operation_type: 'compra',
    entry_price: 5200,
    exit_price: 5250,
    volume: 0.02,
    profit_loss: 100.0,
    created_at: '2025-04-08T10:00:00'
  },
  {
    id: 7,
    date: '2025-04-09',
    asset: 'USDJPY',
    operation_type: 'venta',
    entry_price: 151.50,
    exit_price: 151.20,
    volume: 0.1,
    profit_loss: 30.0,
    created_at: '2025-04-09T13:45:00'
  },
  {
    id: 8,
    date: '2025-04-10',
    asset: 'ETHUSD',
    operation_type: 'compra',
    entry_price: 3500,
    exit_price: 3550,
    volume: 0.05,
    profit_loss: 2.5,
    created_at: '2025-04-10T16:20:00'
  },
  {
    id: 9,
    date: '2025-04-11',
    asset: 'NASDAQ',
    operation_type: 'venta',
    entry_price: 18200,
    exit_price: 18150,
    volume: 0.01,
    profit_loss: 50.0,
    created_at: '2025-04-11T09:30:00'
  },
  {
    id: 10,
    date: '2025-04-12',
    asset: 'AUDUSD',
    operation_type: 'compra',
    entry_price: 0.6650,
    exit_price: 0.6630,
    volume: 0.2,
    profit_loss: -40.0,
    created_at: '2025-04-12T11:15:00'
  }
];

// Datos de ejemplo para el diario de trading
export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 1,
    operation_id: 1,
    emotional_state: 'Calmado',
    description: 'Seguí el plan de trading correctamente',
    improvements: 'Mantener la disciplina',
    created_at: '2025-04-01T18:30:00'
  },
  {
    id: 2,
    operation_id: 3,
    emotional_state: 'Ansioso',
    description: 'Entré precipitadamente sin confirmar la tendencia',
    improvements: 'Esperar confirmación antes de entrar',
    created_at: '2025-04-03T17:45:00'
  },
  {
    id: 3,
    operation_id: 5,
    emotional_state: 'Frustrado',
    description: 'Cerré la operación demasiado pronto por miedo',
    improvements: 'Trabajar en la paciencia y confianza',
    created_at: '2025-04-05T19:20:00'
  },
  {
    id: 4,
    operation_id: 10,
    emotional_state: 'Impaciente',
    description: 'No esperé la señal de entrada correcta',
    improvements: 'Seguir estrictamente las reglas de entrada',
    created_at: '2025-04-12T18:00:00'
  }
];

// Datos de ejemplo para activos
export const sampleAssets: Asset[] = [
  { id: 1, symbol: 'EURUSD', name: 'Euro/Dólar', type: 'forex' },
  { id: 2, symbol: 'GBPUSD', name: 'Libra/Dólar', type: 'forex' },
  { id: 3, symbol: 'USDJPY', name: 'Dólar/Yen', type: 'forex' },
  { id: 4, symbol: 'AUDUSD', name: 'Dólar Australiano/Dólar', type: 'forex' },
  { id: 5, symbol: 'USDCAD', name: 'Dólar/Dólar Canadiense', type: 'forex' },
  { id: 6, symbol: 'BTCUSD', name: 'Bitcoin/Dólar', type: 'crypto' },
  { id: 7, symbol: 'ETHUSD', name: 'Ethereum/Dólar', type: 'crypto' },
  { id: 8, symbol: 'XAUUSD', name: 'Oro/Dólar', type: 'commodity' },
  { id: 9, symbol: 'SPX500', name: 'S&P 500', type: 'index' },
  { id: 10, symbol: 'NASDAQ', name: 'NASDAQ', type: 'index' }
];

// Función para obtener todas las operaciones
export function getOperations(): Operation[] {
  return sampleOperations;
}

// Función para obtener una operación por ID
export function getOperationById(id: number): Operation | undefined {
  return sampleOperations.find(op => op.id === id);
}

// Función para obtener entradas del diario
export function getJournalEntries(): JournalEntry[] {
  return sampleJournalEntries;
}

// Función para obtener una entrada del diario por ID de operación
export function getJournalEntryByOperationId(operationId: number): JournalEntry | undefined {
  return sampleJournalEntries.find(entry => entry.operation_id === operationId);
}

// Función para obtener todos los activos
export function getAssets(): Asset[] {
  return sampleAssets;
}

// Función para calcular estadísticas de trading
export function getTradeStats() {
  const operations = getOperations();
  
  const totalOperations = operations.length;
  const winningOperations = operations.filter(op => op.profit_loss > 0).length;
  const losingOperations = operations.filter(op => op.profit_loss < 0).length;
  const winRate = totalOperations > 0 ? (winningOperations / totalOperations) * 100 : 0;
  
  const totalProfit = operations.reduce((sum, op) => sum + op.profit_loss, 0);
  const avgWinning = operations.filter(op => op.profit_loss > 0).reduce((sum, op) => sum + op.profit_loss, 0) / winningOperations || 0;
  const avgLosing = operations.filter(op => op.profit_loss < 0).reduce((sum, op) => sum + op.profit_loss, 0) / losingOperations || 0;
  
  const bestTrade = Math.max(...operations.map(op => op.profit_loss));
  const worstTrade = Math.min(...operations.map(op => op.profit_loss));
  
  return {
    totalOperations,
    winningOperations,
    losingOperations,
    winRate,
    totalProfit,
    avgWinning,
    avgLosing,
    bestTrade,
    worstTrade
  };
}

// Función para calcular rendimiento por día de la semana
export function getPerformanceByDay() {
  const operations = getOperations();
  const dayPerformance = [0, 0, 0, 0, 0, 0, 0]; // Domingo a Sábado
  const dayCount = [0, 0, 0, 0, 0, 0, 0];
  
  operations.forEach(op => {
    const date = new Date(op.date);
    const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
    dayPerformance[dayOfWeek] += op.profit_loss;
    dayCount[dayOfWeek]++;
  });
  
  return {
    labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    performance: dayPerformance,
    count: dayCount
  };
}

// Función para calcular rendimiento por activo
export function getPerformanceByAsset() {
  const operations = getOperations();
  const assets = getAssets();
  const assetPerformance: Record<string, number> = {};
  const assetCount: Record<string, number> = {};
  
  assets.forEach(asset => {
    assetPerformance[asset.symbol] = 0;
    assetCount[asset.symbol] = 0;
  });
  
  operations.forEach(op => {
    if (assetPerformance[op.asset] !== undefined) {
      assetPerformance[op.asset] += op.profit_loss;
      assetCount[op.asset]++;
    }
  });
  
  return {
    labels: Object.keys(assetPerformance),
    performance: Object.values(assetPerformance),
    count: Object.values(assetCount)
  };
}

// Función para calcular días "calientes" y "fríos" para el calendario
export function getHotColdDays() {
  const operations = getOperations();
  const dayPerformance: Record<string, number> = {};
  
  operations.forEach(op => {
    if (dayPerformance[op.date]) {
      dayPerformance[op.date] += op.profit_loss;
    } else {
      dayPerformance[op.date] = op.profit_loss;
    }
  });
  
  const hotColdDays = Object.entries(dayPerformance).map(([date, performance]) => ({
    date,
    performance,
    type: performance > 0 ? 'hot' : 'cold'
  }));
  
  return hotColdDays;
}
