<?php
$profiles=$bd->get_profiles();
//var_dump($profiles);
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:1000px;margin:auto;'>";
foreach ($profiles['groups'] as $group_id => $group) 
{
	$group_name=$group['name'];
	echo "<div id='$group_id' style='display:inline-table;width:100%;height:20px;background:#dadada;margin:0 0 20px 0;padding:20px 0;'>";
	echo " <div style='width:12%;float:left;margin-left:20px;font-size: 15px;'>Группа:</div>";
	echo " <input onchange=\"ajax_post('profile_folder_name=$group_id&value='+this.value,'');\" style='width:65%;float:left;font-size: 15px;background:grey;' type=text value='$group_name'>";
	echo " <div style='width:100%;float:left;height:10px;'>&nbsp;</div>";
	foreach ($profiles['groups'][$group_id]['profile_sys'] as $profile_id => $profile) 
	{
		$profile_name=$profile['name'];
		echo "<div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
		if ($profile['is_editable']==0)
		{
			echo "<div style='cursor:pointer;float:left;width:3%;font-size: 15px;color:#ff643a' onclick=\"ajax_post('profile_edit=$profile_id&value=1','');\"><img src='img/uncheck.png' height='20px'></div>";
			echo "<input onchange=\"ajax_post('profile_name=$profile_id&value='+this.value,'');\" style='width:62%;float:left;font-size: 15px;background:#ff643a;' type=text value='$profile_name'>";
		}	
		else
		{
			echo "<div style='cursor:pointer;float:left;width:3%;font-size: 15px;color:green' onclick=\"ajax_post('profile_edit=$profile_id&value=0','');\"><img src='img/check.png' height='20px'></div>";	
			echo "<input onchange=\"ajax_post('profile_name=$profile_id&value='+this.value,'');\" style='width:62%;float:left;font-size: 15px;background:green;' type=text value='$profile_name'>";			
		}	
		echo "<div style='width:100%;float:left;height:5px;'>&nbsp;</div>";
	}
	echo " <div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
	echo " <div style='cursor:pointer;float:left;width:3%;font-size: 15px;'>&nbsp</div>";
	echo " <form style='width:100%;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"return ajax_form(this,'');\">";
	echo "  <input type='hidden' name='ajax' value=1>";
	echo "  <input type='hidden' name='profile_create' value='$group_id'>";
	echo "  <input type='text' name='profile_name' value='новая профильная система' style='width:62%;float:left;font-size: 15px;'>";
	echo "  <input type=submit value='Добавить' style='cursor:pointer;float:left;font-size: 15px;background:grey;margin-left:20px;'>";
	echo " </form>";
	echo "</div>";		
}
echo "</div>";
?>