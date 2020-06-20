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
	<link rel="stylesheet" type="text/css" media="only screen and (max-device-width: 1000px)" href="mobile.css" />

	<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet"> 
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
	<header>
		<div style="display: flex; flex-flow: column nowrap">
			<h1 id="title">Archie Hilton</h1>
			<h4 id="subtitle">Student, Developer</h2>
		</div>
	</header>

	<div id="banner">
		<a href="https://github.com/thytom"><i class="fa fa-github"></i></a>
		<a href="mailto:archie.hilton1@gmail.com"><i class="fa fa-envelope"></i></a>
	</div>

	<main>
		<div class="horizontal">
			<div id="sidebar">
				<div class="post">
					<div class="postheading">
						<h1>About Me</h1>
					</div> <hr>
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
