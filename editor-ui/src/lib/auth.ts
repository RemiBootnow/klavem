const KEY = "klavem-editor-auth";

export function setPassword(password: string) {
  localStorage.setItem(KEY, password);
}

export function clearPassword() {
  localStorage.removeItem(KEY);
}

export function getAuthHeader(): string | null {
  const pw = localStorage.getItem(KEY);
  if (!pw) return null;
  return `Basic ${btoa(`client:${pw}`)}`;
}
