# @threeveloper/azure-react-icons

<div style="display: flex;">
<span>Use ready-to-use original Azure Icons in your React project as React Components.
Based on the <a href="https://learn.microsoft.com/en-us/azure/architecture/icons/">Azure Icons ZIP file</a> provided by Microsoft.</span>

![](icon.svg)
</div>

## Installation 

```bash
npm install @threeveloper/azure-react-icons
```

**Note:** `react@>=16` needs to be installed in your project.

## Usage

### Importing icons

Importing a single icon is as simple as:

```tsx
import { AppServicePlans } from '@threeveloper/azure-react-icons';

<AppServicePlans /> // Default size 16    
<AppServicePlans size="24" /> // Custom size
```

You can probably stop reading here, but if you want to know more, read on.


### Importing categories

Import all icons of a single category

```tsx
import { AiMachineLearning } from '@threeveloper/azure-react-icons';

export const IconFromCategory = () => (
    <AiMachineLearning.AzureOpenAI />
);
```

### Importing all categories

Import all categories at once, in which case it will include a user-friendly label and all icons.

```tsx
import { Categories } from '@threeveloper/azure-react-icons';

export const AllHybridMulticloudIcons = () => (
    <div>
        <span>{Categories.HybridMulticloud.label}</span> // Prints "Hybrid + Multicloud"
        <Categories.HybridMulticloud.AzureOperator5GCore /> // Use specific icon from specific category

        // Loop over all icons in a category
        {Object.values(Categories.HybridMulticloud.components).map((Icon) => (
            <Icon key={Icon.name} />
        ))}
    </div>
);
```

### Importing all icons

Import all icons and categories

```tsx
import AzureReactIcons from '@threeveloper/azure-react-icons';

export const IconsFromDefaultExport = () => (
    <div>
        <AzureReactIcons.AzureOpenAI /> // Direct icon
        <AzureReactIcons.HybridMulticloud.AzureOperator5GCore /> // Icon via category
        <AzureReactIcons.Categories.HybridMulticloud.AzureOperator5GCore /> // Icon via all categories -> category
    </div>
);
```

Thanks to [@orangenet](https://github.com/orangenet/azure-react-icons/tree/master) for the initial setup. This project provides a better DX, contains newer icons and TypeScript definition files.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
