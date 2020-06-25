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

console.log("Generating index.html...");
const index = eval('`' + template + '`');

if(!fs.existsSync(config.dev.builddir))
	fs.mkdirSync(config.dev.builddir);

console.log("Write index.html to build directory.");
fs.writeFileSync(`${config.dev.builddir}/index.html`, index);

config.dev.copydirs.forEach(element => 
	ncp(config.dev.srcdir + element, `${config.dev.builddir}/${element}`, function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log(`Copy ${element} to build directory.`);
}));

// console.log(`${config.dev.builddir}/index.html`);