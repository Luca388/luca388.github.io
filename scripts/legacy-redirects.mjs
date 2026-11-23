// The site used to live at /blog/. After the build, give every built page a copy at its old
// /blog/... address that sends the reader (and search engines, via canonical) to the new one.
// GitHub Pages has no server-side redirects, so these are small HTML pages.
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://luca388.github.io';
const SKIP = new Set(['blog', 'pagefind', '_astro', 'admin']);

async function* htmlPages(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (dir === DIST && SKIP.has(entry.name)) continue;
			yield* htmlPages(path);
		} else if (entry.name === 'index.html') {
			yield path;
		}
	}
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

let count = 0;
for await (const page of htmlPages(DIST)) {
	const rel = relative(DIST, dirname(page)).split(sep).join('/');
	const path = rel ? `/${rel}/` : '/';
	const target = escape(`${SITE}${encodeURI(path)}`);
	const out = join(DIST, 'blog', rel, 'index.html');
	await mkdir(dirname(out), { recursive: true });
	await writeFile(
		out,
		`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>이동했어요</title>
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(path)} + location.search + location.hash)</script>
</head>
<body><p><a href="${target}">${target}</a>로 이동했어요.</p></body>
</html>
`,
	);
	count++;
}

// Feed readers subscribed to the old address keep getting posts.
await copyFile(join(DIST, 'rss.xml'), join(DIST, 'blog', 'rss.xml'));

console.log(`legacy-redirects: ${count} pages under /blog/`);
