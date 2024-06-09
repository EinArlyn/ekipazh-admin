<?php
$locales = $bd->get_locales();
//var_dump($locales);
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:100%;'>";
echo "<div id=locales class=locales style='float:left;'>";
echo "<div style='width:100%;margin:50px 0 200px 0;'>";
echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>Выберите:</div>";
echo "<select style='width:65%;float:left;font-size: 30px;background:grey;' onchange=\"ajax_post('select_locales='+this.value+'&name='+this[this.selectedIndex].text,'');\">";
foreach ($locales as $id => $locales_group) 
{
	$locales_name=$locales_group['name'];
	$table_name=$locales_group['table'];
	if (!isset($_SESSION['locales_table']))
		$_SESSION['locales_table']=$table_name;
	if ($_SESSION['locales_table']==$table_name)
		echo "<option style='font-size: 30px;' selected value='$table_name'>$locales_name</option>";
	else
		echo "<option style='font-size: 25px;' value='$table_name'>$locales_name</option>";
}
echo "</select>";
echo "<input id='search' style='width:10%;float:left;margin-left:20px;font-size: 30px;' value''>";
echo "</div>";
foreach ($locales as $id => $locales_group) 
{
	if ($_SESSION['locales_table']==$locales_group['table'])
	{
		foreach ($locales_group['locales'] as $el_id => $el_arr)
		{
			echo "<form style='width:100%;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"return ajax_form(this,'');\">";
			echo "<input type='hidden' name='ajax' value=1>";
			echo "<input type='hidden' name='set_locales' value='".$locales_group['table']."'>";
			echo "<input type='hidden' name='element' value='".$el_id."'>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>base_name</div>";
			echo "<input name=base_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['base_name']."' placeholder='base_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>ru_name</div>";
			if (empty($el_arr['ru_name']))
				echo "<input name=ru_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['ru_name']."' placeholder='ru_name'><br>";
			else				
				echo "<input name=ru_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['ru_name']."' placeholder='ru_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>en_name</div>";
			if (empty($el_arr['en_name']))
				echo "<input name=en_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['en_name']."' placeholder='en_name'><br>";
			else   
				echo "<input name=en_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['en_name']."' placeholder='en_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>ua_name</div>";				
			if (empty($el_arr['ua_name']))
				echo "<input name=ua_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['ua_name']."' placeholder='ua_name'><br>";
			else   
				echo "<input name=ua_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['ua_name']."' placeholder='ua_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>de_name</div>";				
			if (empty($el_arr['de_name']))
				echo "<input name=de_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['de_name']."' placeholder='de_name'><br>";
			else   
				echo "<input name=de_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['de_name']."' placeholder='de_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>ro_name</div>";				
			if (empty($el_arr['ro_name']))
				echo "<input name=ro_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['ro_name']."' placeholder='ro_name'><br>";
			else   
				echo "<input name=ro_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['ro_name']."' placeholder='ro_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>it_name</div>";				
			if (empty($el_arr['it_name']))
				echo "<input name=it_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['it_name']."' placeholder='it_name'><br>";
			else   
				echo "<input name=it_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['it_name']."' placeholder='it_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>pl_name</div>";				
			if (empty($el_arr['pl_name']))
				echo "<input name=pl_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['pl_name']."' placeholder='pl_name'><br>";
			else   
				echo "<input name=pl_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['pl_name']."' placeholder='pl_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>bg_name</div>";				
			if (empty($el_arr['bg_name']))
				echo "<input name=bg_name style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['bg_name']."' placeholder='bg_name'>";
			else   
				echo "<input name=bg_name style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['bg_name']."' placeholder='bg_name'>";
			if (isset($el_arr['base_description']))
			{
				echo "<div style='width:100%;height:10px;'>&nbsp</div><br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>base_info</div>";
				echo "<input name=base_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['base_description']."' placeholder='base_description'>";
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>ru_info</div>";
				if (empty($el_arr['ru_description']))
					echo "<input name=ru_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['ru_description']."' placeholder='ru_description'>";
				else				
					echo "<input name=ru_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['ru_description']."' placeholder='ru_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>en_info</div>";
				if (empty($el_arr['en_description']))
					echo "<input name=en_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['en_description']."' placeholder='en_description'>";
				else				
					echo "<input name=en_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['en_description']."' placeholder='en_description'>";
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>ua_info</div>";
				if (empty($el_arr['ua_description']))
					echo "<input name=ua_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['ua_description']."' placeholder='ua_description'>";
				else				
					echo "<input name=ua_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['ua_description']."' placeholder='ua_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>de_info</div>";
				if (empty($el_arr['de_description']))
					echo "<input name=de_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['de_description']."' placeholder='de_description'>";
				else				
					echo "<input name=de_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['de_description']."' placeholder='de_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>ro_info</div>";
				if (empty($el_arr['ro_description']))
					echo "<input name=ro_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['ro_description']."' placeholder='ro_description'>";
				else				
					echo "<input name=ro_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['ro_description']."' placeholder='ro_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>it_info</div>";
				if (empty($el_arr['it_description']))
					echo "<input name=it_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['it_description']."' placeholder='it_description'>";
				else				
					echo "<input name=it_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['it_description']."' placeholder='it_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>pl_info</div>";
				if (empty($el_arr['pl_description']))
					echo "<input name=pl_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['pl_description']."' placeholder='pl_description'>";
				else				
					echo "<input name=pl_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['pl_description']."' placeholder='pl_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 30px;'>bg_info</div>";
				if (empty($el_arr['bg_description']))
					echo "<input name=bg_description style='width:65%;float:left;font-size: 30px;background:red;' type=text value='".$el_arr['bg_description']."' placeholder='bg_description'>";
				else				
					echo "<input name=bg_description style='width:65%;float:left;font-size: 30px;background:;' type=text value='".$el_arr['bg_description']."' placeholder='bg_description'>";																		
			}	
			echo "<input style='float:left;font-size: 30px;background:grey;margin-left:20px;' type=submit value='Сохранить' >";
			echo "<br><br>";
			echo "</form>";				
		}
	}  
}
echo "</div>";
echo "</div>";
?>