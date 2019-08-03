const crypto = require('crypto');
const defaultGetters = require('./default-getters');
const {resolveFromParent, fetchFromParent} = require('@arrempee/gatsby-helpers/resolver-helpers');

exports.sourceNodes = ({ actions, schema }) => {
    // Pre-define the required Mdx frontmatter and fields properties.
    // This prevents the site from breaking if no pages have them defined.
    const {createTypes} = actions;
    const types = [
        schema.buildObjectType({
            name: `MdxPage`,
            interfaces: [`Node`],
            fields: {
                template: `String`,
                pagePath: `String`,
                body: {
                    type: "String!",
                    resolve(source, args, context, info) {
                        return resolveFromParent({
                            fieldName: 'body',
                            nodeType: 'Mdx',
                            source, args, context, info
                        })
                    }
                },
                frontmatter: {
                    type: "MdxFrontmatter",
                    resolve(source, args, context, info) {
                        return fetchFromParent({
                            fieldName: 'frontmatter',
                            source, args, context, info
                        })
                    }
                },
            }
        })
    ];
    createTypes(types);
};

exports.onCreateNode = ({
    node,
    getNode,
    createNodeId,
    actions: {
        createNode,
        createParentChildLink
    }
}, {
    getTemplate = defaultGetters.getTemplate,
    getPagePath = defaultGetters.getPagePath,

    indexPageName = `index`,
}) => {
    if(node.internal.type === `Mdx`) {
        const fieldData = {
            template: getTemplate({node, getNode}),
            pagePath: getPagePath({node, getNode, indexPageName})
        };

        const mdxPageNode = {
            ...fieldData,
            // Required fields
            id: createNodeId(`${node.id} >>> MdxPage`),
            parent: node.id,
            children: [],
            internal: {
                type: `MdxPage`,
                contentDigest: crypto
                    .createHash(`md5`)
                    .update(JSON.stringify(fieldData))
                    .digest(`hex`),
                content: JSON.stringify(fieldData),
                description: `A page backed by an MDX file.`
            }
        };

        createNode(mdxPageNode);
        createParentChildLink({parent: node, child: mdxPageNode});
    }
};

exports.createPages = async ({
    actions: {
        createPage
    },
    graphql
}, {
    createPages = true,
    getTemplateComponent = defaultGetters.getTemplateComponent,

    templateDirectory = `src/templates`,
    defaultTemplate = `default`,
}) => {

    // Don't create pages if the options specify not to.
    // A user or plugin may want to handle this while still using our nodes.
    if(!createPages) return;

    const result = await graphql(
        `
  {
    allMdxPage {
      nodes {
        id
        template
        pagePath
      }
    }
  }
`
    );

    if(result.error) throw result.error;
    const pageNodes = result.data.allMdxPage;

    for(const mdxPageNode of pageNodes) {
        const component = getTemplateComponent({
            node: mdxPageNode,
            templateDirectory,
            defaultTemplate
        });
        createPage({
            path: mdxPageNode.pagePath,
            component,
            context: {
                id: mdxPageNode.id
            }
        });
    }
};
