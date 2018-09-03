<?php
/***
	* 济南大学信息学院学生信息查询系统
	* (c) TCA & SOIL & HAFRANS ST.
	* @author Hafrans@163.com Ver Alpha
	* 
	*/
    session_start();
    $dbstring = "mysql:host=127.0.0.1;dbname=student";
    $username = "student";
    $passwd = "password";
    $column_name = "xx_stu"

    $msg = array();
    $personal = array();
    /**
     * 判断AJAX数据传输
     */
       if(!isset($_SERVER["HTTP_X_REQUESTED_WITH"]) || strtolower($_SERVER["HTTP_X_REQUESTED_WITH"])<>"xmlhttprequest"){
           @header("Location:/index.html");
       }
		@header("Content-Type: application/json;charset=utf-8"); //HTTP头用于jq返回
    try{
        $data = new PDO($dbstring,$username,$passwd);
        $data->query("SET NAMES UTF8");
    }catch(PDOException $e){
        $msg["status"] = -1;
        $msg["msg"] = $e->getMessage();
        exit(json_encode($msg));
    }
    
    $name = htmlspecialchars(addcslashes($_POST['name'],"\0..\37"));
    $admission = htmlspecialchars(addcslashes($_POST['admission'],"\0..\37"));
    $stu_num = htmlspecialchars(addcslashes($_POST['stunum'],"\0..\37"));

    $pmf = $data->prepare("SELECT * FROM ".$column_name." WHERE name = ? AND admission_num = ? AND stu_num = ?");
    $pmf->bindParam(1,$name,PDO::PARAM_STR);
    $pmf->bindParam(2,$admission,PDO::PARAM_INT);
    $pmf->bindParam(3,$stu_num,PDO::PARAM_INT);


    if($pmf->execute()){
        //ご注意ください
        $arr = $pmf->fetchAll(PDO::FETCH_ASSOC);
        if(count($arr)<>1){
            $msg["status"] = -2;
            $msg["msg"] = "找不到该同学的信息~_(:з」∠)_";
            exit(json_encode($msg));
        }else{
            $body = $arr[0];
            $province = mb_substr($body['location'], 0,2,"utf8");
            $className = $body["class_name"];
            $class_people = $data->query("SELECT COUNT(*) as total FROM ".$column_name." WHERE class_name = '".$className."'");
            $class_people_man = $data->query("SELECT COUNT(*) as total FROM ".$column_name." WHERE class_name = '".$className."' AND sex = '男'");
            $class_people_province = $data->query("SELECT COUNT(*) as total FROM ".$column_name." WHERE class_name = '".$className."' AND location LIKE '%".$province."%' ");
            $class_same_dormitory = $data->query("SELECT name FROM ".$column_name." WHERE dormitory = '".$body['dormitory']."'");

            /**
             * 理应添加缓存
             *
             */
            $personal['roommate'] = $class_same_dormitory->fetchALL(PDO::FETCH_COLUMN,0);
            $personal['total'] = (int)$class_people->fetchColumn(0);
            $personal['male'] = (int) $class_people_man->fetchColumn(0);
            $personal['female'] = $personal['total'] - $personal['male'];
            $personal['same_province'] = (int)$class_people_province->fetchColumn(0);
            $personal['className'] = $className;
            $personal['province'] = $province;
            $personal['bundle'] = $body;
            $personal['status'] = 1;
            $personal['msg'] = "已查找到";
			sleep(1);//造成一种错觉
            exit(json_encode($personal));

        }
    }else{
        $msg["status"] = -1;
        $msg["msg"] = $data->errorInfo();
        exit(json_encode($msg));
    }
