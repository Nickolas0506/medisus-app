import { useEffect, useState } from 'react';

/** Devolve o valor so depois que o usuario para de digitar (evita uma chamada por letra). */
export function useDebounce<T>(valor: T, atrasoMs = 400): T {
  const [valorAtrasado, setValorAtrasado] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setValorAtrasado(valor), atrasoMs);
    return () => clearTimeout(timer);
  }, [valor, atrasoMs]);

  return valorAtrasado;
}
