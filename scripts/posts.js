const config = require("./config.json");
const fm = require("front-matter");
const marked = require("./marked.js");
const fs = require("fs");

const createPost = postPath => {
	const data = fs.readFileSync(`./${config.dir.src}/${config.dir.posts}/${postPath}/index.md`, "utf8");
	const content = fm(data);
	content.body = marked(content.body);
	content.path = postPath;
	return content;
};

function renderMarkdown(filePath) {
	const markdown = fs.readFileSync(filePath, "utf8");
	return marked(markdown);
}

const postHtml = data => `
<div class="post">
	<div class="postheading">
		<h1><a href="${data.path}.html">${data.attributes.title}</a></h1>
		<p>${data.attributes.date}</p>
	</div>
	<hr/>
	${data.body}
</div>
`;

module.exports = {
	renderMarkdown,
	createPost,
	postHtml
};
