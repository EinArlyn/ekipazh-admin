<?php
$dest_factories = $bd->get_dest_factories();
foreach ($dest_factories as $dest_factory_id => $dest_factory_arr)
{ 
	if ($dest_factory_id==$bd->factory_base_id) unset($dest_factories[$dest_factory_id]);
	if ($dest_factory_id==$bd->factory_dest_id) unset($dest_factories[$dest_factory_id]);
}	
echo "<progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>";
echo "<div style='position:relative;width:1000px;margin:auto;'>";
echo " <div style='width:100%;text-align:center;padding:10px 0;'>Синхронизация баз СТЕКО</div>";
echo " <div style='display:inline-block;width:100%;text-align:center;padding:10px 0;'>";
echo " <div style='float:left;width:49%;text-align:center;border:1px solid;'>";
echo " <div style='width:100%'>";
//echo "  <a href='https://admin.steko.com.ua/' target='_blank' class='button1' style='float:right;background:grey;'>админка</a>";
echo "  Рабочая База:	$bd->factory_base_name";
echo " </div>";
if (isset($bd->factory_dest_id))
{
	echo "	<div style='float:right;width:100%;'></div>";
	if ($_SESSION['sync_view_id']=='form_sync')
	{
		echo "  <div OnClick=\"ajax_post('sync_view_id=form_copy','sync_view');\" class='button1' style='float:left;background:grey;padding:5px;'>Полное копирование</div>";
		echo "  <div OnClick=\"ajax_post('sync_view_id=form_sync','sync_view');\" class='button1' style='float:left;background:grey;padding:5px;color:#ff643a'>Выборочное копирование</div>";
	}		
	elseif ($_SESSION['sync_view_id']=='form_copy')
	{
		echo "  <div OnClick=\"ajax_post('sync_view_id=form_copy','sync_view');\" class='button1' style='float:left;background:grey;padding:5px;color:#ff643a'>Полное копирование</div>";
		echo "  <div OnClick=\"ajax_post('sync_view_id=form_sync','sync_view');\" class='button1' style='float:left;background:grey;padding:5px;'>Выборочное копирование</div>";
	}		
	else
	{
		echo "  <div OnClick=\"ajax_post('sync_view_id=form_copy','sync_view');\" class='button1' style='float:left;background:grey;padding:5px;'>Полное копирование</div>";
		echo "  <div OnClick=\"ajax_post('sync_view_id=form_sync','sync_view');\" class='button1' style='float:left;background:grey;padding:5px;'>Выборочное копирование</div>";
	}					
}
echo " </div>";
echo " <div style='float:right;width:49%;text-align:center;border:1px solid;'>";
echo "  <div style='float:left;padding:5px;'>База синхронизации:";
echo "   <div style='display:inline-flex;'>";
echo "    <select style='float:left;background:grey;' onchange=\"ajax_post('select_dest_factory='+this.value+'&name='+this[this.selectedIndex].text,'');\">";
echo "     <option style='' selected value='$dest_factory_id'>$bd->factory_dest_name</option>";
foreach ($dest_factories as $dest_factory_id => $dest_factory_arr) 
{
	$name=$dest_factory_arr['name']." (".$dest_factory_arr['code_sync'].")";
echo "     <option style='' value='$dest_factory_id'>$name</option>";
}
echo "    </select>";
echo "   </div>";
echo "  </div>";
echo "	<div style='float:right;width:100%;'></div>";
echo "  <div OnClick=\"if (confirm('Очистить базу: $bd->factory_dest_name ?')) ajax_post('clear_factory=dest','sync_view');\" class='button1' style='float:right;background:grey;'>Очистить базу</div>";	
echo "  <div style='float:right;width:100%;'></div>";
echo "  <div OnClick=\"ge('add_factory').style.display='block';\" class='button1' style='float:right;background:grey;'>Добавить завод</div>";	
echo "  <div style='float:right;width:100%;'></div>";
echo "  <form id='add_factory' style='display:none;width:100%;' action='' method='post' enctype='multipart/form-data' OnSubmit=\"ge('form_error').innerHTML='';return ajax_form(this,'form_error');\">";
echo "   <input type=submit value='Создать завод' style='cursor:pointer;float:left;font-size: 15px;background:grey;margin-left:20px;'>";
echo "   <input type='hidden' name='ajax' value=1>";
echo "   <input type='hidden' name='factory_create' value=1>";
echo "   <div style='width:100%;height:2px;float:left;'></div>";
echo "   <div style='float:left;width:35%'>Логин:</div><input type='text' name='factory_name' placeholder='логин' style='width:50%;float:left;font-size: 15px;'>";
echo "   <div style='width:100%;height:2px;float:left;'></div>";
echo "   <div style='float:left;width:35%'>Пароль:</div><input type='password' name='factory_pass' placeholder='пароль' style='width:50%;float:left;font-size: 15px;'>";
echo "   <div style='width:100%;height:2px;float:left;'></div>";
echo "   <div style='float:left;width:35%'>Код синхронизации:</div><input type='text' name='factory_sync' placeholder='код синхронизации' style='width:50%;float:left;font-size: 15px;'>";
echo "  </form>";
echo "  <div id='form_error' style='float:right;width:100%;color:#ff643a;'></div>";
echo " </div>";
echo " <div style='float:right;width:100%;'></div>";
echo "</div>";
echo "<div id=sync_view style='width:100%;font-weight: 600;text-align:left;border:0 solid'>";
if ($_SESSION['sync_view_id']=='form_sync')
{
	echo "<table>";
	echo "<tr>";
	echo "<td colspan=4>";
	echo "<div OnClick=\"if (confirm('Синхронизировать базу?')) ajax_post('sync_factory=3&t_id=0','sync_itog');\" class='button1' style='cursor:pointer;float:left;background:grey;padding:5px;'>Синхронизировать</div>";
	echo "</td>";
	echo "</tr>";
	echo "<tr>";
	echo "<td colspan=4>";
	echo "<div id='sync_itog'>";
//	$update_price	= $bd->getFactoryUpdate($bd->factory_dest_id);
//	if (isset($update_price -> date))
//		echo $update_price -> context." ".$update_price -> date -> format('d.m.Y H:i:s');
	echo "</div>";
	echo "</td>";
	echo "</tr>";
	$form_sync_data	= $bd->get_form_sync_data();
	foreach ($form_sync_data as $form_sync_data_key => $form_sync_data_arr)
	{
		$name	= $form_sync_data_arr["name"];
		$t_sync	= $form_sync_data_arr["table"];
		echo "<tr>";		
		echo "<td><img OnClick=\"ajax_post('sync_factory=check_element_sync&t_sync_id=$form_sync_data_key','check_table_$form_sync_data_key');\" src='img/down_arrow_info.png' style='height:20px'></td>";
		echo "<td><div id='table_$form_sync_data_key'><div class='button1' style='cursor:default;background:grey;padding:5px;color:#ff643a;margin:5px;'>$name</div></div></td>";
		echo "<td></td>";
		echo "<td></td>";
		echo "</tr>";
		echo "<tr id=check_table_$form_sync_data_key>";
		echo "<td colspan=4><table>";
		foreach  ($form_sync_data_arr['data'] as $element_id => $element_arr)
		{
			$element_name	= $element_arr["name"];
			$element_check	= $element_arr["check"];
			if (isset($element_check))
			{
				echo "<tr id='chek_tr_".$t_sync."_".$element_id."'>";
				echo "<td onclick=\"ajax_post('check_sync=$element_id&value=0&t_sync=$t_sync&data_name=$element_name','chek_tr_".$t_sync."_".$element_id."');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/check.png' height='20px'></td>";
				echo "<td style='float:left;font-size: 15px;margin:5px;'>$element_name</td>";
				echo "</tr>";				
			}
		}
		if ($_SESSION["form_sync_".$form_sync_data_key."_check"])
		{
			foreach  ($form_sync_data_arr['data'] as $element_id => $element_arr)
			{
				$element_name	= $element_arr["name"];
				$element_check	= $element_arr["check"];
				if (!isset($element_check))
				{
					echo "<tr id='chek_tr_".$t_sync."_".$element_id."'>";
					echo "<td onclick=\"ajax_post('check_sync=$element_id&value=1&t_sync=$t_sync&data_name=$element_name','chek_tr_".$t_sync."_".$element_id."');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/uncheck.png' height='20px'></td>";
					echo "<td style='float:left;font-size: 15px;margin:5px;'>$element_name</td>";
					echo "</tr>";				
				}
			}
		}	
		echo "</table></td>";
		echo "</tr>";		
	}
	echo "</table>";
}
if ($_SESSION['sync_view_id']=='form_copy')
{
	echo "<table>";
	echo "<tr>";
	echo "<td colspan=4>";
	echo "<div OnClick=\"if (confirm('Копировать базу?')) ajax_post('sync_factory=2&t_id=0','table_0');\" class='button1' style='cursor:pointer;float:left;background:grey;padding:5px;'>Копировать</div>";
	echo "</td>";
	echo "</tr>";
	foreach ($bd->sync_tables as $table_key => $table_arr)
	{
		echo "<tr>";		
		echo "<td><div id='table_$table_key'><div class='button1' OnClick=\"if (confirm('Копировать таблицу ".$table_arr['table_name']." ?')) ajax_post('sync_factory=table&t_id=$table_key','table_$table_key');\" style='cursor:pointer;background:grey;padding:5px;color:#ff643a;margin:5px;'>".$table_arr['sync_filds']['id']['sync_table']."</div></div></td>";
		echo "<td><img src='img/down_arrow_info.png' style='height:20px;transform: rotate(-90deg)'></td>";
		echo "<td></td>";
		echo "</tr>";
	}	
	echo "</table>";
}	
echo "</div>";
?>