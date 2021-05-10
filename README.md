# jbrowse-plugin-gwas

Plugin for displaying GWAS results such as manhattan plot renderings

## Screenshot

![](img/1.png)
![](img/2.png)

## Usage in jbrowse-web

Add to the "plugins" of your JBrowse Web config. The unpkg CDN should be stable, or you can download the js file to your server

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

This plugin is currently quite basic, and there is no mouseover interactivity or drawn labels on features

#### Demo

https://s3.amazonaws.com/jbrowse.org/code/jb2/main/index.html?config=https%3A%2F%2Funpkg.com%2Fjbrowse-plugin-gwas%2Fdist%2Fconfig.json&session=share-iehjT6AoHd&password=lZS7v

Loading cross origin configs produces a warning but this link is safe

### For use in jbrowse/react-linear-genome-view

See [DEVELOPMENT](DEVELOPMENT.md)
