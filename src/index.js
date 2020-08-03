const natsort = require("natural-sort");
const truncate = require("html-truncate");
const fs = require("fs");
const ncp = require("ncp").ncp;
const config = require("./config.json");
const p = require("./posts.js");
const _ = require("lodash");
const {attempt} = require("./attempt.js");

ncp.limit = 16;

const timeStart = process.hrtime();

const defaultHandler = (err, data) => {if(err) throw new Error(err.message)};

const templates = {
	index 	: fs.readFileSync(`./${config.dir.src}/${config.templates.template}`),
	article : fs.readFileSync(`./${config.dir.src}/${config.templates.article}`),
	archive : fs.readFileSync(`./${config.dir.src}/${config.templates.archive}`)
};

attempt("Building directories", () => fs.mkdir(`./${config.dir.build}`, {recursive : true}, defaultHandler));

const posts = attempt("Rendering posts", () => {
	return fs.readdirSync(`./${config.dir.src}/${config.dir.posts}`)
	.sort(natsort({direction: 'desc'}))
	.map(post => p.createPost(post));
});

attempt(`Compiling ${posts.length} post pages`, () => {
	posts.forEach(data => {
		process.stdout.write(`\n\t${data.path}...`);
		fs.writeFile(`${config.dir.build}/${data.path}.html`,
			eval('`' + templates.article + '`'), defaultHandler);
	});
});

attempt("Building index.html", () => {
	process.stdout.write("\n\tCompiling main page posts...");
	const indexPosts = posts.slice(0, 10)
		.map(post => {
			post.body = truncate(post.body, 200, {ellipsis: `...<a href="${post.path}">read more</a>`, keepImageTag: true});
			return p.postHtml(post);
		})
		.join('');

	process.stdout.write("\n\tCompiling aboutme...");
	const aboutme = p.renderMarkdown(`./${config.dir.src}/${config.templates.aboutme}`);

	process.stdout.write("\n\tWriting index.html...");
	fs.writeFile(`./${config.dir.build}/index.html`, eval('`' + templates.index + '`'), defaultHandler);
});

attempt("Building archive.html", () => {
	process.stdout.write("\n\tBuilding post list...");
	const archive = posts.map(post => {
		return `<li><a href="${post.path}.html"> ${post.attributes.title} - ${post.attributes.date}</a></li>`;
	})
	.join('');
	process.stdout.write("\n\tWriting archive.html...");
	fs.writeFile(`./${config.dir.build}/archive.html`, eval('`' + templates.archive + '`'), defaultHandler);
});

attempt(`Copying ${config.static.dirs.length} directories`, () =>{
	config.static.dirs.forEach(element => {
		process.stdout.write(`\n\t${element}/...`);
		ncp(`./${config.dir.src}/${element}`, `./${config.dir.build}/${element}`);
	})
});

attempt(`Copying ${config.static.pages.length} static pages`, () => {
	config.static.pages.forEach(element => {
		process.stdout.write(`\n\t${element}/...`);
		ncp(`./${config.dir.src}/${element}`, `./${config.dir.build}/${element}`);
	})
});

const totalTime = process.hrtime(timeStart);

console.log("Build finished: %dms", (totalTime[0] * 1000) + _.round(totalTime[1]/1000000, 2));
