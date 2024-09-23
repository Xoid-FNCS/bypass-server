<?php
$url = $_GET['url'];

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    die("Invalid URL");
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);
curl_close($ch);

header("Content-Type: text/html");
echo $response;
?>
