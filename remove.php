<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] != 'GET' || !isset($_GET['name'])) {
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
	} else if (count(explode(",", $line)) > 3) {
		array_push($product, $line . (($i == count($content) - 1) ? "" : "\n"));
	}
}

if (!$found) {
	echo '{"success":false,"reason":"User not found"}';
	exit;
}

file_put_contents($users_index, implode("\n", $product));

echo '{"success":true,"reason":"","users":[';

$cc = count($product) - 2;

for ($i = 0; $i < count($product); $i ++) {
	$line = $product[$i];
	$dat = explode(",", $line);
	error_log(sprintf("%d / %d", $i, count($product)));
	if (count($dat) < 4) {
		$cc --;
		continue;
	}
	echo sprintf('{"name":"%s","x":%s,"y":%s,"z":%s}%s', $dat[0], $dat[1], $dat[2], $dat[3], ($i >= $cc) ? "" : ",");
}

echo ']}';

?>
