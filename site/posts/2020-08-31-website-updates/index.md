---
title: "Website Updates"
date: "2020-07-31 18:30"
---

Recently I've been making some updates to the website, namely **improving the
static site builder** and **overhauling the style**. While I still have to add
some more important things in terms of content, I'd say the site as-is meets my
current standards.

## The Problem

While my old site wasn't the worst ever made, it wasn't particularly great
either. Here are some of the main issues:

* Looked awful on phones
* Style was clunky
* Too much text
* No article archive
* No "about" section

## Addressing the CSS

After some playing around, I found that a lighter, flatter theme offered a much
more professional look. I also switched to using **CSS Grid** instead of my old
system of trying to force **Flex** to do stuff it shouldn't, which gave me a lot
more ability to align things how I wanted.

I then shifted articles to the bottom, links to the opposite side and added a
decently large "About Me" section. At this point, the styling was done, and I
was fairly content with how it turned out.

## The Back-End

You can check out my bootleg static site builder and website on
[GitHub](https://github.com/thytom/archiehilton.xyz).

While I'd built a rudimentary static site builder to build my website, it was
lacking in some functionality. For starters, it would pick the first 10 most
recent articles and just place them on the main page. This is alright for some
like the first post, but realistically is going to cause problems for posts like
this, which is already ~260 words in length, so the first change I made was to
take posts to be displayed on the main page and limit them to ~200 characters,
adding a link to read more.

I then decided to build myself a post archive, so that people could look at
posts older than the most recent 10, as well as have links to standalone pages
for each post.

Finally, I put the body of my about section into its own markdown file and
rendered it separately, putting it into my template html file.

## Conclusion

Overall, I think I've made some drastic improvements over the previous iteration
of this site, adding functionality without sacrificing on speed. I'm
confident that this will create a more comfortable framework to build upon in
future.
