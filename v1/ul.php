<?php
include 'paths.php';
$img = $_POST['imgBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);
//saving
$timestamp = time();
$fileName = $SAVEPATH . "\\photo" . strval($timestamp) . ".png";
file_put_contents($fileName, $fileData);
?>
