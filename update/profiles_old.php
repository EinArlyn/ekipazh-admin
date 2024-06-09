<?php
$profiles=$bd->get_profiles();
//var_dump($profiles);
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:100%;'>";
echo "<div class=profiles id=profile_groups style='float:left;width:100%;background-color:#1F2235;color: #FFFFFF;font-family: MontserratBold;font-size: 50px;'>";
echo "<br>";
foreach ($profiles['groups'] as $group_id => $group) 
{
	$group_name=$group['name'];
	echo "<div style='width:12%;float:left;margin-left:20px;font-size: 30px;'>Группа:</div>";
	echo "<input onchange=\"ajax_post('profile_folder_name=$group_id&value='+this.value,'');\" style='width:65%;float:left;font-size: 30px;background:grey;' type=text value='$group_name'><br>";
	foreach ($profiles['groups'][$group_id]['profile_sys'] as $profile_id => $profile) 
	{
		$profile_name=$profile['name'];
		echo "<div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
		if ($profile['is_editable']==0)
		{
			echo "<div style='cursor:pointer;float:left;width:6%;font-size: 30px;color:red' onclick=\"ajax_post('profile_edit=$profile_id&value=1','');\"><img src='img/uncheck.png' height=\"40px\"></div>";
			echo "<input onchange=\"ajax_post('profile_name=$profile_id&value='+this.value,'');\" style='width:59%;float:left;font-size: 30px;background:red;' type=text value='$profile_name'>";
		}	
		else
		{
			echo "<div style='cursor:pointer;float:left;width:6%;font-size: 30px;color:green' onclick=\"ajax_post('profile_edit=$profile_id&value=0','');\"><img src='img/check.png' height=\"40px\"></div>";	
			echo "<input onchange=\"ajax_post('profile_name=$profile_id&value='+this.value,'');\" style='width:59%;float:left;font-size: 30px;background:green;' type=text value='$profile_name'>";			
		}	
		echo "<br>";
	}
	echo "<div style='width:12%;float:left;margin-left:20px;'>&nbsp;</div>";
	echo "<div style='cursor:pointer;float:left;width:6%;font-size: 30px;'>&nbsp</div>";
	echo "<form style='width:100%;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"return ajax_form(this,'');\">";
	echo "<input type='hidden' name='ajax' value=1>";
	echo "<input type='hidden' name='profile_create' value='$group_id'>";
	echo "<input type='text' name='profile_name' value='новая профильная система' style='width:59%;float:left;font-size: 30px;'>";
	echo "<input type=submit value='Добавить' style='cursor:pointer;float:left;font-size: 30px;background:grey;margin-left:20px;'>";
	echo "</form>";
	echo "<br>";					
}
echo "</div>";
echo "</div>";
?>