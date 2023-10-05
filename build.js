const marked = require("marked");
const glob = require("glob");
const path = require("node:path");
const fs = require("node:fs/promises");

(async () => {
    // Get all .md pages
    const pages = await glob.glob("portfolio/*/index.md");

    await Promise.all(pages.map(async (page) => {
        // Metadata
        const title = path.basename(path.dirname(page))
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        // Convert markdown to HTML
        const markdown = await fs.readFile(page, { encoding: "utf-8" });
        const body = await marked.marked(markdown, { async: true });

        // Add prefix, suffix
        const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="HandheldFriendly" content="true"/>
                <meta name="viewport" content="width=device-width, maximum-scale=1.0, user-scalable=yes">
                
                <title>${title} / Yohan Guyomard</title>
                <link rel="stylesheet" href="../../styles.css">
            </head>
            <body>
                <a href="../../">Portfolio</a> &gt; <b>${title}</b>
                ${body}

                <div class="center">
                    <a href="/" class="small">(go back)</a>
                </div>
            </body>
        </html>
        `

        // Save to index.html
        await fs.writeFile(path.join(path.dirname(page), "index.html"), html);

        console.log(`Done "${page}"`);
    }));
})();