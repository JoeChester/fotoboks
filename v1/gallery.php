<?php
include 'paths.php';
$files = array_slice( array_diff(scandir($SAVEPATH, 1), array('.', '..', 'Thumbs.db')) , 0, 5);
foreach ($files as &$value) {
   $value = $SAVEPATH . '/' . $value;
}
unset($value);
print_r(json_encode($files));
?>
