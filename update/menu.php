<?php
$profilesstyle='style="cursor:pointer;width:max-content;background:black;padding:20px 15px;margin:5px;"';
$hardwaresstyle='style="cursor:pointer;width:max-content;background:black;padding:20px 15px;margin:5px;"';
$localesstyle='style="cursor:pointer;width:max-content;background:black;padding:20px 15px;margin:5px 5px 5px 30px;"';
if (isset($_SESSION['form_id']))
{
	if ($_SESSION['form_id'] == "profiles")
		$profilesstyle='style="cursor:pointer;width:max-content;background:black;padding:20px 15px;margin:5px;color:#ff643a;"';
	if ($_SESSION['form_id'] == "hardwares")
		$hardwaresstyle='style="cursor:pointer;width:max-content;background:black;padding:20px 15px;margin:5px;color:#ff643a;"';
	if ($_SESSION['form_id'] == "locales")
		$localesstyle='style="cursor:pointer;width:max-content;background:black;padding:20px 15px;margin:5px 5px 5px 30px;color:#ff643a;"';	
}
echo "<div class=menu>";
if (isset($bd->base_id))
{
echo "
 <div style='width:100%;'>
  <div style='float:left;width:max-content;padding:30px;'></div>
  <div OnClick=\"ajax_post('logout=1','');\" style='float:right;cursor:pointer;background:#ff643a;padding:0 20px;margin:30px;border-radius:15px;'>Выход</div>
 </div>"; 
echo " <div style='display:flex;width:100%;'>";
echo "  <div OnClick=\"ajax_post('form_id=locales','');\" $localesstyle '>Локализация</div>";
echo "  <div OnClick=\"ajax_post('form_id=profiles','');\" $profilesstyle >Профильные системы</div>";
echo "  <div OnClick=\"ajax_post('form_id=hardwares','');\" $hardwaresstyle>Фурнитурные системы</div>";
echo " </div>";
}
echo "</div>";	
