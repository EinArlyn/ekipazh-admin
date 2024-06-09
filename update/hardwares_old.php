<?php
$hardwares = $bd->get_hardwares();
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:100%;background-color:#1F2235;color: #FFFFFF;font-family: MontserratBold;font-size: 30px;'>";
echo "<div id=hardwares_groups style='float:left;width:100%;background-color:#1F2235;color: #FFFFFF;font-family: MontserratBold;font-size: 50px;'>";
echo "<br>";
foreach ($hardwares['groups'] as $group_id => $group) 
{
	$group_name=$group['name'];
	echo "<div style='width:12%;float:left;margin-left:20px;font-size: 30px;'>Группа:</div>";
	echo "<input onchange=\"ajax_post('hardware_folder_name=$group_id&value='+this.value,'');\" style='width:65%;float:left;font-size: 30px;background:grey;' type=text value='$group_name'><br>";
	foreach ($hardwares['groups'][$group_id]['hardware_sys'] as $hardware_id => $hardware) 
	{
		$hardware_name=$hardware['name'];
		echo "<div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
		if ($hardware['is_in_calculation']==0)
		{
			echo "<div onclick=\"ajax_post('hardware_edit=$hardware_id&value=1','');\" style='cursor:pointer;float:left;width:3%;font-size: 30px;'><img src='img/uncheck.png' height=\"40px\"></div>";
			echo "<input onchange=\"ajax_post('hardware_name=$hardware_id&value='+this.value,'');\" style='width:62%;float:left;font-size: 30px;background:red;' type=text value='$hardware_name'>";
		}	
		else
		{
			echo "<div onclick=\"ajax_post('hardware_edit=$hardware_id&value=0','');\" style='cursor:pointer;float:left;width:3%;font-size: 30px;'><img src='img/check.png' height=\"40px\"></div>";	
			echo "<input onchange=\"ajax_post('hardware_name=$hardware_id&value='+this.value,'');\" style='width:62%;float:left;font-size: 30px;background:green;' type=text value='$hardware_name'>";			
		}	
		echo "<br>";
	}
	echo "<div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
	echo "<div style='cursor:pointer;float:left;width:3%;font-size: 30px;'>&nbsp</div>";
	echo "<form style='width:100%;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"return ajax_form(this,'');\">";
	echo "<input type='hidden' name='ajax' value=1>";
	echo "<input type='hidden' name='hardware_create' value='$group_id'>";
	echo "<input type='text' name='hardware_name' value='новая фурнитура' style='width:62%;float:left;font-size: 30px;'>";
	echo "<input type=submit value='Добавить' style='cursor:pointer;float:left;font-size: 30px;background:grey;margin-left:20px;'>";
	echo "</form>";
	echo "<br>";								
}	
echo "</div>";
echo "</div>";
?>
