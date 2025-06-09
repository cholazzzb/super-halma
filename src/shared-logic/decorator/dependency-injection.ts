export const container = new Map();

export function registerSingleton<T>(
  token: new (...args: any[]) => T,
  instance: T,
) {
  container.set(token, instance);
}

export function resolve<T>(token: new (...args: any[]) => T): T {
  const instance = container.get(token);
  if (!instance) {
    throw new Error(`No provider found for ${token.name}`);
  }
  return instance;
}
