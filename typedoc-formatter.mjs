import { dirname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { MarkdownPageEvent } from "typedoc-plugin-markdown"

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
	const root = fileURLToPath(new URL("./", import.meta.url))
	const output = resolve(root, "docs")

	app.renderer.on(
		MarkdownPageEvent.BEGIN,
		/** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
		(page) => {
			page.frontmatter = {
				title: page.model.name
			}
		}
	)

	app.renderer.on(
		MarkdownPageEvent.END,
		/** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
		(page) => {
			if (!page.contents) return

			const dir = relative(output, dirname(page.filename))
			const base = new URL(
				`/docs/kiai.js/${dir ? `${dir.split(sep).join("/")}/` : ""}`,
				"https://kiai.app"
			)

			page.contents = page.contents.replace(
				/(?<!\\)\[([^\]]*)\]\(([^)]*)\)/g,
				(_, text, link) => {
					const url = new URL(link, base)
					if (url.origin !== base.origin) return `[${text}](${link})`

					url.pathname = url.pathname.replace(/\.mdx?$/, "").replace(/\/index$/, "")
					return `[${text}](${url.pathname}${url.search}${url.hash})`
				}
			)
		}
	)
}
