'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, RotateCcw, CheckCircle2, XCircle, Trophy, Lightbulb, AlertTriangle, User, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

type TipoPalabra = 'sustantivo' | 'adjetivo' | 'verbo';

interface RankingEntry {
  nombre: string;
  puntuacion: number;
  aciertos: number;
  dificultad: number;
  fecha: string;
}

interface PalabraInfo {
  palabra: string;
  tipo: TipoPalabra;
}

const palabrasOriginales: PalabraInfo[] = [
  // Sustantivos
  { palabra: 'casa', tipo: 'sustantivo' },
  { palabra: 'maestra', tipo: 'sustantivo' },
  { palabra: 'montaña', tipo: 'sustantivo' },
  { palabra: 'libro', tipo: 'sustantivo' },
  { palabra: 'ordenador', tipo: 'sustantivo' },
  { palabra: 'perro', tipo: 'sustantivo' },
  { palabra: 'ciudad', tipo: 'sustantivo' },
  { palabra: 'coche', tipo: 'sustantivo' },
  { palabra: 'ardilla', tipo: 'sustantivo' },
  { palabra: 'teléfono', tipo: 'sustantivo' },
  { palabra: 'escuela', tipo: 'sustantivo' },
  { palabra: 'parque', tipo: 'sustantivo' },
  { palabra: 'guitarra', tipo: 'sustantivo' },
  { palabra: 'playa', tipo: 'sustantivo' },
  { palabra: 'reloj', tipo: 'sustantivo' },
  { palabra: 'mesa', tipo: 'sustantivo' },
  { palabra: 'ventana', tipo: 'sustantivo' },
  { palabra: 'puerta', tipo: 'sustantivo' },
  { palabra: 'gato', tipo: 'sustantivo' },
  { palabra: 'camino', tipo: 'sustantivo' },
  { palabra: 'pájaro', tipo: 'sustantivo' },
  { palabra: 'zapato', tipo: 'sustantivo' },
  { palabra: 'nube', tipo: 'sustantivo' },
  { palabra: 'luna', tipo: 'sustantivo' },
  { palabra: 'río', tipo: 'sustantivo' },
  { palabra: 'flor', tipo: 'sustantivo' },
  { palabra: 'amigo', tipo: 'sustantivo' },
  { palabra: 'tren', tipo: 'sustantivo' },
  // Adjetivos
  { palabra: 'verde', tipo: 'adjetivo' },
  { palabra: 'rápido', tipo: 'adjetivo' },
  { palabra: 'amable', tipo: 'adjetivo' },
  { palabra: 'pequeño', tipo: 'adjetivo' },
  { palabra: 'brillante', tipo: 'adjetivo' },
  { palabra: 'inteligente', tipo: 'adjetivo' },
  { palabra: 'divertido', tipo: 'adjetivo' },
  { palabra: 'grande', tipo: 'adjetivo' },
  { palabra: 'rojo', tipo: 'adjetivo' },
  { palabra: 'lento', tipo: 'adjetivo' },
  { palabra: 'simpático', tipo: 'adjetivo' },
  { palabra: 'oscuro', tipo: 'adjetivo' },
  { palabra: 'feliz', tipo: 'adjetivo' },
  { palabra: 'triste', tipo: 'adjetivo' },
  { palabra: 'fuerte', tipo: 'adjetivo' },
  { palabra: 'suave', tipo: 'adjetivo' },
  { palabra: 'duro', tipo: 'adjetivo' },
  { palabra: 'caliente', tipo: 'adjetivo' },
  { palabra: 'frío', tipo: 'adjetivo' },
  { palabra: 'limpio', tipo: 'adjetivo' },
  { palabra: 'sucio', tipo: 'adjetivo' },
  { palabra: 'nuevo', tipo: 'adjetivo' },
  { palabra: 'viejo', tipo: 'adjetivo' },
  { palabra: 'bonito', tipo: 'adjetivo' },
  { palabra: 'feo', tipo: 'adjetivo' },
  { palabra: 'claro', tipo: 'adjetivo' },
  // Verbos
  { palabra: 'correr', tipo: 'verbo' },
  { palabra: 'estudiar', tipo: 'verbo' },
  { palabra: 'dibujar', tipo: 'verbo' },
  { palabra: 'comer', tipo: 'verbo' },
  { palabra: 'pensar', tipo: 'verbo' },
  { palabra: 'jugar', tipo: 'verbo' },
  { palabra: 'saltar', tipo: 'verbo' },
  { palabra: 'leer', tipo: 'verbo' },
  { palabra: 'escribir', tipo: 'verbo' },
  { palabra: 'hablar', tipo: 'verbo' },
  { palabra: 'escuchar', tipo: 'verbo' },
  { palabra: 'dormir', tipo: 'verbo' },
  { palabra: 'cantar', tipo: 'verbo' },
  { palabra: 'bailar', tipo: 'verbo' },
  { palabra: 'nadar', tipo: 'verbo' },
  { palabra: 'viajar', tipo: 'verbo' },
  { palabra: 'trabajar', tipo: 'verbo' },
  { palabra: 'comprar', tipo: 'verbo' },
  { palabra: 'vender', tipo: 'verbo' },
  { palabra: 'reír', tipo: 'verbo' },
  { palabra: 'llorar', tipo: 'verbo' },
  { palabra: 'mirar', tipo: 'verbo' },
  { palabra: 'buscar', tipo: 'verbo' },
  { palabra: 'encontrar', tipo: 'verbo' },
  { palabra: 'perder', tipo: 'verbo' },
];

