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

const template 		  = fs.readFileSync(config.dev.srcdir + config.dev.templatefile);
const articleTemplate = fs.readFileSync(config.dev.srcdir + config.dev.articletemplatefile);
const archiveTemplate = fs.readFileSync(config.dev.srcdir + config.dev.archivetemplatefile);

attempt("Building directories", () => fs.mkdir(config.dev.builddir, {recursive : true}, defaultHandler));

const posts = attempt("Rendering posts", () => {
	return fs.readdirSync(config.dev.srcdir + config.dev.postsdir)
	.sort(natsort({direction: 'desc'}))
	.map(post => p.createPost(post));
});

attempt(`Compiling ${posts.length} post pages`, () => {
	posts.forEach(data => {
		process.stdout.write(`\n\t${data.path}...`);
		fs.writeFile(`${config.dev.builddir}/${data.path}.html`,
			eval('`' + articleTemplate + '`'), defaultHandler);
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
	const aboutme = p.renderMarkdown(config.dev.srcdir + config.dev.aboutme);

	process.stdout.write("\n\tWriting index.html...");
	fs.writeFile(`${config.dev.builddir}/index.html`, eval('`' + template + '`'), defaultHandler);
});

attempt("Building archive.html", () => {
	process.stdout.write("\n\tBuilding post list...");
	const archive = posts.map(post => {
		return `<li><a href="${post.path}.html"> ${post.attributes.title} - ${post.attributes.date}</a></li>`;
	})
	.join('');
	process.stdout.write("\n\tWriting archive.html...");
	fs.writeFile(`${config.dev.builddir}/archive.html`, eval('`' + archiveTemplate + '`'), defaultHandler);
});

attempt(`Copying ${config.dev.copydirs.length} directories`, () =>{
	config.dev.copydirs.forEach(element => {
		process.stdout.write(`\n\t${element}/...`);
		ncp(config.dev.srcdir + element, `${config.dev.builddir}/${element}`);
	})
});

attempt(`Copying ${config.dev.otherpages.length} static pages`, () => {
	config.dev.otherpages.forEach(element => {
		process.stdout.write(`\n\t${element}/...`);
		ncp(config.dev.srcdir + element, `${config.dev.builddir}/${element}`);
	})
});

const totalTime = process.hrtime(timeStart);

console.log("Build finished: %dms", (totalTime[0] * 1000) + _.round(totalTime[1]/1000000, 2));
