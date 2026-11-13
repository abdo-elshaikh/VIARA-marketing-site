type Product = { id: string; enabled: boolean };

const scopes: Record<string, Record<string, readonly string[]>> = {
  radiology: { operations: ['RIS'], imaging: ['PACS'], access: ['PORTAL'], assistance: ['AI'], connected: ['RIS', 'PACS', 'PORTAL'] },
  medical: { operations: ['CMS'], access: ['PORTAL'], connected: ['CMS', 'PORTAL'] },
};

export function startingGoals(facility: string): string[] {
  return Object.hasOwn(scopes, facility) ? Object.keys(scopes[facility]) : [];
}

export function startingSystems(products: readonly Product[], facility: string, goal: string): string[] {
  const model = Object.hasOwn(scopes, facility) ? scopes[facility] : undefined;
  const ids = model && Object.hasOwn(model, goal) ? model[goal] : [];
  return ids.filter(id => products.some(product => product.id === id && product.enabled));
}