function barajarPalabras(array: PalabraInfo[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function GamePage() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [minutosSeleccionados, setMinutosSeleccionados] = useState<number>(3);
  const [dificultad, setDificultad] = useState<1 | 2 | 3>(1);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0);
  const [tiempoPalabra, setTiempoPalabra] = useState<number | null>(null);
  
  const [playerName, setPlayerName] = useState('');
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const guardadoRef = useRef(false);

  const [palabras, setPalabras] = useState<PalabraInfo[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState(0);
  
  const [feedback, setFeedback] = useState<{ visible: boolean; isCorrect: boolean; mensaje: string }>({
    visible: false,
    isCorrect: false,
    mensaje: '',
  });

  const [botonesDeshabilitados, setBotonesDeshabilitados] = useState(false);

  useEffect(() => {
    try {
      const storedRanking = localStorage.getItem('rankingPalabras');
      if (storedRanking) {
        setRanking(JSON.parse(storedRanking));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      guardadoRef.current = false;
    }
    if (gameState === 'finished' && !guardadoRef.current && playerName.trim() !== '') {
      guardadoRef.current = true;
      const nuevaPuntuacion = Math.max(0, (aciertos * 10 * dificultad) - (errores * 5));
      const nuevoEntry: RankingEntry = {
        nombre: playerName.trim(),
        puntuacion: nuevaPuntuacion,
        aciertos,
        dificultad,
        fecha: new Date().toLocaleDateString()
      };
      
      setRanking((prev) => {
        const nuevoRanking = [...prev, nuevoEntry]
          .sort((a, b) => b.puntuacion - a.puntuacion)
          .slice(0, 10);
        localStorage.setItem('rankingPalabras', JSON.stringify(nuevoRanking));
        return nuevoRanking;
      });
    }
  }, [gameState, playerName, aciertos, errores, dificultad]);

  const avanzarSiguientePalabra = () => {
    setFeedback({ visible: false, isCorrect: false, mensaje: '' });
    if (indiceActual + 1 < palabras.length) {
      setIndiceActual((prev) => prev + 1);
      setTiempoPalabra(dificultad > 1 ? 5 : null);
      setBotonesDeshabilitados(false);
      registrarPalabra(palabras[indiceActual + 1].palabra);
    } else {
      terminarJuego();
    }
  };

  const manejarTimeout = () => {
    if (botonesDeshabilitados) return;
    setBotonesDeshabilitados(true);
    setErrores((prev) => prev + 1);
    
    if (dificultad === 3) {
      setTiempoRestante((prev) => Math.max(0, prev - 10));
    }

    setFeedback({ 
      visible: true, 
      isCorrect: false, 
      mensaje: `¡Tiempo agotado!` 
    });

    setTimeout(() => {
      avanzarSiguientePalabra();
    }, 1200);
  };

  // Temporizador global
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gameState === 'playing' && tiempoRestante > 0) {
      timerId = setTimeout(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (gameState === 'playing' && tiempoRestante <= 0) {
      terminarJuego();
    }
    return () => clearTimeout(timerId);
  }, [gameState, tiempoRestante]);

  // Temporizador de cada palabra
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (gameState === 'playing' && dificultad > 1 && tiempoPalabra !== null && tiempoPalabra > 0 && !botonesDeshabilitados) {
      timerId = setTimeout(() => {
        setTiempoPalabra(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (gameState === 'playing' && dificultad > 1 && tiempoPalabra === 0 && !botonesDeshabilitados) {
      manejarTimeout();
    }
    return () => clearTimeout(timerId);
  }, [gameState, dificultad, tiempoPalabra, botonesDeshabilitados]);

  const registrarPalabra = (palabra: string) => {
    try {
      const historialGuardado = localStorage.getItem('historialPalabras');
      let historial: string[] = historialGuardado ? JSON.parse(historialGuardado) : [];
      if (!historial.includes(palabra)) {
        historial.push(palabra);
        // Si hay más de 70 en el historial, eliminamos las más antiguas
        if (historial.length > 70) {
          historial = historial.slice(historial.length - 70);
        }
        localStorage.setItem('historialPalabras', JSON.stringify(historial));
      }
    } catch (e) {
      console.error('Error usando localStorage', e);
    }
  };

  const iniciarJuego = () => {
    let historial: string[] = [];
    try {
      const historialGuardado = localStorage.getItem('historialPalabras');
      if (historialGuardado) historial = JSON.parse(historialGuardado);
    } catch (e) {
      console.error(e);
    }

    let disponibles = palabrasOriginales.filter(p => !historial.includes(p.palabra));

    // Si nos quedan pocas palabras (ej. la reserva se acabó), vaciamos el historial parcialmente
    if (disponibles.length < 20) {
      historial = historial.slice(historial.length - 30); // nos quedamos solo con las 30 más recientes
      localStorage.setItem('historialPalabras', JSON.stringify(historial));
      disponibles = palabrasOriginales.filter(p => !historial.includes(p.palabra));
    }

    // Seleccionamos un número de palabras para la partida
    const barajadas = barajarPalabras(disponibles);
    
    setPalabras(barajadas);
    setIndiceActual(0);
    setAciertos(0);
    setErrores(0);
    setTiempoRestante(minutosSeleccionados * 60);
    setTiempoPalabra(dificultad > 1 ? 5 : null);
    setGameState('playing');
    setFeedback({ visible: false, isCorrect: false, mensaje: '' });
    setBotonesDeshabilitados(false);
    
    if (barajadas.length > 0) {
      registrarPalabra(barajadas[0].palabra);
    }
  };

  const terminarJuego = () => {
    setGameState('finished');
  };

  const manejarRespuesta = (tipoSeleccionado: TipoPalabra) => {
    if (botonesDeshabilitados) return;
    
    setBotonesDeshabilitados(true);
    const palabraActualObj = palabras[indiceActual];
    const esCorrecto = tipoSeleccionado === palabraActualObj.tipo;

    if (esCorrecto) {
      setAciertos((prev) => prev + 1);
      setFeedback({ visible: true, isCorrect: true, mensaje: '¡Correcto! Sigue así.' });
    } else {
      setErrores((prev) => prev + 1);
      if (dificultad === 3) {
        setTiempoRestante((prev) => Math.max(0, prev - 10));
      }
      setFeedback({ 
        visible: true, 
        isCorrect: false, 
        mensaje: `¡Error! La respuesta correcta era: ${palabraActualObj.tipo.toUpperCase()}.` 
      });
    }

    // Wait a moment then show next word
    setTimeout(() => {
      avanzarSiguientePalabra();
    }, 1200);
  };

  const formatoTiempo = (segundosTotales: number) => {
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  const getResultadoFinal = () => {
    if (errores <= 2) {
      return { msg: "🏆 ERES EL CRACK DE LA METALINGÜÍSTICA 🏆", color: "bg-green-100 text-green-800 border-green-200", icon: <Trophy className="w-12 h-12 text-yellow-500 mb-4 mx-auto" /> };
    } else if (errores >= 3 && errores <= 5) {
      return { msg: "💡 NO ESTÁ MAL, PERO MEJORABLE 💡", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Lightbulb className="w-12 h-12 text-yellow-600 mb-4 mx-auto" /> };
    } else {
      return { msg: "📚 HAY QUE REPASAR UN POQUITO. ESTÁS VERDECITO 🐸", color: "bg-red-100 text-red-800 border-red-200", icon: <AlertTriangle className="w-12 h-12 text-red-500 mb-4 mx-auto" /> };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
        {/* Header Decorativo */}
        <div className="h-4 w-full bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 absolute top-0 left-0" />
        
        <div className="p-8 sm:p-12">
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight leading-tight">
              Clasificación de Palabras
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-lg">Sustantivos, Adjetivos y Verbos</p>
          </header>

          <AnimatePresence mode="wait">
            {gameState === 'setup' && (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-100 w-full"
              >
                <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
                  <label htmlFor="player-name" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Tu Nombre:
                  </label>
                  <input
                    id="player-name"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Escribe tu nombre..."
                    maxLength={20}
                    className="w-full p-3 text-lg font-bold text-center bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <label htmlFor="tiempo-selector" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Elige el tiempo (minutos):
                  </label>
                  <select
                    id="tiempo-selector"
                    value={minutosSeleccionados}
                    onChange={(e) => setMinutosSeleccionados(Number(e.target.value))}
                    className="w-32 p-3 text-lg font-bold text-center bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all cursor-pointer"
                  >
                    <option value={1}>1 min</option>
                    <option value={2}>2 min</option>
                    <option value={3}>3 min</option>
                  </select>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-blue-500" />
                    Elige la dificultad:
                  </label>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setDificultad(1)}
                      className={cn("px-6 py-3 rounded-xl font-bold text-lg transition-all", dificultad === 1 ? "bg-blue-600 text-white shadow-md scale-105" : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300")}
                    >
                      Nivel 1
                    </button>
                    <button
                      onClick={() => setDificultad(2)}
                      className={cn("px-6 py-3 rounded-xl font-bold text-lg transition-all", dificultad === 2 ? "bg-blue-600 text-white shadow-md scale-105" : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300")}
                    >
                      Nivel 2
                    </button>
                    <button
                      onClick={() => setDificultad(3)}
                      className={cn("px-6 py-3 rounded-xl font-bold text-lg transition-all", dificultad === 3 ? "bg-blue-600 text-white shadow-md scale-105" : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300")}
                    >
                      Nivel 3
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dificultad}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm text-slate-500 text-center max-w-sm h-12 flex justify-center items-center"
                    >
                      {dificultad === 1 && "Modo normal. Tómate tu tiempo para clasificar."}
                      {dificultad === 2 && "Modo rápido. Solo tienes 5 segundos por palabra."}
                      {dificultad === 3 && "Modo extremo. 5s por palabra, y los fallos te quitan 10s extras."}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <button
                  onClick={() => {
                    if (playerName.trim() === '') {
                        alert('Por favor, escribe tu nombre para empezar.');
                        return;
                    }
                    iniciarJuego();
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 font-bold text-white text-xl rounded-full overflow-hidden transition-transform active:scale-95 hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Iniciar Juego</span>
                  <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out" />
                </button>

                {ranking.length > 0 && (
                  <div className="w-full max-w-md mt-8 border-t border-slate-200 pt-8">
                    <h3 className="text-2xl font-black text-slate-800 text-center mb-6 flex items-center justify-center gap-2">
                      <ListOrdered className="w-6 h-6 text-blue-500" />
                      Mejores Puntuaciones
                    </h3>
                    <div className="space-y-3 w-full">
                      {ranking.map((r, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                              i === 0 ? "bg-yellow-100 text-yellow-700" : 
                              i === 1 ? "bg-slate-200 text-slate-700" :
                              i === 2 ? "bg-amber-100 text-amber-700" : "bg-slate-50 text-slate-500"
                            )}>{i + 1}</span>
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-slate-700">{r.nombre}</span>
                              <span className="text-xs text-slate-400">Nivel {r.dificultad} • {r.aciertos} aciertos</span>
                            </div>
                          </div>
                          <span className="font-black text-blue-600">{r.puntuacion} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div 
                key="playing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center w-full"
              >
                {/* Temporizador y Contadores */}
                <div className="w-full flex justify-between items-center mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className={cn(
                    "flex items-center gap-2 text-xl font-bold font-mono px-4 py-2 rounded-lg transition-colors",
                    tiempoRestante <= 30 ? "text-red-600 bg-red-100 animate-pulse" : "text-slate-700 bg-white"
                  )}>
                    <Clock className="w-6 h-6" />
                    {formatoTiempo(tiempoRestante)}
                  </div>
                  <div className="flex gap-4 text-sm font-semibold">
                    <div className="flex flex-col items-center p-2 px-4 rounded-lg bg-green-50 text-green-700 min-w-20">
                      <span>Aciertos</span>
                      <span className="text-xl">{aciertos}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 px-4 rounded-lg bg-red-50 text-red-700 min-w-20">
                      <span>Errores</span>
                      <span className="text-xl">{errores}</span>
                    </div>
                  </div>
                </div>

                {/* Palabra Actual */}
                <div className="relative w-full flex justify-center items-center h-48 mb-10 overflow-hidden rounded-3xl bg-blue-50 border-2 border-blue-100 shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={indiceActual}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                    >
                      <h2 className="text-4xl sm:text-6xl font-black text-blue-600 tracking-wider uppercase break-words leading-tight">
                        {palabras[indiceActual]?.palabra}
                      </h2>
                      {dificultad > 1 && tiempoPalabra !== null && (
                        <div className="mt-6 flex flex-col items-center w-full max-w-[200px]">
                           <div className="flex items-center gap-1 mb-2 text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                             <Clock className="w-4 h-4" /> 
                             {tiempoPalabra}s
                           </div>
                           <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-sm border border-slate-200">
                             <motion.div 
                               className={cn(
                                 "h-full rounded-full transition-colors",
                                 tiempoPalabra > 2 ? "bg-amber-400" : "bg-red-500"
                               )}
                               initial={{ width: '100%' }}
                               animate={{ width: `${(tiempoPalabra / 5) * 100}%` }}
                               transition={{ duration: 1, ease: 'linear' }}
                             />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Opciones de Tipos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
                  <button
                    onClick={() => manejarRespuesta('sustantivo')}
                    disabled={botonesDeshabilitados}
                    className="p-4 sm:p-6 text-xl font-bold rounded-2xl bg-amber-400 text-amber-950 hover:bg-amber-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-sm border border-amber-500/20 shadow-amber-200"
                  >
                    Sustantivo
                  </button>
                  <button
                    onClick={() => manejarRespuesta('adjetivo')}
                    disabled={botonesDeshabilitados}
                    className="p-4 sm:p-6 text-xl font-bold rounded-2xl bg-teal-500 text-teal-50 hover:bg-teal-400 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-sm border border-teal-600/20 shadow-teal-200"
                  >
                    Adjetivo
                  </button>
                  <button
                    onClick={() => manejarRespuesta('verbo')}
                    disabled={botonesDeshabilitados}
                    className="p-4 sm:p-6 text-xl font-bold rounded-2xl bg-blue-500 text-blue-50 hover:bg-blue-400 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-sm border border-blue-600/20 shadow-blue-200"
                  >
                    Verbo
                  </button>
                </div>

                {/* Feedback */}
                <div className="h-16 w-full flex items-center justify-center">
                  <AnimatePresence>
                    {feedback.visible && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                          "px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 shadow-sm text-center",
                          feedback.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}
                      >
                        {feedback.isCorrect ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <XCircle className="w-6 h-6 flex-shrink-0" />}
                        {feedback.mensaje}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {gameState === 'finished' && (
              <motion.div 
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner"
              >
                {getResultadoFinal().icon}
                <h2 className="text-3xl font-black mb-6 text-slate-800">¡Juego Terminado!</h2>
                
                <div className={cn("p-6 rounded-2xl border-2 mb-8 w-full max-w-sm", getResultadoFinal().color)}>
                  <p className="text-xl font-bold mb-4">{getResultadoFinal().msg}</p>
                  
                  {playerName && (
                    <div className="mb-4 bg-white/80 rounded-xl p-3 inline-block shadow-sm">
                       <span className="text-slate-700 font-medium">Puntuación: </span>
                       <span className="text-3xl font-black text-blue-600 ml-2">{Math.max(0, (aciertos * 10 * dificultad) - (errores * 5))}<span className="text-lg font-bold text-blue-500 ml-1">pts</span></span>
                    </div>
                  )}

                  <div className="flex justify-around items-center bg-white/50 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-600 drop-shadow-sm">{aciertos}</div>
                      <div className="text-sm font-bold text-green-800 uppercase tracking-wider mt-1">Aciertos</div>
                    </div>
                    <div className="w-px h-16 bg-black/10" />
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-600 drop-shadow-sm">{errores}</div>
                      <div className="text-sm font-bold text-red-800 uppercase tracking-wider mt-1">Errores</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setGameState('setup')}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-800 font-bold text-white text-xl rounded-full hover:bg-slate-700 active:scale-95 transition-all shadow-lg shadow-slate-300"
                >
                  <RotateCcw className="w-6 h-6" />
                  Volver a Jugar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
