<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] != 'GET' || !isset($_GET['x']) || !isset($_GET['y']) || !isset($_GET['z']) || !isset($_GET['name'])) {
	echo '{"success":false,"reason":"Bad request"}';
	exit;
}

$username = $_GET['name'] ?: $_SESSION['username'] ?: '';

include('include/user_index.php');

$c = file_get_contents($users_index);

$found = false;
$content = explode("\n", $c);
$product = [];

for ($i = 0; $i < count($content); $i ++) {
	$line = $content[$i];
	if (explode(",", $line)[0] == $username) {
		$found = true;
		$content[$i] = sprintf("%s,%s,%s,%s", $username, $_GET['x'], $_GET['y'], $_GET['z']);
	} else if ($line != "") {
		array_push($product, $line . (($i == count($content) - 1) ? "" : "\n"));
	}
}

if (!$found) {
	echo '{"success":false,"reason":"User not found"}';
	exit;
}

file_put_contents($users_index, implode("\n", $content));

echo '{"success":true,"reason":"","users":[';

foreach ($content as $line) {
	$dat = explode(",", $line);
	if (count($dat) < 4) break;
	if ($line != $content[0]) echo ",";
	echo sprintf('{"name":"%s","x":%s,"y":%s,"z":%s}', $dat[0], $dat[1], $dat[2], $dat[3]);
}

echo ']}';

?>
