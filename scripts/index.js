const natsort = require("natural-sort");
const fs = require("fs");
const ncp = require("ncp").ncp;
const config = require("./config.json");
const p = require("./posts.js");
const _ = require("lodash");

ncp.limit = 16;

const template 		  =	fs.readFileSync(config.dev.srcdir + config.dev.templatefile);
const articleTemplate = fs.readFileSync(config.dev.srcdir + config.dev.articletemplatefile);
const archiveTemplate = fs.readFileSync(config.dev.srcdir + config.dev.archivetemplatefile);

const timeStart = process.hrtime();

function attempt(message, attemptFunc, callback = (err) => {
	if(err) {
		console.error("\nFatal Error (No callback specified): " + err.message);
		process.exit(1);
	} else {
		console.log('\x1b[32m%s\x1b[0m', "OK\n");
	}
}) {
	try {
		process.stdout.write(message + "...");
		const ret = attemptFunc();
		callback(null);
		return ret;
	} catch(err) {
		callback(err);
	}
}

attempt("Building directories", () => {
	fs.mkdirSync(config.dev.builddir, {recursive : true})
});

const posts = attempt("Rendering posts", () => {
	return fs.readdirSync(config.dev.srcdir + config.dev.postsdir)
	.sort(natsort({direction: 'desc'}))
	.map(post => p.createPost(post));
});

attempt(`Compiling ${posts.length} post pages`, () => {
	posts.forEach(data => {
		process.stdout.write(`\n\t${data.path}...`);
		fs.writeFileSync(`${config.dev.builddir}/${data.path}.html`,
			eval('`' + articleTemplate + '`'));
	});
});

attempt("Building index.html", () => {
	process.stdout.write("\n\tCompiling main page posts...");
	const indexPosts = posts.slice(0, 10)
		.map(post => {
			if(post.body.length >= 200)
				post.body = post.body.slice(0, 200) + `... <a href="${post.path}.html">read more</a></p>`;
			return p.postHtml(post);
		})
		.join('');

	process.stdout.write("\n\tCompiling aboutme...");
	const aboutme = p.renderMarkdown(config.dev.srcdir + config.dev.aboutme);

	process.stdout.write("\n\tWriting index.html...");
	fs.writeFileSync(`${config.dev.builddir}/index.html`, eval('`' + template + '`'));
});

attempt("Building archive.html", () => {
	process.stdout.write("\n\tBuilding post list...");
	const archive = posts.map(post => {
		return `<li><a href="${post.path}.html"> ${post.attributes.title} - ${post.attributes.date}</a></li>`;
	})
	.join('');
	process.stdout.write("\n\tWriting archive.html...");
	fs.writeFileSync(`${config.dev.builddir}/archive.html`, eval('`' + archiveTemplate + '`'));
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
