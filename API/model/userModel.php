<?php
session_start();
require("../../dbconnect.php");
function getUser($account){
    global $conn;
    $sql = "select name from user where account = '$account'";
    $result = mysqli_fetch_assoc(mysqli_query($conn,$sql));
    return $result["name"];
}
function addUser($data) {
    global $conn;
    $sql = "insert into user (";
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act")
            $sql .= $key .",";
    }
    $sql = substr($sql,0,-1);
    $sql .=") values(";
    $data["pwd"]=md5($data["pwd"]);
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act")
            $sql .= '"'.$value.'"' .",";
    }
    $sql = substr($sql,0,-1);
    $sql .=")";
    // print($sql);
    mysqli_query($conn,$sql);
    $result = mysqli_error($conn);
    $account = $data["account"];
    if(!$result)
        return 200;
    else if($result =="Duplicate entry '$account' for key 'PRIMARY'")
        return 400;
    else
        return 501;
}
function addResume($data) {
    global $conn;
    $sql = "insert into resume (";
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act")
            $sql .= $key .",";
    }
    $sql .="uid";
    $sql .=") values(";
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act")
            $sql .= '"'.$value.'"' .",";
    }
    if(!@$_SESSION["user"])
        return 401;
    $uid = $_SESSION["user"];
    $sql .="'$uid'";
    // $sql = substr($sql,0,-1);
    $sql .=")";
    // print($sql);
    mysqli_query($conn,$sql);
    $result = mysqli_error($conn);
    if(!$result)
        return 200;
    else if($result =="Duplicate entry '$id' for key 'PRIMARY'")
        return 400;
    else
        return 501;
}
// function getUser($alldata){
//         $table = "user";
//         $option = array("account","hospital","phone");
//         $result = select($table,$option,0,0,0,0);
//         $count = count($result);
//         $json=array();
//         if($count>0){
//                 $json["status"]=200;
//                 $json["query"]=$result;
//         }else if($count==0){
//                 $json["status"]=500;
//                 $json["query"]="無資料";
//         }else{
//                 $json["status"]=501;
//                 $json["query"]="發生未預期的錯誤";
//         }
//         return $json;
// }
function login($data){
        global $conn;
        $json=array();
        $pwd = md5(mysqli_real_escape_string($conn,$data["pwd"]));
        $account = mysqli_real_escape_string($conn,$data["account"]);
        $sql = "select name,permission,pwd from user where account = '$account'";
        $result = mysqli_query($conn,$sql);
        $num = $result->num_rows; 
        $result = mysqli_fetch_assoc($result);
        // print_r($result);
        if($result&&$result["pwd"]==$pwd){
            unset($result["pwd"]);
            $_SESSION["user"]=$account;
            return $result;
        }else if($num==0){
            return 401;
        }else if($num==1){
            return 400;
        }else{
            return 501;
        }
}
function fblogin($data){
        global $conn;
        $json=array();
        $account = mysqli_real_escape_string($conn,$data["account"]);
        $sql = "select * from user where account = '$account'";
        $result = mysqli_query($conn,$sql);
        $num = $result->num_rows;
        $result = mysqli_fetch_assoc($result);
        // print_r($result);
        if($num==1){
            $result = fbOlduser($data);
        }else if($num==0){
            $result = fbNewuser($data);
        }else{
            return 501;
        }
        unset($result["pwd"]);
        return $result;
}
function fbNewuser($data) {
    global $conn;
    $sql = "insert into user (";
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act")
            $sql .= $key .",";
    }
    $sql = substr($sql,0,-1);
    $sql .=") values(";
    // $data["pwd"]="fblogin";
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act")
            $sql .= '"'.$value.'"' .",";
    }
    $sql = substr($sql,0,-1);
    $sql .=")";
    // print($sql);
    mysqli_query($conn,$sql);
    $result = mysqli_error($conn);
    // $account = $data["account"];
    // $pwd = $data["pwd"];
    // $name = $data["name"];
    // $sex = $data["sex"];
    // $birthday = $data["birthday"];
    // $department = $data["department"];
    // $phone = $data["phone"];
    // $email = $data["email"];
    // $resume = $data["resume"];
    // $permission = $data["permission"];
    $account = $data["account"];
    if(!$result){
        $sql = "select * from user where account = '$account'";
        $result = mysqli_query($conn,$sql);
        $result = mysqli_fetch_assoc($result);
        return $result;
    }
    else if($result =="Duplicate entry '$account' for key 'PRIMARY'")
        return 400;
    else
        return 501;
}
function fbOlduser($data) {
    global $conn;
    $sql = "update user set ";
    foreach ($data as $key => $value) {
        $data[$key] = mysqli_real_escape_string($conn,$value);
        if($key!="act" && $key!="account")
            $sql .= $key ."='" .$value."',";
    }
    $sql = substr($sql,0,-1);
    $sql .=" ";
    $account = $data["account"];
    $sql .="where account = '$account'";
    // print($sql);
    mysqli_query($conn,$sql);
    $result = mysqli_error($conn);
    $account = $data["account"];
    if(!$result){
        $sql = "select * from user where account = '$account'";
        $result = mysqli_query($conn,$sql);
        $result = mysqli_fetch_assoc($result);
        return $result;
    }
    else if($result =="Duplicate entry '$account' for key 'PRIMARY'")
        return 400;
    else
        return 501;
}
function getOneResume($data){
    global $conn;
    $user = $_SESSION["user"];
    $sql = "select * from resume where id ='$user'";
    // print_r($sql);
    $result = mysqli_query($conn,$sql);
    $dbData = array();
    while($rs = mysqli_fetch_assoc($result)){
        // print_r($rs);
        array_push($dbData, $rs);
    }
    return $dbData;
}
// function deleteUser($alldata){
//     global $conn;
//     $sql = "delete from user where 1=0 ";
//     foreach ($alldata["id"] as $key => $value) {
//         $sql .= "or Account = '$value' ";
//     }
//     if(mysqli_query($conn,$sql)){
//         return 200;
//     }else{
//         return 501;
//     }
// }
// function DataTablegetUser($requestData) {
//         global $conn;
//         $tablename='user';
//         /***本方法有資料庫權限可使用****/
//         // $columns = array();
//         //取欄位名稱
//         // $sql = "SELECT COLUMN_NAME,ORDINAL_POSITION,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '".$tablename."'";
//         // $query=mysqli_query($conn, $sql) or die("employee-grid-data.php: get employees");
//         // //id不排
//         // // $row = mysqli_fetch_array($query);
//         // while($row = mysqli_fetch_array($query)){
//         //     if($row[0]!="day")
//         //     $columns[] =$row[0];
//         // }
//         /******************************/
//         // print_r($columns);
//         /***無資料庫權限使用**********/
//         $columns =Array
//         ("Name","Account","Phone","Hospital");
//         /*******************************/
//         $sql = "SELECT * ";
//         $sql.=" FROM ".$tablename."";
//         $query=mysqli_query($conn, $sql) or die("employee-grid-data.php: get employees");
//         $totalData = mysqli_num_rows($query);
//         $totalFiltered = $totalData;  // when there is no search parameter then total number rows = total number filtered rows.
//         $sql = "SELECT ".$columns[0];
//         for ($i=1; $i <count($columns); $i++) { 
//             $sql.=", ".$columns[$i];
//         }
//         $sql.=" FROM ".$tablename." WHERE 1=1 ";
//         // echo $sql;
//         // $startday = $requestData['data'][1]['startday'];
//         // $endday = $requestData['data'][1]['endday'];
//         //         if(!empty($startday)&&empty($endday)){
//         //                $sql .= "and writetime >= '$startday' ";
//         //         }else if(empty($startday)&&!empty($endday)){
//         //                $sql .= "and writetime <= '$endday' ";
//         //         }else if(!empty($startday)&&!empty($endday)){
//         //                $sql .= "and writetime >= '$startday' and writetime <= '$endday' ";
//         //         }else{
//         //         }
//         //         // print_r($requestData['search']);
//         if( !empty($requestData['search']['value']) ) {   // if there is a search parameter, $requestData['search']['value'] contains search parameter
//             $sql.=" AND ( ".$columns[0]." LIKE '%".$requestData['search']['value']."%' ";
//             for ($i=1; $i <count($columns)-1; $i++) { 
//                 $sql.=" OR ".$columns[$i]." LIKE '%".$requestData['search']['value']."%' ";
//             }
//             $sql.=" OR ".$columns[$i]." LIKE '%".$requestData['search']['value']."%' )";
//             // $sql.=" OR writetime LIKE '".$requestData['search']['value']."%' ";

