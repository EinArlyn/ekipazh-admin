<?php
//steko_factory: 0504814488
//steko_factory: 0675620096
set_time_limit(20000);
ini_set('memory_limit', '512M');
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
  <div class=\"loader-wrapper\" style=\"display: none;\"><div id=\"logo-loader\"></div></div>
  <div id='ajax_loading' style='display:none;position:absolute;top:300px;left:50%;z-index:1;margin-left:-50px;'><img src='img/Load.gif' width=\"100px\" height=\"100px\"></div>";
echo "<nav>";
require_once ('nav_menu.php');
echo "</nav>";
echo "<main class=\"load-content\" style='max-height:88%;overflow-y: scroll;'>";
if (!isset($bd->base_id))
{
	require_once ('login1.php');
}
if (!isset($_SESSION['form_id']))
	$_SESSION['form_id'] = "profiles";
require_once ($_SESSION['form_id'].'.php');
echo "</main>";
echo "<footer class=\"load-content\"><div id='footer-text'>2020</div></footer>";
echo "    
 </body>
</html>";
?>
