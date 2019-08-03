const path = require('path');
const { getFirstResolvableComponent } = require('@arrempee/gatsby-helpers');

/* Takes an Mdx node
 *
 * Returns the value of the template field in the MdxPage node
 */
const getTemplate = ({node, getNode}) => {
    // Return a defined template if present
    if(node.frontmatter.template){
        return node.frontmatter.template;
    }
    // Infer a template from the parent file's path
    const {name, relativeDirectory} = getNode(node.parent);
    return relativeDirectory && relativeDirectory !== '' ?
        relativeDirectory + '/' + name :
        name;
}

/* Takes an Mdx node
 *
 * Returns the value of the pagePath field in the MdxPage node
 */
const getPagePath = ({node, getNode, indexPageName}) => {
    if(node.frontmatter.path){
        return node.frontmatter.path
    }
    const parentNode = getNode(node.parent);

    const {relativeDirectory} = parentNode;
    const name = node.frontmatter.slug || parentNode.name;

    if(
        indexPageName
            && name === indexPageName
            && relativeDirectory === ''
    ) {
        return '/';
    }

    return path.join(
        '/',
        relativeDirectory,
        name
    )
}

/* Takes an MdxPage node, a default template value, and the directory
 * template files are stored in relative to the Gatsby site's root.
 *
 * Returns the path of an existing component
 */
const getTemplateComponent = ({node, defaultTemplate, templateDirectory}) => {
    const template = node && node.template;
    const pathsToTry = [];

    if(template) {
        pathsToTry.push(template)
    }

    if(defaultTemplate){pathsToTry.push(defaultTemplate)}

    return getFirstResolvableComponent(pathsToTry.map(
        relativePath => path.join(process.cwd(), templateDirectory, relativePath)
    ))
}

module.exports = {
    getTemplate,
    getPagePath,
    getTemplateComponent
}
