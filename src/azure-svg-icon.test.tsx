import { render } from '@testing-library/react';
import { AzureSvgIcon } from './azure-svg-icon';

// Mock the component map for testing
vi.mock('./generated', () => ({
  svgPathToComponentMap: {
    "web/SomeIcon.svg": () => <div>Some Icon</div>,
    "compute/AnotherIcon.svg": () => <div>Another Icon</div>,
  },
}));

describe('AzureSvgIcon', () => {
  it('renders the correct component when given a valid SVG path with additional folder', () => {
    const { getByText } = render(<AzureSvgIcon svgPath="Icons/web/SomeIcon.svg" />);
    expect(getByText('Some Icon')).toBeInTheDocument();
  });

  it('renders the correct component when given a valid SVG path', () => {
    const { getByText } = render(<AzureSvgIcon svgPath="compute/AnotherIcon.svg" />);
    expect(getByText('Another Icon')).toBeInTheDocument();
  });

  it('logs a warning and returns null for an invalid SVG path', () => {
    console.warn = vi.fn(); // Mock console.warn
    const { container } = render(<AzureSvgIcon svgPath="invalid/path/to/icon.svg" />);
    expect(console.warn).toHaveBeenCalledWith('AzureSvgIcon expects a valid SVG path. Passed svgPath:', 'invalid/path/to/icon.svg');
    expect(container.firstChild).toBeNull();
  });

  it('returns null for an SVG path that does not end with .svg', () => {
    const { container } = render(<AzureSvgIcon svgPath="path/to/Icons/SomeIcon" />);
    expect(container.firstChild).toBeNull();
  });
}); 