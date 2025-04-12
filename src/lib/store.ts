"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Operation, 
  JournalEntry, 
  Asset, 
  sampleOperations, 
  sampleJournalEntries, 
  sampleAssets 
} from './database';

// Definir el tipo del estado global
interface TradingState {
  operations: Operation[];
  journalEntries: JournalEntry[];
  assets: Asset[];
  lastUpdated: string;
  
  // Acciones para modificar el estado
  addOperation: (operation: Operation) => void;
  updateOperation: (id: number, operation: Partial<Operation>) => void;
  deleteOperation: (id: number) => void;
  
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: number, entry: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: number) => void;
  
  importOperations: (operations: Operation[]) => void;
  
  // Estadísticas calculadas
  getTradeStats: () => {
    totalOperations: number;
    winningOperations: number;
    losingOperations: number;
    winRate: number;
    totalProfit: number;
    avgWinning: number;
    avgLosing: number;
    bestTrade: number;
    worstTrade: number;
  };
  
  getPerformanceByDay: () => {
    labels: string[];
    performance: number[];
    count: number[];
  };
  
  getPerformanceByAsset: () => {
    labels: string[];
    performance: number[];
    count: number[];
  };
  
  getHotColdDays: () => {
    date: string;
    performance: number;
    type: string;
  }[];
}

// Crear el store con persistencia
export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      operations: sampleOperations,
      journalEntries: sampleJournalEntries,
      assets: sampleAssets,
      lastUpdated: new Date().toISOString(),
      
      // Acciones para modificar el estado
      addOperation: (operation: Operation) => {
        set(state => {
          const newId = Math.max(0, ...state.operations.map(op => op.id || 0)) + 1;
          const newOperation = {
            ...operation,
            id: operation.id || newId,
            created_at: operation.created_at || new Date().toISOString()
          };
          return {
            operations: [newOperation, ...state.operations],
            lastUpdated: new Date().toISOString()
          };
        });
      },
      
      updateOperation: (id: number, operation: Partial<Operation>) => {
        set(state => ({
          operations: state.operations.map(op => 
            op.id === id ? { ...op, ...operation } : op
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteOperation: (id: number) => {
        set(state => ({
          operations: state.operations.filter(op => op.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      addJournalEntry: (entry: JournalEntry) => {
        set(state => {
          const newId = Math.max(0, ...state.journalEntries.map(e => e.id || 0)) + 1;
          const newEntry = {
            ...entry,
            id: entry.id || newId,
            created_at: entry.created_at || new Date().toISOString()
          };
          return {
            journalEntries: [newEntry, ...state.journalEntries],
            lastUpdated: new Date().toISOString()
          };
        });
      },
      
      updateJournalEntry: (id: number, entry: Partial<JournalEntry>) => {
        set(state => ({
          journalEntries: state.journalEntries.map(e => 
            e.id === id ? { ...e, ...entry } : e
          ),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      deleteJournalEntry: (id: number) => {
        set(state => ({
          journalEntries: state.journalEntries.filter(e => e.id !== id),
          lastUpdated: new Date().toISOString()
        }));
      },
      
      importOperations: (operations: Operation[]) => {
        set(state => {
          // Asignar IDs únicos a las operaciones importadas
          let maxId = Math.max(0, ...state.operations.map(op => op.id || 0));
          const newOperations = operations.map(op => ({
            ...op,
            id: ++maxId,
            created_at: op.created_at || new Date().toISOString()
          }));
          
          return {
            operations: [...newOperations, ...state.operations],
            lastUpdated: new Date().toISOString()
          };
        });
      },
      
      // Estadísticas calculadas
      getTradeStats: () => {
        const operations = get().operations;
        
        const totalOperations = operations.length;
        const winningOperations = operations.filter(op => op.profit_loss > 0).length;
        const losingOperations = operations.filter(op => op.profit_loss < 0).length;
        const winRate = totalOperations > 0 ? (winningOperations / totalOperations) * 100 : 0;
        
        const totalProfit = operations.reduce((sum, op) => sum + op.profit_loss, 0);
        const avgWinning = operations.filter(op => op.profit_loss > 0).reduce((sum, op) => sum + op.profit_loss, 0) / winningOperations || 0;
        const avgLosing = operations.filter(op => op.profit_loss < 0).reduce((sum, op) => sum + op.profit_loss, 0) / losingOperations || 0;
        
        const bestTrade = operations.length > 0 ? Math.max(...operations.map(op => op.profit_loss)) : 0;
        const worstTrade = operations.length > 0 ? Math.min(...operations.map(op => op.profit_loss)) : 0;
        
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
      },
      
      getPerformanceByDay: () => {
        const operations = get().operations;
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
      },
      
      getPerformanceByAsset: () => {
        const operations = get().operations;
        const assets = get().assets;
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
      },
      
      getHotColdDays: () => {
        const operations = get().operations;
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
    }),
    {
      name: 'trading-storage', // nombre para localStorage
    }
  )
);
