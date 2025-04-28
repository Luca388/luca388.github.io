<?php
// 방어 없이 바로 GET 파라미터로 파일 읽기
if (isset($_GET['file'])) {
    $filename = $_GET['file'];
    echo file_get_contents($filename);
} else {
    echo "file 파라미터가 필요합니다.";
}
?>
