/**
 * Javascript
 * (c)2016 TCA ALL RIGHTS RESERVED
 * hafrans@163.com
 */




$("#submit").click(function(){
	//console.log($("#pform").serialize());

	if($("#name").val().length < 1){
		$("#name").parent().attr("class","form-group has-warning");
		$("#name").prev().html("姓名       (此字段为空哦，请填写~)");
		$("#name").focus();
		return false;
	}else{
		$("#name").parent().attr("class","form-group");
		$("#name").prev().html("姓名");
	}

	if($("#stunum").val().length < 1){
		$("#stunum").parent().attr("class","form-group has-warning");
		$("#stunum").prev().html("学号       (此字段为空哦，请填写~)");
		$("#stunum").focus();
		return false;
	}else{
		$("#stunum").parent().attr("class","form-group");
		$("#stunum").prev().html("学号");
	}

	if($("#admission").val().length < 1){
		$("#admission").parent().attr("class","form-group has-warning");
		$("#admission").prev().html("录取通知书编号       (此字段为空哦，请填写~)");
		$("#admission").focus();
		return false;
	}else{
		$("#admission").parent().attr("class","form-group");
		$("#admission").prev().html("录取通知书编号");
	}


		//ajax transfer

		$.ajax({
			type:"POST",
			url:"./search.php?r="+Math.random(),
			async:true,
			data:$("#pform").serialize(),
			success:showResult,
			beforeSend:function(xhr){
				$("#submit").attr("disabled",true);
				$("#submit").attr("value","查询中……");
				$("#cover").show();
			},
			error:function(xhr,err){
				$("#status").hide();
				$("#message").show();
				$("#message").html(err);
				setTimeout(function(){
					$("#submit").attr("disabled",false);
					$("#submit").attr("value","查询");
					$("#message").hide();
					$("#status").show();
					$("#cover").hide();

				},2000);
			}
		});
});
function updateChart(boy,girl,pro,other,location){
	var ctx = document.getElementById("myChart1").getContext("2d");
	   var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    girl,boy
                ],
                backgroundColor: [
                    "#F7464A",
                    "#5eabd6",
                ],
                label: '男女比例'
            }],
            labels: [
                "女生",
                "男生",
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '班级男女比例'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
	Chart.defaults.responsive = true;
	 p = new Chart(ctx,config);
	/////////////////////////////////////////////////////////////
	   var ctx2 = document.getElementById("myChart2").getContext("2d");
	   var config2 = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    pro,other
                ],
                backgroundColor: [
                    "#FFC870",
                    "#46BFBD",
                ],
                label: '省市'
            }],
            labels: [
                location,
                "其他省份",
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '同省的老乡'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
	Chart.defaults.responsive = true;
  k = new Chart(ctx2,config2);


}
function showResult(body){
	console.log(body);
//	body = JSON.parse(body);
//	console.log(body);
	dd = body;
	if(body.status == -1 || body.status == -2 ){
		$("#status").hide();
		$("#message").show();
		$("#message").html(body.msg);
		setTimeout(function(){
			$("#submit").attr("disabled",false);
			$("#submit").attr("value","查询");
			$("#message").hide();
			$("#status").show();
			$("#cover").hide();
		},2000);
	}else{
		/**
		 * 删除等待层
		 */
			$("#submit").attr("disabled",false);
			$("#submit").attr("value","查询");
			$("#message").hide();
			$("#status").show();
			$("#cover").hide();

		/**
		 * 显示结果层
		 */
		$("#request").hide();
		$("#result_name").html(body.bundle.name);
		$("#result_zy").html(body.bundle.major);
		$("#result_dormitory").html(body.bundle.dormitory);
		$("#result_ren").html(body.bundle.dormitory_size);
		/*
		 * 遍历宿舍
		 */
		var mstring = "";
		for(var i = 0;i<body.roommate.length;i++){
			mstring += body.roommate[i] + " , ";
		}
		console.log(mstring);
		$("#result_tomodati").html(mstring);
		$("#result_class").html(body.className);
		$("#result").show();
		setTimeout(function(){
		updateChart(body.male,body.female,body.same_province,body.total-body.same_province,body.province);
		},500);
//		p.update(200);
//		k.update(200);

	}
}