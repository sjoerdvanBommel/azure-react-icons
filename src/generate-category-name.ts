export function generateCategoryName(category: string): string {
    return category
      .replace(/^\d+/, '')
      .split(/[\s+]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '');
  }