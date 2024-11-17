# @threeveloper/azure-react-icons

<div style="display: flex;">
<span>Ready-to-use Azure Icons in your project as React Components, with zero additional runtime dependencies. Based on the <a href="https://learn.microsoft.com/en-us/azure/architecture/icons/">Azure Icons ZIP file</a> provided by Microsoft.</span>

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

When you only have the path of the SVG file inside of the ZIP, you can use the generic `AzureSvgIcon` component and pass it an `svgPath`. It will automatically strip off anything before the last 2 path sections, which allows passing an absolute or longer relative path. **Note:** The actual SVG file is not required here. The path will be resolved to an existing react component.

**These all resolve to the same icon component:**

```tsx
import { AzureSvgIcon, VirtualMachine } from '@threeveloper/azure-react-icons'

<AzureSvgIcon svgPath="compute/10021-icon-service-Virtual-Machine.svg" />
<AzureSvgIcon svgPath="Icons/compute/10021-icon-service-Virtual-Machine.svg" />
<AzureSvgIcon svgPath="~/any/amount/of/subfolders/compute/10021-icon-service-Virtual-Machine.svg" />
<VirtualMachine />
```

### Display all icons in a category

The Azure icons are separated into categories (managed by Microsoft). Each category has a `label` and a `components` property, which contains all the icons in that category.

```tsx
import { AiMachineLearningCategory } from '@threeveloper/azure-react-icons';

export const AllIconsInAiMachineLearningCategory = () => (
    <>
        <span>{AiMachineLearningCategory.label}</span> // Prints "AI + Machine learning"

        {Object.values(AiMachineLearningCategory.components).map((Icon, i) => (
            <Icon key={i} /> // Render all icons in this category
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
                {Object.values(category.components).map((Icon, i) => (
                    <Icon key={i} /> // Renders all icons grouped by category
                ))}
            </div>
        ))}
    </div>
);
```

All unique icons have a readable name based on Microsoft's Azure Icon files. It scrapes off the `<id>-icon-service-` prefix and transforms the rest to a PascalCase export. However, doing so created conflicts. Duplicate exports are handled as following:

| Condition | Postfix | Postfix inside category object | Example |
| --- | --- | --- | --- |
| Same icon name exists within the same category | `<CategoryName><5-digit ID>` | `<5-digit ID>` | `WorkspacesCompute00330`<br/>`WorkspacesCompute00400`<br/>`WorkspacesCategory.Compute00330`
| Same icon name exists in another category | `<CategoryName>` | No postfix | `AppServicesMobile`<br/>`MobileCategory.AppServices`

Thanks to [@orangenet](https://github.com/orangenet/azure-react-icons/tree/master) for the initial setup. This project provides a better DX, contains newer icons and TypeScript definitions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Icon terms

Based on the [Official Azure Icon terms](https://learn.microsoft.com/en-us/azure/architecture/icons/#icon-terms):

> Microsoft permits the use of these icons in architectural diagrams, training materials, or documentation. You may copy, distribute, and display the icons only for the permitted use unless granted explicit permission by Microsoft. Microsoft reserves all other rights.