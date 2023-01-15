export const getItem = <T>(key: string): T | null => {
  if (!window || !window.localStorage) {
    return null;
  }

  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setItem = <T>(key: string, value: T): void => {
  if (!window || !window.localStorage) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};
