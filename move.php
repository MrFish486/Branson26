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
		$content[$i] = sprintf("%s,%s,%s,%s,%s", $username, $_GET['x'], $_GET['y'], $_GET['z'], explode(",", $line)[4]);
	} else if (count(explode(",", $line)) > 4) {
		array_push($product, $line . (($i == count($content) - 1) ? "" : "\n"));
	}
}

if (!$found) {
	echo '{"success":false,"reason":"User not found"}';
	exit;
}

file_put_contents($users_index, implode("\n", $content));

echo '{"success":true,"reason":"","users":[';

$cc = count($product) - 2;

for ($i = 0; $i < count($product); $i ++) {
	$line = $product[$i];
	$dat = explode(",", $line);
	error_log(sprintf("%d / %d", $i, count($product)));
	if (count($dat) < 5) {
		$cc --;
		continue;
	}
	echo sprintf('{"name":"%s","x":%s,"y":%s,"z":%s,"color":"%s"}%s', $dat[0], $dat[1], $dat[2], $dat[3], $dat[4], ($i >= $cc) ? "" : ",");
}

echo ']}';

?>
