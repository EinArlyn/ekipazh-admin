<?php
//steko_factory: 0504814488
//steko_factory: 0675620096
session_start();  
$path = $_SERVER['DOCUMENT_ROOT'];
require_once('database_pqsql.php');
require_once ('bdmodel.php');
require_once('ajax_controller.php');
$bd=new StekoBD();
echo " 
<!DOCTYPE html>
<html>
 <head>
	<meta charset=\"utf8\"> 	
 </head>
 <body style='overflow-x:hidden;'>
  <link type=\"text/css\" rel=\"stylesheet\" href=\"css/style.css\" />
  <link type=\"text/css\" rel=\"stylesheet\" href=\"js/ajax/ajax.css\" />
  <script type=\"text/javascript\" src=\"js/ajax/ajax.js\"></script>
  <div id=\"view\" style=\"width:1920px;margin:auto; transform: scale(1); transform-origin: left top;-webkit-transform-origin: left top;\">
   <div id='ajax_view_loading' style='display:none;position:absolute;top:400px;left:50%;z-index:1;margin-left:-100px;'><img src='img/Load.gif' width=\"200px\" height=\"200px\"></div>
";
require_once ('menu.php');
if (!isset($bd->base_id))
{
	require_once ('login.php');
}	
if (isset($_SESSION['form_id']))
{
	require_once ($_SESSION['form_id'].'.php');
}	
echo "
  </div> 
  <script type=\"text/javascript\" src=\"js/form.js\"></script>
 </body>
</html>";
?>
