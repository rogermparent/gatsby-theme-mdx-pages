# Gatsby Theme: MDX Pages

This Gatsby theme is a simple boilerplate for generating pages from MDX files
using templates and paths defined by both the files' path and certain
frontmatter fields, unlike the default method which uses module export notation
for templates.

The default behavior is completely usable and takes inspiration from the Hugo
static site generator, but the plugin also aims to be very modular and
customizable for use in non-standard websites as well as other Gatsby themes.

## Configuration

### contentDir: string

The directory where content files are located, relative to the site's root.

Defaults to "content".

### mdxOptions: object

The contents of this object are used as the options for `gatsby-plugin-mdx`.

### mdx: boolean

When set to false, disables the instance of `gatsby-plugin-mdx` that's normally
added to the site's gatsby-config.

### templateDirectory: string

The directory where template components are stored, relative to the root
directory of the site using the theme.

Defaults to 'src/templates'

### indexPageName: string

Normally, any `MdxPage` node with a filename matching this string will have the
path of the folder that contains it instead. Defaults to "index".

### createPages: boolean

If set to false, aborts the default createPages callback in the plugin.

Useful for sites or themes that want to use the nodes created by this plugin with more
complex page creation logic.

### defaultTemplate: string

The path of the template that `MdxPage` nodes will use when no other components
can be resolved.

Defaults to "default", which when paired with the default `templateDirectory`
means the default file will be "src/templates/default.js".
    
### getTemplate: function({node, getNode})

This function passed here will override the default one used to determine the
template "key" from each `Mdx` node, which then in stored in the `template`
field of the `MdxPage` node and later passed to `getTemplateComponent` during
page creation.

The function receives an `Mdx` node, and is provided the `getNode` function to
allow it to reach into other nodes, like the parent `File` node.

### getPagePath: function({node, getNode, indexPageName})

A function passed here will override the default one used to determine the path
of the page that results from each `MdxPage` node.

The function receives an `Mdx` node and `getNode`, as well as the
`indexPageName` setting. The default function uses this to modify pages with a
configurable specific filename ("index" by default) to have the path of their
parent folder instead of literally "index".

### getTemplateComponent: function({node, defaultTemplate, templateDirectory})

A function passed here will override the default one used to find the absolute
path of a component that will be used in the `createPage` action.

The function receives the `MdxPage` node, the templateDirectory setting, and the
path of the default template relative to that directory.

As an example, the default function attempts to resolve the node's template key
relative to the template directory, then falls back to the default template
should that one not exist.

## Node Types

### MdxPage

This node represents an individual page.  
Under normal circumstances, every Mdx node will have a single MdxPage child.

#### Fields

- **pagePath**: The path this page will normally be created under.  
With the default `getPagePath`, this is influenced by the Mdx file's relative
directory, as well as frontmatter fields such as `slug`, which overrides the
filename, and `path`, which overrides the whole path relative to the site root.

- **template**: The relative path of the component a page will be rendered with.  
With the default `getTemplate`, this will either be the `template` frontmatter
field or the page's relative path with its extension cut off.  
Keep in mind that this field will not always (or even usually) point to an
existing component- `getTemplateComponent` is meant to handle that situation by
falling back on a more generic or default component.

- **frontmatter**: This is the Mdx node's frontmatter, completely unchanged.  
It's resolvable from the `MdxPage` node simply for convenience and sorting purposes.

- **body**: This is the rendered JS code pulled straight from the `Mdx` node.  
  Use this in the `MDXRenderer` component from `gatsby-plugin-mdx`.
