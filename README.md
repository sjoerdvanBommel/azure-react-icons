# @threeveloper/azure-react-icons

<div style="display: flex;">
<span>Use ready-to-use original Azure Icons in your React project as React Components, with zero additional runtime dependencies. Based on the <a href="https://learn.microsoft.com/en-us/azure/architecture/icons/">Azure Icons ZIP file</a> provided by Microsoft.</span>

![](icon.svg)
</div>

## Installation 

```bash
npm install @threeveloper/azure-react-icons
```

**Note:** `react@>=16` needs to be installed in your project.

## Usage

### Display a single icon

Using a single icon is as simple as:

```tsx
import { AIStudio } from '@threeveloper/azure-react-icons';

<AIStudio /> // Default size 16    
<AIStudio size="24" /> // Custom size
```

### Display all icons in a category

The Azure icons are separated into categories (managed by Microsoft). Each category has a `label` and a `components` property, which contains all the icons in that category.

```tsx
import { AiMachineLearning } from '@threeveloper/azure-react-icons';

export const AllIconsInAiMachineLearningCategory = () => (
    <>
        <span>{AiMachineLearning.label}</span> // Prints "AI + Machine learning"

        {Object.values(AiMachineLearning.components).map((Icon) => (
            <Icon key={Icon.name} /> // Render all icons in this category
        ))}
    </>
);
```

### Display all icons grouped by category

The default export of this library is an object containing all categories.

```tsx
import AzureReactIcons from '@threeveloper/azure-react-icons';

export const AllIconsGroupedByCategory = () => (
    <div>
        {Object.values(AzureReactIcons).map((category) => (
            <div key={category.label}>
                <span>{category.label}</span>
                {Object.values(category.components).map((Icon) => (
                    <Icon key={Icon.name} /> // Renders all icons grouped by category
                ))}
            </div>
        ))}
    </div>
);
```

Thanks to [@orangenet](https://github.com/orangenet/azure-react-icons/tree/master) for the initial setup. This project provides a better DX, contains newer icons and TypeScript definitions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Icon terms

Based on the [Official Azure Icon terms](https://learn.microsoft.com/en-us/azure/architecture/icons/#icon-terms):

> Microsoft permits the use of these icons in architectural diagrams, training materials, or documentation. You may copy, distribute, and display the icons only for the permitted use unless granted explicit permission by Microsoft. Microsoft reserves all other rights.