export function formatDate(isoDate: string): string {

  const date = new Date(isoDate);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meseci su 0-indeksirani
  const year = date.getFullYear();

  return `${hours}:${minutes}h ${day}.${month}.${year}`;
}

export function formatToISODate(date: Date): string {

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meseci su 0-indeksirani
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatToISOTime(date: Date): string {

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function formatToDate(date: Date): string {

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meseci su 0-indeksirani
  const day = date.getDate().toString().padStart(2, '0');

  return `${day}.${month}.${year}`;
}

export function formatToTime(date: Date): string {

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}
