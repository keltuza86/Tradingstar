"use client";

import { useState, useEffect } from "react";
import { getHotColdDays, getOperations } from "@/lib/database";

// Tipo para un día en el calendario
interface CalendarDay {
  date: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  performance?: number;
  type?: 'hot' | 'cold' | 'neutral';
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [hotColdDays, setHotColdDays] = useState<{date: string; performance: number; type: string}[]>([]);
  
  // Nombres de los meses en español
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  // Nombres de los días de la semana en español
  const weekdayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  useEffect(() => {
    // Obtener los días calientes y fríos
    const hotColdData = getHotColdDays();
    setHotColdDays(hotColdData);
    
    // Generar los días del calendario para el mes actual
    generateCalendarDays(currentDate);
  }, [currentDate]);

  // Función para generar los días del calendario
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Día de la semana del primer día (0 = Domingo, 6 = Sábado)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Días totales en el mes
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Días del mes anterior para completar la primera semana
    const daysFromPrevMonth = firstDayWeekday;
    
    // Último día del mes anterior
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    const days: CalendarDay[] = [];
    
    // Añadir días del mes anterior
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push({
        date: dateStr,
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false
      });
    }
    
    // Añadir días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push({
        date: dateStr,
        day,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Calcular cuántos días del siguiente mes necesitamos
    const daysNeeded = 42 - days.length; // 6 filas x 7 días = 42
    
    // Añadir días del siguiente mes
    for (let day = 1; day <= daysNeeded; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push({
        date: dateStr,
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false
      });
    }
    
    // Añadir información de rendimiento a los días
    const daysWithPerformance = days.map(day => {
      const hotColdDay = hotColdDays.find(hcd => hcd.date === day.date);
      
      if (hotColdDay) {
        return {
          ...day,
          performance: hotColdDay.performance,
          type: hotColdDay.type as 'hot' | 'cold'
        };
      }
      
      return {
        ...day,
        type: 'neutral'
      };
    });
    
    setCalendarDays(daysWithPerformance);
  };

  // Función para cambiar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Función para cambiar al mes siguiente
  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Función para cambiar al mes actual
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Calendario de Trading</h1>
        <p className="text-gray-600 mb-4">
          Visualiza los días "calientes" (buenos) y "fríos" (malos) para optimizar tus operaciones.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            &lt; Anterior
          </button>
          <h2 className="text-xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            Siguiente &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Días de la semana */}
          {weekdayNames.map(day => (
            <div key={day} className="text-center font-semibold p-2">
              {day}
            </div>
          ))}
          
          {/* Días del calendario */}
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              className={`
                p-2 h-24 border rounded-md relative
                ${!day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'}
                ${day.type === 'hot' ? 'border-green-500' : day.type === 'cold' ? 'border-red-500' : 'border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}`}>
                  {day.day}
                </span>
                {day.performance !== undefined && (
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${day.type === 'hot' ? 'bg-green-100 text-green-800' : day.type === 'cold' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {day.performance > 0 ? '+' : ''}{day.performance}
                  </span>
                )}
              </div>
              
              {/* Indicador visual de día caliente/frío */}
              {day.type !== 'neutral' && (
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1
                  ${day.type === 'hot' ? 'bg-green-500' : 'bg-red-500'}
                `}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center">
          <button 
            onClick={goToCurrentMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ir al Mes Actual
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Días Calientes (Buenos)</h3>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <p>Días con resultados positivos</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Estos días han mostrado un buen rendimiento en tus operaciones. Considera aumentar tu volumen en estos días.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Días Fríos (Malos)</h3>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <p>Días con resultados negativos</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Estos días han mostrado un rendimiento negativo. Considera reducir tu volumen o abstenerte de operar en estos días.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Estadísticas</h3>
          <div className="space-y-2">
            <p>Total de días operados: {hotColdDays.length}</p>
            <p>Días calientes: {hotColdDays.filter(d => d.type === 'hot').length}</p>
            <p>Días fríos: {hotColdDays.filter(d => d.type === 'cold').length}</p>
            <p>Ratio de días buenos: {Math.round((hotColdDays.filter(d => d.type === 'hot').length / hotColdDays.length) * 100)}%</p>
          </div>
        </div>
      </section>
    </div>
  );
}
