<?php
session_start();
?>
<html>
	<head>
		<link href="/styles/main.css" rel="stylesheet"></link>
	</head>
	<body>
		<div class="d">
			<h1><?php require("include/name.php") ?></h1>
			<h2>A web-based three dimensional chat program...</h2>
		</div>
		<div class="d">
			<h2>Play</h2>
			<form method="GET" action="/load.php">
				<button type="submit">Join the fun</button>
			</form>
		</div>
		<?php require("include/footer.php") ?>
	</body>
</html>
