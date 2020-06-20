<?php
require __DIR__ . '/vendor/autoload.php';

function printArticles()
{
	$articles = glob('articles/*.{md}', GLOB_BRACE);
	natsort($articles);
	$articles = array_slice($articles, 0, 2);
	foreach(array_reverse($articles) as $a) {
		echo "<div class='post'>";
		$article_lines = explode("\n", file_get_contents("$a"));
		echo "<div class='postheading'>";
		echo Parsedown::instance()->text($article_lines[0]);
		echo Parsedown::instance()->text($article_lines[1]);
		unset($article_lines[0]);
		unset($article_lines[1]);
		echo "</div>";
		echo "<hr>";
		$article_lines = array_map(function ($line) {
			if(empty($line))
			{
				return "\r\n";
			}else
			{
				return $line;
			}
		}, $article_lines);
		echo Parsedown::instance()->setBreaksEnabled(true)->text(implode(' ', $article_lines));
		echo "</div>";
	}
}
?>

<html>
<head>
	<meta charset="UTF-8">
	<title>Archie Hilton</title>

	<link rel="stylesheet" href="style/index.css">
	<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet"> 
</head>
<body>
	<header>
		<div style="display: flex; flex-flow: column nowrap">
			<h1 id="title">Archie Hilton</h1>
			<h4 id="subtitle">Student, Developer</h2>
		</div>
	</header>

	<div id="banner"></div>

	<!-- <nav id="topnav"> -->
	<!-- 	<a class="currentLink" href="index.html">Home</a> -->
	<!-- 	<a href="about.html">About</a> -->
	<!-- 	<a href="contact.html">Contact</a> -->
	<!-- 	<a href="http://cv.archiehilton.xyz">CV</a> -->
	<!-- </nav> -->

	<main>
		<div class="horizontal">
			<div id="sidebar">
				<div class="post">
					<div class="postheading">
						<h1>About Me</h1>
					</div>
					<hr>
					<p>Sorry! This website is currently under construction.
					In the meantime, feel free to look at my projects on the right!</p>
				</div>
			</div>
			<div id="articles">
				<?php
				printArticles();
				?>
			</div>
		</div>
	</main>

</body>
</html>
