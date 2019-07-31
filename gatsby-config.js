const path = require('path');

module.exports = themeOptions => {
    const programDir = process.cwd();
    const {
        contentDir = 'content',
        mdx = true,
        mdxOptions
    } = themeOptions;

    const plugins = [];

    if(mdx){
        plugins.push({
            resolve: `gatsby-plugin-mdx`,
            options: mdxOptions
        })
    }

    if(contentDir) {
        plugins.push(
            {
                resolve: `gatsby-source-filesystem`,
                options: {
                    name: `content`,
                    path: path.join(programDir, contentDir),
                },
            },
        )
    }

    return {
        plugins
    };
}
