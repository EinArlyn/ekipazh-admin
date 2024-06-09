<?php
$locales = $bd->get_locales();
//var_dump($locales);
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:1000px;margin:auto;'>";
echo "<div style='width:100%;height:20px;background:#dadada;margin:0 0 20px 0;padding:20px 0;'>";
echo " <div style='width:10%;float:left;margin-left:20px;'>Выберите:</div>";
echo " <select style='width:65%;float:left;background:grey;font-size: 20px;font-weight:bold' onchange=\"ajax_post('select_locales='+this.value+'&name='+this[this.selectedIndex].text,'');\">";
foreach ($locales as $id => $locales_group) 
{
	$locales_name=$locales_group['name'];
	$table_name=$locales_group['table'];
	if (!isset($_SESSION['locales_table']))
		$_SESSION['locales_table']=$id;
	if ($_SESSION['locales_table']==$id)
		echo "<option style='font-size: 20px;font-weight:bold' selected value='$id'>$locales_name</option>";
	else
		echo "<option style='font-size: 15px;' value='$id'>$locales_name</option>";
}
echo " </select>";
echo " <input id='search' style='display:none;width:10%;float:left;margin-left:20px;font-size: 15px;' value''>";
echo "</div>";
foreach ($locales as $id => $locales_group) 
{
	if ($_SESSION['locales_table']==$id)
	{
		foreach ($locales_group['locales'] as $el_id => $el_arr)
		{
			echo "<form id='$el_id' style='width:100%;background:#dadada;margin:0 0 20px 0;padding:0;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"return ajax_form(this,'');\">";
			echo "<input type='hidden' name='ajax' value=1>";
			echo "<input type='hidden' name='set_locales' value='".$locales_group['table']."'>";
			echo "<input type='hidden' name='element' value='".$el_id."'>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>base_name</div>";
			echo "<input name=base_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['base_name']."' placeholder='base_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>ru_name</div>";
			if (empty($el_arr['ru_name']))
				echo "<input name=ru_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['ru_name']."' placeholder='ru_name'><br>";
			else				
				echo "<input name=ru_name style='width:65%;float:left;font-size: 15x;background:;' type=text value='".$el_arr['ru_name']."' placeholder='ru_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>en_name</div>";
			if (empty($el_arr['en_name']))
				echo "<input name=en_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['en_name']."' placeholder='en_name'><br>";
			else   
				echo "<input name=en_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['en_name']."' placeholder='en_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>ua_name</div>";				
			if (empty($el_arr['ua_name']))
				echo "<input name=ua_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['ua_name']."' placeholder='ua_name'><br>";
			else   
				echo "<input name=ua_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['ua_name']."' placeholder='ua_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>de_name</div>";				
			if (empty($el_arr['de_name']))
				echo "<input name=de_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['de_name']."' placeholder='de_name'><br>";
			else   
				echo "<input name=de_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['de_name']."' placeholder='de_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>ro_name</div>";				
			if (empty($el_arr['ro_name']))
				echo "<input name=ro_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['ro_name']."' placeholder='ro_name'><br>";
			else   
				echo "<input name=ro_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['ro_name']."' placeholder='ro_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>it_name</div>";				
			if (empty($el_arr['it_name']))
				echo "<input name=it_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['it_name']."' placeholder='it_name'><br>";
			else   
				echo "<input name=it_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['it_name']."' placeholder='it_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>pl_name</div>";				
			if (empty($el_arr['pl_name']))
				echo "<input name=pl_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['pl_name']."' placeholder='pl_name'><br>";
			else   
				echo "<input name=pl_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['pl_name']."' placeholder='pl_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>bg_name</div>";				
			if (empty($el_arr['bg_name']))
				echo "<input name=bg_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['bg_name']."' placeholder='bg_name'><br>";
			else   
				echo "<input name=bg_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['bg_name']."' placeholder='bg_name'><br>";
			echo "<div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>es_name</div>";	
			if (empty($el_arr['es_name']))
				echo "<input name=es_name style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['es_name']."' placeholder='es_name'>";
			else   
				echo "<input name=es_name style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['es_name']."' placeholder='es_name'>";				
			if (isset($el_arr['base_description']))
			{
				echo "<div style='width:100%;height:10px;'>&nbsp</div><br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>base_info</div>";
				echo "<input name=base_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['base_description']."' placeholder='base_description'>";
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>ru_info</div>";
				if (empty($el_arr['ru_description']))
					echo "<input name=ru_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['ru_description']."' placeholder='ru_description'>";
				else				
					echo "<input name=ru_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['ru_description']."' placeholder='ru_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>en_info</div>";
				if (empty($el_arr['en_description']))
					echo "<input name=en_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['en_description']."' placeholder='en_description'>";
				else				
					echo "<input name=en_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['en_description']."' placeholder='en_description'>";
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>ua_info</div>";
				if (empty($el_arr['ua_description']))
					echo "<input name=ua_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['ua_description']."' placeholder='ua_description'>";
				else				
					echo "<input name=ua_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['ua_description']."' placeholder='ua_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>de_info</div>";
				if (empty($el_arr['de_description']))
					echo "<input name=de_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['de_description']."' placeholder='de_description'>";
				else				
					echo "<input name=de_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['de_description']."' placeholder='de_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>ro_info</div>";
				if (empty($el_arr['ro_description']))
					echo "<input name=ro_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['ro_description']."' placeholder='ro_description'>";
				else				
					echo "<input name=ro_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['ro_description']."' placeholder='ro_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>it_info</div>";
				if (empty($el_arr['it_description']))
					echo "<input name=it_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['it_description']."' placeholder='it_description'>";
				else				
					echo "<input name=it_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['it_description']."' placeholder='it_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>pl_info</div>";
				if (empty($el_arr['pl_description']))
					echo "<input name=pl_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['pl_description']."' placeholder='pl_description'>";
				else				
					echo "<input name=pl_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['pl_description']."' placeholder='pl_description'>";				
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>bg_info</div>";
				if (empty($el_arr['bg_description']))
					echo "<input name=bg_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['bg_description']."' placeholder='bg_description'>";
				else				
					echo "<input name=bg_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['bg_description']."' placeholder='bg_description'>";
				echo "<br><div style='width:10%;float:left;margin-left:20px;font-size: 15px;'>es_info</div>";																						
				if (empty($el_arr['es_description']))
					echo "<input name=es_description style='width:65%;float:left;font-size: 15px;background:#ff643a;' type=text value='".$el_arr['es_description']."' placeholder='es_description'>";
				else				
					echo "<input name=es_description style='width:65%;float:left;font-size: 15px;background:;' type=text value='".$el_arr['es_description']."' placeholder='es_description'>";																		
			}	
			echo "<input style='float:left;font-size: 15px;background:grey;margin-left:20px;' type=submit value='Сохранить' >";
			echo "<br><br>";
			echo "</form>";				
		}
	}  
}
echo "</div>";
?>