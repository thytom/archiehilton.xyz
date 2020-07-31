const natsort = require("natural-sort");
const fs = require("fs");
const ncp = require("ncp").ncp;
const config = require("./config.json");
const p = require("./posts.js");

ncp.limit = 16;

const template = fs.readFileSync(config.dev.srcdir + config.dev.templatefile);

console.log("Compiling posts...");
const posts = fs
	.readdirSync(config.dev.srcdir + config.dev.postsdir)
	.sort(natsort({direction: 'desc'}))
	.slice(0, 10)
	.map(post => p.postHtml(p.createPost(post)))
	.join('');

console.log("Compiling aboutme...");
const aboutme = p.renderMarkdown(config.dev.srcdir + config.dev.aboutme);

console.log("Generating index.html...");
const index = eval('`' + template + '`');

if(!fs.existsSync(config.dev.builddir))
	fs.mkdirSync(config.dev.builddir);

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
}));


// console.log(`${config.dev.builddir}/index.html`);
