const natsort = require("natural-sort");
const fs = require("fs");
const ncp = require("ncp").ncp;
const config = require("./config.json");
const p = require("./posts.js");

ncp.limit = 16;

const template = fs.readFileSync(config.dev.srcdir + config.dev.templatefile);
const articleTemplate = fs.readFileSync(config.dev.srcdir + config.dev.articletemplatefile);
const archiveTemplate = fs.readFileSync(config.dev.srcdir + config.dev.archivetemplatefile);

console.log("Ensuring " + config.dev.builddir + "exists...");
fs.mkdirSync(config.dev.builddir, {recursive : true});

console.log("Compiling posts...");
const posts = fs.readdirSync(config.dev.srcdir + config.dev.postsdir)
	.sort(natsort({direction: 'desc'}))
	.map(post => p.createPost(post));

const indexPosts = JSON.parse(JSON.stringify(posts))
	.slice(0, 10)
	.map(post => {
		post.body = post.body.slice(0, 400) + `... <a href="${post.path}.html">read more</a></p>`;
		console.log(post.body + "\n\n\n");
		return p.postHtml(post);
	})
	.join('');

console.log("Generating archive.html...");

const archive = JSON.parse(JSON.stringify(posts))
	.map(post => {
		return `<li><a href="${post.path}.html"> ${post.attributes.title} - ${post.attributes.date}</a></li>`
	})
	.join('');

fs.writeFileSync(config.dev.builddir + '/' + config.dev.archivetemplatefile, eval('`' + archiveTemplate + '`'));

console.log("Compiling post pages...");


posts.forEach(data => {
	fs.writeFileSync(`${config.dev.builddir}/${data.path}.html`,
		eval('`' + articleTemplate + '`'));
});

console.log("Compiling aboutme...");
const aboutme = p.renderMarkdown(config.dev.srcdir + config.dev.aboutme);

console.log("Generating index.html...");
const index = eval('`' + template + '`');

console.log("Writiting index.html to build directory...");
fs.writeFileSync(`${config.dev.builddir}/index.html`, index);

console.log("Copying directories...")
config.dev.copydirs.forEach(element => 
	ncp(config.dev.srcdir + element, `${config.dev.builddir}/${element}`, (err) => {
	 if (err) {
	   console.error(err);
	 }
	 console.log(`Copied directory ${element}/ to build directory.`);
}));

console.log("Copying static pages...")
config.dev.otherpages.forEach(element =>
	ncp(config.dev.srcdir + element, `${config.dev.builddir}/${element}`, (err) => {
		 if (err) {
		   console.error(err);
		 } else {
			 console.log(`Copied ${element} to build directory.`);
		 }
}))
