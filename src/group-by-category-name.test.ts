import { describe, it, expect } from 'vitest';
import { groupByCategoryName } from './group-by-category-name';
import { type IconPathInfo } from "./types";

describe('groupByCategoryName', () => {
  it('groups components by category', () => {
    const components: IconPathInfo[] = [
      { componentName: 'Icon1', categoryName: 'Category1' } as IconPathInfo,
      { componentName: 'Icon2', categoryName: 'Category2' } as IconPathInfo,
      { componentName: 'Icon3', categoryName: 'Category1' } as IconPathInfo,
    ];

    const result = groupByCategoryName(components);

    expect(result).toEqual({
      'Category1': [
        components[0],
        components[2],
      ],
      'Category2': [
        components[1],
      ]
    });
  });

  it('returns empty object for empty input', () => {
    expect(groupByCategoryName([])).toEqual({});
  });
}); 