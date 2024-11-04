import { describe, it, expect } from 'vitest';
import { sanitizeCategoryName, sanitizeComponentName, groupByCategory, type ComponentInfo } from './component-utils';

describe('sanitizeCategoryName', () => {
  it('removes leading numbers', () => {
    expect(sanitizeCategoryName('01 My Category')).toBe('MyCategory');
  });

  it('capitalizes words and removes special characters', () => {
    expect(sanitizeCategoryName('my test category!')).toBe('MyTestCategory');
    expect(sanitizeCategoryName('multiple   spaces')).toBe('MultipleSpaces');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeCategoryName('')).toBe('');
  });

  it('returns empty string for input with only special characters', () => {
    expect(sanitizeCategoryName('!@#$%^&*()')).toBe('');
  });

  it('returns empty string for input with only numbers', () => {
    expect(sanitizeCategoryName('123456')).toBe('');
  });

  it('returns empty string for input with only spaces', () => {
    expect(sanitizeCategoryName('     ')).toBe('');
  });

  it('returns sanitized string for input with leading and trailing spaces', () => {
    expect(sanitizeCategoryName('   leading and trailing spaces   ')).toBe('LeadingAndTrailingSpaces');
  });
});

describe('sanitizeComponentName', () => {
  it('replaces plus with Plus', () => {
    expect(sanitizeComponentName('Icon+Name')).toBe('IconPlusName');
  });

  it('removes special characters', () => {
    expect(sanitizeComponentName('My@Icon#Name')).toBe('MyIconName');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeComponentName('')).toBe('');
  });

  it('returns empty string for input with only special characters', () => {
    expect(sanitizeComponentName('!@#$%^&*()')).toBe('');
  });

  it('returns empty string for input with only spaces', () => {
    expect(sanitizeComponentName('     ')).toBe('');
  });

  it('returns sanitized string for input with leading and trailing spaces', () => {
    expect(sanitizeComponentName('   leading and trailing spaces   ')).toBe('LeadingAndTrailingSpaces');
  });
});

describe('groupByCategory', () => {
  it('groups components by category', () => {
    const components: ComponentInfo[] = [
      { name: 'Icon1', path: '/path1', category: 'Category1' },
      { name: 'Icon2', path: '/path2', category: 'Category2' },
      { name: 'Icon3', path: '/path3', category: 'Category1' }
    ];

    const result = groupByCategory(components);

    expect(result).toEqual({
      'Category1': [
        { name: 'Icon1', path: '/path1', category: 'Category1' },
        { name: 'Icon3', path: '/path3', category: 'Category1' }
      ],
      'Category2': [
        { name: 'Icon2', path: '/path2', category: 'Category2' }
      ]
    });
  });

  it('returns empty object for empty input', () => {
    expect(groupByCategory([])).toEqual({});
  });
}); 