//             // $sql.=" OR height LIKE '".$requestData['search']['value']."%' )";
//             // $sql.=" OR weight LIKE '".$requestData['search']['value']."%' )";
//         }
//         // if(!empty($requestData['columns'][2]['search']['value']) )
//                 // $sql.=" AND ".$columns[1]." LIKE '%".$requestData['columns'][2]['search']['value']."' ";
//         // print_r($column);
//         for ($i=1; $i <count($columns)+1 ; $i++) { 
//             if( isset($requestData['columns'][$i]['search']['value']) ){   //name
//                 $sql.=" AND ".$columns[$i-1]." LIKE '%".$requestData['columns'][$i]['search']['value']."%' ";
//             }
//         }
//         // echo $sql;
//         $query=mysqli_query($conn, $sql) or die("employee-grid-data.php: get employees");
//         $totalFiltered = mysqli_num_rows($query); // when there is a search parameter then we have to modify total number filtered rows as per search result. 
//         // $sql.=" ORDER BY ". $columns[0]."   asc  LIMIT 0 ,10   ";
//         // echo $sql;
//         if($requestData['length']!=-1){
//             if($requestData['order'][0]['column']==0)
//                 $sql.=" ORDER BY ". $columns[$requestData['order'][0]['column']]."   ".$requestData['order'][0]['dir']."  LIMIT ".$requestData['start']." ,".$requestData['length']."   ";
//             else{
//                 $sql.=" ORDER BY ". $columns[$requestData['order'][0]['column']-1]."   ".$requestData['order'][0]['dir']."  LIMIT ".$requestData['start']." ,".$requestData['length']."   ";
//             }
//         }
//         else
//             $sql.=" ORDER BY ". $columns[$requestData['order'][0]['column']-1]."   ".$requestData['order'][0]['dir'];
//         // echo $columns[$requestData['order'][0]['column']-1];
//         // echo $sql;
//         // print_r($requestData);
//         // echo $columns[$requestData['order'][0]['column']-1];
//         /* $requestData['order'][0]['column'] contains colmun index, $requestData['order'][0]['dir'] contains order such as asc/desc  */    
//         $query=mysqli_query($conn, $sql) or die("employee-grid-data.php: get employees");
//         mysqli_close($conn);
//         $data = array();
//         while( $row=mysqli_fetch_array($query) ) {  // preparing an array
//             $nestedData=array(); 
//             for ($i=0; $i <count($columns); $i++) { 
//                 $nestedData[] = $row[$columns[$i]];
//             }
//             $data[] = $nestedData;
//         }
//         $json_data = array(
//                     "draw"            => intval( $requestData['draw'] ),

//                     // "draw"            => intval( 2 ),   // for every request/draw by clientside , they send a number as a parameter, when they recieve a response/data they first check the draw number, so we are sending same number in draw. 
//                     "recordsTotal"    => intval( $totalData ),  // total number of records
//                     "recordsFiltered" => intval( $totalFiltered ), // total number of records after searching, if there is no searching then totalFiltered = totalData
//                     "data"            => $data   // total data array
//                     );
//         return $json_data;
//         // return json_encode($table, JSON_FORCE_OBJECT);
// }
// function getfrontuser(){
//         return $_SESSION["user"];
// }
// function logout(){
//         return $_SESSION["user"]="";
// }
?>
