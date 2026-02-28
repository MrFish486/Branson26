<html>
	<head>
		<link href="/styles/main.css" rel="stylesheet"></link>
	</head>
	<body>
		<div class="d">
			<form method="POST" action="/join.php">
				<a id="lab">Please input your username:</a><br><br><input name="username" type="text" placeholder="Username" required></input>
				<button type="submit">Join</button>
			</form>
			<form method="GET" action="/">
				<button type="submit">Home</button>
			</form>
		</div>
		<?php require("include/footer.php") ?>
	</body>
</html>
