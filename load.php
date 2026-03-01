<html>
	<head>
		<title><?php include("include/name.php") ?> - register</title>
		<link href="/styles/main.css" rel="stylesheet"></link>
	</head>
	<body>
		<div class="d">
			<form method="POST" action="/join.php">
				<a id="lab">Please input your username and your player color:</a><br><br>
				<div class="j">
					<input name="username" type="text" placeholder="Username" required></input>
					<input name="color" type="color"></input>
					<button type="submit">Join</button>
				</div>
			</form>
			<form method="GET" action="/">
				<button type="submit">Home</button>
			</form>
		</div>
		<?php require("include/footer.php") ?>
	</body>
</html>
