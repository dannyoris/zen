var defaultValue = $("#a1").val();
$(function(){
	var emailReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
	
	//alert(defaultValue);
	var errMsg="Your E-mail!";		
				
				$("#a3").focus(function(){$(this).val("");$("#a3").removeClass("on");});
				$("#a4").focus(function(){$(this).val("");$("#a4").removeClass("on");});
		 		$("#a1").focus(function(){$(this).val("");$("#a1").removeClass("on");});
				
					var data3;
					var btn = $("#a2");
				btn.click(function(){
				
					
					if($("#a4").val()=="")
					{$("#a4").addClass("on");$("#a4").val("Your Name");  return false; }
					
					if($("#a3").val()=="")
					{$("#a3").addClass("on");$("#a3").val("Your Mobile Number");  return false; }
					
					
								   
					if($("#a1").val()=="")
					{
						$("#a1").addClass("on");
						$("#a1").val("Your E-mail");
						return false;
					}
					
					var myReg = emailReg; 
					if(myReg.test($('#a1').val())){
					//alert(8);
					}
					else
					{
						return false;
					}
					
				
					
				data3 = $('#a1').serialize();
				//alert(data3);
				$.ajax({
					   type: "POST",
					   url: "enewsletter.php",
					   data: {email:$("#a1").val(),number:$("#a3").val(),name:$("#a4").val()},
					   success: function(result){
					   		//alert(result);
						   //subscribeTrigger.trigger('click');
						   (result=="Ok") ? popupSubscribe("#pop") : '';
						   (result=="Been") ? popupSubscribe("#pop2") : '';
						   (result=="Wrong") ? popupSubscribe("#pop3") : '';
					   }
					});
				});	
});//$(function() end
function popupSubscribe(_id){
	$("#pop").hide();
	$(_id).animate({height:'show'},800,function(){}).delay(3000).animate({height:'hide'},800,function(){																									  		//调用重新初始化文本内容的方法
		initSubsribeInput();																								  	});
}

//定义重新初始化Subscribe文本内容的方法
function initSubsribeInput(){
	$("#a1").val("Your E-mail");	
}
