<?php
echo "<div class='nav-panel'>";
//echo "<span id='logo-brand'>Steko Windows Calculator add admin panel</span>";
if (isset($bd->base_id))
{
	echo "
<div class='nav-logout'>
 <span id='nav-logout-button'><img src='./img/logout.png' alt='Выход'><a OnClick=\"ajax_post('logout=1','');\" style='cursor:pointer' id='logout' class='external-link'>Выйти</a></span>
</div>";
	if ($_SESSION['form_id'] == "locales")
		echo "<div class='nav_menu_a' OnClick=\"ajax_post('form_id=locales','');\"'>Локализация</div>";
	else 
		echo "<div class='nav_menu' OnClick=\"ajax_post('form_id=locales','');\"'>Локализация</div>";
	if ($_SESSION['form_id'] == "profiles")
		echo "<div class='nav_menu_a' OnClick=\"ajax_post('form_id=profiles','');\"'>Профильные системы</div>";
	else
		echo "<div class='nav_menu' OnClick=\"ajax_post('form_id=profiles','');\"'>Профильные системы</div>";
	if ($_SESSION['form_id'] == "hardwares")	
		echo "<div class='nav_menu_a' OnClick=\"ajax_post('form_id=hardwares','');\"'>Фурнитурные системы</div>";
	else 
		echo "<div class='nav_menu' OnClick=\"ajax_post('form_id=hardwares','');\"'>Фурнитурные системы</div>";
	if ($bd->factory_base_id == "897")
	{
		if ($_SESSION['form_id'] == "syncbd")	
			echo "<div class='nav_menu_a' OnClick=\"ajax_post('form_id=syncbd','');\"'>Синхронизация</div>";
		else 
			echo "<div class='nav_menu' OnClick=\"ajax_post('form_id=syncbd','');\"'>Синхронизация</div>";
	}	
	if ($_GET['fid'] == "test")
	{
		if ($_SESSION['form_id'] == "test")	
			echo "<div class='nav_menu_a' OnClick=\"ajax_post('form_id=test','');\"'>Тест</div>";
		else 
			echo "<div class='nav_menu' OnClick=\"ajax_post('form_id=test','');\"'>Тест</div>";		
	}		
}
else 
{
	echo "<span id='logo-brand'>Steko Windows Calculator add admin panel</span>";	
}
echo "</div>";	
