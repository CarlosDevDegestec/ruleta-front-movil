import { ClaimBody, Question, RouletteData } from '../types';
import { API_BASE } from '../config';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export async function fetchRouletteData(): Promise<RouletteData> {
  const res = await fetch(`${API_BASE}/api/landing/roulette/show`, {
    headers: defaultHeaders,
  });
  if (!res.ok) throw new Error('Error al cargar la ruleta');
  return res.json();
}

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_BASE}/api/landing/questions/show`, {
    headers: defaultHeaders,
  });
  if (!res.ok) throw new Error('Error al cargar las preguntas');
  return res.json();
}

export async function submitClaim(data: ClaimBody): Promise<void> {
  const res = await fetch(`${API_BASE}/api/landing/claim`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Error al registrar la reclamación');
  }
}
