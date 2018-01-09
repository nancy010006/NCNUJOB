<?php
 // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
//data table做表格的ajax處理
$requestData= $_REQUEST;
// print_r($requestData);
require("../model/userModel.php");
if(!($json=file_get_contents("php://input")) && !isset($_GET["act"])) {
        exit(0);
}
//將json解開
$data=json_decode($json,true);
//如果有的話就是post傳json 沒有就是get
if(file_get_contents("php://input")){
        $act =$data["act"];
        if(@$requestData['data']){
            $data=$requestData['data'];
            // print_r($data);
            $act=$requestData['act'];
        }
}
else{
        $act=$_GET["act"];
}
switch($act) {
        case 'getUser':
            if(@$_SESSION["user"])
                echo @$_SESSION["user"];
            else
                echo "訪客";
            break;
        case 'logout':
            $_SESSION["user"]="";
            break;
        case "adduser":
            $result["status"]= addUser($data);
            switch ($result["status"]) {
                case '200':
                    $result["msg"] = "註冊成功";
                    break;
                case '400':
                    $result["msg"] = "帳號重複";
                    break;
                case '501':
                    $result["msg"] = "發生未預期的錯誤 請聯絡管理員";
                    break;
            }
            echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
            break;
        case "addResume":
            $result["status"]= addResume($data);
            switch ($result["status"]) {
                case '200':
                    $result["msg"] = "新增成功";
                    break;
                case '400':
                    $result["msg"] = "履歷重複";
                    break;
                case '501':
                    $result["msg"] = "發生未預期的錯誤 請聯絡管理員";
                    break;
            }
            echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
            break;
        case "getOneResume":
            $result= getOneResume($data);
            echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
            // echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
            break;
        // case "deleteUser":
        //         $table=array();
        //         $alldata = @$data[1];
        //         $result = array();
        //         $status["status"]= deleteUser($alldata);
        //         switch ($status["status"]) {
        //             case '200':
        //                 $status["messege"] = "刪除成功";
        //                 break;
        //             case '501':
        //                 $status["messege"] = "發生未預期的錯誤 請聯絡管理員";
        //                 break;
        //         }
        //         array_push($result, $status);
        //         echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
        //         break;
        // case "getUser":
        //         $alldata = @$data[1];
        //         $result= getUser($alldata);
        //         echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
        //         // echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
        //         break;
        case "login":
            $result= login($data);
            if(is_array($result)){
                $result["status"]=200;
            }
            else{
                switch ($result) {
                    case '400':
                        $result ="";
                        $result["status"]=400;
                        $result["msg"]="密碼錯誤";
                        break;
                    case '401':
                        $result ="";
                        $result["status"]=401;
                        $result["msg"]="無此帳號";
                        break;
                    case '501':
                        $result ="";
                        $result["status"]=501;
                        $result["msg"]="發生未預期的錯誤 請聯絡管理員";
                        break;
                }
            }
            // print_r($result);
            echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
            break;
        case "fblogin":
            $result= fblogin($data);
            if(is_array($result)){
                $result["status"]=200;
            }
            else{
                switch ($result) {
                    case '401':
                        $result ="";
                        $result["status"]=401;
                        $result["msg"]="新會員註冊";
                        break;
                    case '501':
                        $result ="";
                        $result["status"]=501;
                        $result["msg"]="發生未預期的錯誤 請聯絡管理員";
                        break;
                }
            }
            // print_r($result);
            echo (json_encode($result, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT));
            break;
        // case "getfrontuser":
        //         echo getfrontuser();
        //         break;
        // case "logout":
        //         logout();
        //         break;
        // case "DataTablegetUser":
        //         if ($table=DataTablegetUser($requestData)) {
        //             if(count($table['data'])==0){
        //                     array_unshift($table,array('status' => 204));
        //                     echo json_encode($table, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT);
        //             }else{
        //                 array_unshift($table,array('status' => 200));
        //                 echo json_encode($table, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT);
        //             }
        //         } else {
        //                 $table=['status' => 500];
        //                 echo json_encode($table, JSON_UNESCAPED_UNICODE,JSON_FORCE_OBJECT);
        //         }
        //         break;
        default:
}
mysqli_close($conn);
?>
