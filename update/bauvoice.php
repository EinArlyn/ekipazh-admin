<?php  
$path = $_SERVER['DOCUMENT_ROOT'];
require_once ('bdmodel.php');
require_once('ajax_controller.php');
$bd=new StekoBD();
?>  
<!DOCTYPE html>
<html>
 <head>
	<meta charset="utf8"> 	
 </head>
 <body style='overflow-x:hidden;'>
  <link type="text/css" rel="stylesheet" href="css/style.css" />
  <link type="text/css" rel="stylesheet" href="js/ajax/ajax.css" />
  <script type="text/javascript" src="js/ajax/ajax.js"></script>
  <div id="view" style="width:1920px;margin:auto; transform: scale(1); transform-origin: left top;-webkit-transform-origin: left top;">
   <div id='ajax_view_loading' style='display:none;position:absolute;top:400px;left:50%;z-index:1;margin-left:-100px;'><img src='Load.gif' width="200px" height="200px"></div>
   <div style="width:100%; background-color:#1F2235;color: #FFFFFF;font-family: MontserratBold;font-size: 90px;line-height: 100px;text-align:center;padding:50px 0;">
Синхронизация баз СТЕКО
   </div>	
   <div style="float:left;width:50%; background-color:#1F2235;color: #FFFFFF;font-family: MontserratBold;font-size: 60px;line-height: 100px;text-align:center;">
Тестовая база
    <div style='float:right;width:230px;height:80px;cursor:pointer;padding:25px' OnClick="if (confirm('Копировать тестовую базу в рабочую?')) ajax_post('update=1','ajax_view');">
     <div style='width:100%;border-radius:80px;background:#E60050;color:#FFFFFF;font-family:MontserratBold;font-size:16px;line-height:80px;text-align:center'>
Синхронизация -> 
     </div>
    </div>                                          
   </div>
   <div style="float:right;width:50%; background-color:#1F2235;color: #FFFFFF;font-family: MontserratBold;font-size: 60px;line-height: 100px;text-align:center;">
Рабочая база
    <div style='float:left;width:230px;height:80px;cursor:pointer;padding:25px' OnClick="if (confirm('Копировать рабочую базу?')) ajax_post('update=0','ajax_view');">
     <div style='width:100%;border-radius:80px;background:#E60050;color:#FFFFFF;font-family:MontserratBold;font-size:16px;line-height:80px;text-align:center'>
<- Синхронизация 
     </div>
    </div>                                          
   </div>
   <div id=ajax_view style='width:100%;font-family: MontserratBold;font-size: 30px;text-align:left;margin-left:50px'>
<?php
foreach ($bd->copy_tables as $table_name)
{
	echo $table_name."<br>";
}
?>   	
   </div>	
  </div> 
  <script type="text/javascript" src="js/form.js"></script>
 </body>
</html>