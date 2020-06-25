const config = require("./config.json");
const fm = require("front-matter");
const marked = require("./marked.js");
const fs = require("fs");

const createPost = postPath => {
	const data = fs.readFileSync(`${config.dev.srcdir}/${config.dev.postsdir}/${postPath}/index.md`, "utf8");
	const content = fm(data);
	content.body = marked(content.body);
	content.path = postPath;
	return content;
};

const postHtml = data => `
<div class="post">
	<div class="postheading">
		<h1>${data.attributes.title}</h1>
		<p>${data.attributes.date}</p>
	</div>
	<hr/>
	${data.body}
</div>
`;

module.exports = {
	createPost,
	postHtml
};