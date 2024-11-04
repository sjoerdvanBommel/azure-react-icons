// This test file depends on the generated files, so it should be run after generating the icons.

import { render } from '@testing-library/react';
import GeneratedIcons, { AIStudio, AiMachineLearning } from '../generated';

describe('AIStudio Icon', () => {
  const testCases = [
    {
      name: 'direct import',
      Component: AIStudio,
    },
    {
      name: 'category object',
      Component: AiMachineLearning.components.AIStudio,
    },
    {
      name: 'default export',
      Component: GeneratedIcons.AiMachineLearning.components.AIStudio,
    },
  ];

  testCases.forEach(({ name, Component }) => {
    describe(`when using ${name}`, () => {
      it('renders with default size', () => {
        const { container } = render(<Component />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '18');
        expect(svg).toHaveAttribute('height', '18');
      });

      it('renders with custom size', () => {
        const customSize = '24';
        const { container } = render(<Component size={customSize} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', customSize);
        expect(svg).toHaveAttribute('height', customSize);
      });

      it('applies additional props', () => {
        const { container } = render(<Component data-testid="custom-icon" className="icon-class" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('icon-class');
      });

      it('maintains correct display name', () => {
        expect(Component.displayName).toBe('AIStudio');
      });
    });
  });
}); 

describe('Category label', () => {
  const testCases = [
    {
      name: 'category object',
      Component: AiMachineLearning,
    },
    {
      name: 'default export',
      Component: GeneratedIcons.AiMachineLearning,
    },
  ];

  testCases.forEach(({ name, Component }) => {
    describe(`when using ${name}`, () => {
      it('matches expected label', () => {
        expect(Component.label).toBe('Ai + Machine learning');
      });
    });
  });
});
