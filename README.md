# `jbrowse-plugin-gwas` (work in progress)

Plugin for displaying GWAS results such as manhattan plot renderings

## Install

### For use in [JBrowse Web](https://jbrowse.org/jb2/docs/quickstart_web)

No installation required

### For use in [`@jbrowse/react-linear-view`](https://www.npmjs.com/package/@jbrowse/react-linear-genome-view)

```
yarn add jbrowse-plugin-gwas
```

## Usage

### In [JBrowse Web](https://jbrowse.org/jb2/docs/quickstart_web)

#### Development

```
git clone https://github.com/cmdcolin/jbrowse-plugin-gwas.git
cd jbrowse-plugin-gwas
yarn
yarn start
```

Then open JBrowse Web to (assuming it is running on port 3000):

http://localhost:3000/?config=http://localhost:9000/config.json

#### Demo

https://s3.amazonaws.com/jbrowse.org/code/jb2/master/index.html?config=https%3A%2F%2Funpkg.com%2Fjbrowse-plugin-gwas%2Fdist%2Fconfig.json

#### Production

Add to the "plugins" of your JBrowse Web config:

```json
{
  "plugins": [
    {
      "name": "gwas",
      "url": "https://unpkg.com/jbrowse-plugin-gwas/dist/jbrowse-plugin-gwas.umd.production.min.js"
    }
  ]
}
```

### In [`@jbrowse/react-linear-view`](https://www.npmjs.com/package/@jbrowse/react-linear-genome-view)

```tsx
import React from "react";
import "fontsource-roboto";
import {
  createViewState,
  createJBrowseTheme,
  JBrowseLinearGenomeView,
  ThemeProvider,
} from "@jbrowse/react-linear-view";
import GWAS from "jbrowse-plugin-gwas";

const theme = createJBrowseTheme();

function View() {
  const state = createViewState({
    assembly: {
      /* assembly */
    },
    tracks: [
      /* tracks */
    ],
    plugins: [GWAS],
  });
  return (
    <ThemeProvider theme={theme}>
      <JBrowseLinearGenomeView viewState={state} />
    </ThemeProvider>
  );
}
```

## Screenshot

![](img/1.png)
![](img/2.png)
