<?php
phpinfo();
exit;
$hardwares = $bd->get_hardwares();
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:1000px;margin:auto;'>";
foreach ($hardwares['groups'] as $group_id => $group) 
{
	$group_name=$group['name'];
	echo "<div id='$group_id' style='display:inline-table;width:100%;height:20px;background:#dadada;margin:0 0 20px 0;padding:20px 0;'>";
	echo " <div style='width:12%;float:left;margin-left:20px;font-size: 15px;'>Группа:</div>";
	echo " <input onchange=\"ajax_post('hardware_folder_name=$group_id&value='+this.value,'');\" style='width:65%;float:left;font-size: 15px;background:grey;' type=text value='$group_name'>";
	echo " <div style='width:100%;float:left;height:10px;'>&nbsp;</div>";
	foreach ($hardwares['groups'][$group_id]['hardware_sys'] as $hardware_id => $hardware) 
	{
		$hardware_name=$hardware['name'];
		$ks1=$hardware['sync'][1];
		$ks2=$hardware['sync'][2];
		echo "<div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
		if ($hardware['is_in_calculation']==0)
		{
			echo " <div onclick=\"ajax_post('hardware_edit=$hardware_id&value=1','');\" style='cursor:pointer;float:left;width:3%;font-size: 15px;'><img src='img/uncheck.png' height='20px'></div>";
			echo " <input onchange=\"ajax_post('hardware_name=$hardware_id&value='+this.value,'');\" style='width:62%;float:left;font-size: 15px;background:red;' type=text value='$hardware_name'>";
		}	
		else
		{			
			echo " <div onclick=\"ajax_post('hardware_edit=$hardware_id&value=0','');\" style='cursor:pointer;float:left;width:3%;font-size: 15px;'><img src='img/check.png' height='20px'></div>";	
			echo " <input onchange=\"ajax_post('hardware_name=$hardware_id&value='+this.value,'');\" style='width:62%;float:left;font-size: 15px;background:green;' type=text value='$hardware_name'>";
			echo " <div onclick=\"ajax_post('hardware_ks=$hardware_id','ks_$hardware_id');\" style='cursor:pointer;float:left;width:3%;font-size: 15px;'><img src='img/down_arrow_info.png' height='20px'></div>";
		}
		echo " <div id=ks_$hardware_id style='display:block;float:left;width:100%;font-size: 15px;'></div>"; 
		echo " <div style='width:100%;float:left;height:5px;'>&nbsp;</div>";	
	}
	echo " <div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
	echo " <div style='cursor:pointer;float:left;width:3%;font-size: 15px;'>&nbsp</div>";
	echo " <form style='width:100%;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"return ajax_form(this,'');\">";
	echo "  <input type='hidden' name='ajax' value=1>";
	echo "  <input type='hidden' name='hardware_create' value='$group_id'>";
	echo "  <input type='text' name='hardware_name' value='новая фурнитура' style='width:62%;float:left;font-size: 15px;'>";
	echo "  <input type=submit value='Добавить' style='cursor:pointer;float:left;font-size: 15px;background:grey;margin-left:20px;'>";
	echo " </form>";
	echo "</div>";	
}	
echo "</div>";
?>
