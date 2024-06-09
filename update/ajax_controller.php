<?php
if ($_POST['ajax'] == 1) ajax_in();  
//-----Обработчик запросов
function get_SQLvalue($value='')
{
	if		(is_null($value))	$value="NULL";
	elseif	($value=="NULL")	$value="NULL";
	else  						$value="'".str_replace("'", "''", $value)."'";
	return $value;
}	
function ajax_in()
{
//	if (count($_POST)>1)
//	{		
//		echo "alert  Необработанный запрос:";
//		var_dump($_POST);
//		var_dump($_FILES);
//	}			
//	exit;   
	if (isset($_POST['login']) and isset($_POST['password']))
	{
		$login	=	$_POST['login'];
		$pass	=	md5($_POST['password']);
		$sql="SELECT public.users.id, public.users.factory_id
					FROM public.users	 
			WHERE public.users.phone='$login' and public.users.password='$pass'";
		$result	= CDatabase::GetResult($sql);
		$row 	= CDatabase::FetchRow($result);
		if (empty($row))
			echo "Неправильный логин или пароль!!";
		elseif ($row[0]<>$row[1])
			echo "Необходимо ввести логин и пароль завода!!";
		else{
			$_SESSION['user_id']=$row[0];
			echo "refresh";
		}		
		exit;
	}
//
	if (isset($_POST['logout']))
	{
		session_destroy();
		sleep(1);
		echo "refresh";
		exit;
	}

	if (isset($_POST['form_id']))
	{
		$_SESSION['form_id']=$_POST['form_id'];
		echo "refresh";
		exit;
	}

	if (isset($_POST['sync_view_id']))
	{
		$_SESSION['sync_view_id']=$_POST['sync_view_id'];
		echo "refresh";
		exit;
	}
	
	if (isset($_POST['select_locales']))
	{
		$_SESSION['locales_table']=$_POST['select_locales'];
		echo "refresh";
		exit;	
	}

	if (isset($_POST['profile_edit']))
	{
		$sql="UPDATE public.profile_systems SET is_editable='".$_POST['value']."' WHERE public.profile_systems.id='".$_POST['profile_edit']."'";
		CDatabase::ExecuteQuery($sql);
		if ($_POST['value']==0)
			echo "Ralert Профильная система отключена!!";
		else 
			echo "Ralert Профильная система включена!!";
		exit;			
	}	

	if (isset($_POST['hardware_edit']))
	{
		$sql="UPDATE public.window_hardware_groups SET is_in_calculation='".$_POST['value']."' WHERE public.window_hardware_groups.id='".$_POST['hardware_edit']."'";
		CDatabase::ExecuteQuery($sql);
		if ($_POST['value']==0)
			echo "Ralert Фурнитурная система отключена!!";
		else 
			echo "Ralert Фурнитурная система включена!!";
		exit;			
	}	

	if (isset($_POST['profile_name']))
	{
		if (isset($_POST['profile_create']))
		{
			$sql="INSERT INTO public.profile_systems
					(name, folder_id) 
					VALUES	('".$_POST['profile_name']."', '".$_POST['profile_create']."')
					RETURNING id";
			CDatabase::ExecuteQuery($sql);
			echo "Ralert профильная система: '".$_POST['profile_name']."'  добавлена!!";
		}
		else
		{
			$sql="UPDATE public.profile_systems SET name='".$_POST['value']."' WHERE public.profile_systems.id='".$_POST['profile_name']."'";
			CDatabase::ExecuteQuery($sql);
			echo "alert наименование: '".$_POST['value']."'  записано!!";
		}	
		exit;			
	}	

	if (isset($_POST['hw'])) //модификация код
	{
		$hardware_id=$_POST['hw'];
		$hardware_type=$_POST['hw_type'];
		if (isset($_POST['ks1']))
		{
			$ks1=$_POST['ks1'];
			$sql="UPDATE public.window_hardware_sync SET sync_hardware_id='$ks1' WHERE hardware_id='$hardware_id' and hardware_type='$hardware_type'";
			CDatabase::ExecuteQuery($sql);
			return;			
		}
		if (isset($_POST['ks2']))
		{
			$ks2=$_POST['ks2'];
			$sql="UPDATE public.window_hardware_sync SET sync_hardware_id2='$ks2' WHERE hardware_id='$hardware_id' and hardware_type='$hardware_type'";
			CDatabase::ExecuteQuery($sql);
			return;						
		}	
		if (isset($_POST['limit']))
		{
			$limit=$_POST['limit'];
			$sql="UPDATE public.window_hardware_sync SET \"limit\"='$limit' WHERE hardware_id='$hardware_id' and hardware_type='$hardware_type'";
			CDatabase::ExecuteQuery($sql);
			return;									
		}				
		return;
	}
	
	if (isset($_POST['hardware_ks']))
	{
		if ($_POST['hardware_ks']=="clear")
		{
			exit;
		}
		$hardware_id=$_POST['hardware_ks'];
		$bd=new StekoBD();
		$ks=$bd->get_hardwares_sync($hardware_id);
//		var_dump($ks);
		$hw_type=array();
		$hw_type[2]=2;		//поворотная
		$hw_type[4]=4;		//Штульповая
		$hw_type[6]=6;		//Поворотно-откидная
		$hw_type[7]=7;		//Фрамуга
		$hw_type[17]=17;	//Поворотно-откидная (штульп)
		$clear="<div onclick=\"ajax_post('hardware_ks=clear','ks_$hardware_id');\" style='cursor:pointer;float:left;font-size: 15px;margin-left:25px;'><img src='img/down_arrow_info.png' height='20px' style='transform: rotate(180deg)'></div>";	
		foreach ($hw_type as $hw_type_id)
		{		
			$ks_name=$ks[$hw_type_id]['name'];
			$ks_limit=$ks[$hw_type_id]['limit'];
			$ks_value1=$ks[$hw_type_id]['value1'];
			$ks_value2=$ks[$hw_type_id]['value2'];	
			echo "  <div style='width:15%;float:left;margin-left:20px;'>&nbsp;</div>";		
			echo "  <div style='width:225px;float:left;font-size: 15px;font-weight:700;'>$ks_name</div>";
			echo "  <div style='width:50px;float:left;font-size: 15px;text-align:right;'>Код 1:</div>";
			echo "  <input onchange=\"ajax_post('hw=$hardware_id&hw_type=$hw_type_id&ks1='+this.value,'');\" style='width:50px;float:left;font-size: 15px;' type=text value='$ks_value1'>";
			echo "  <div style='width:110px;float:left;font-size: 15px;text-align:right;'>ограничение:</div>";
			echo "  <input onchange=\"ajax_post('hw=$hardware_id&hw_type=$hw_type_id&limit='+this.value,'');\" style='width:50px;float:left;font-size: 15px;' type=text value='$ks_limit'>";
			echo "  <div style='width:70px;float:left;font-size: 15px;text-align:right;'>Код 2:</div>";
			echo "  <input onchange=\"ajax_post('hw=$hardware_id&hw_type=$hw_type_id&ks2='+this.value,'');\" style='width:50px;float:left;font-size: 15px;' type=text value='$ks_value2'>";
			echo $clear;
			echo "  <div style='width:100%;float:left;margin:5px 0 0 20px;'></div>";
			$clear=""; 			
		}
		exit;
	}		

	if (isset($_POST['hardware_name']))
	{
		if (isset($_POST['hardware_create']))
		{
			$sql="INSERT INTO public.window_hardware_groups
					(name, folder_id) 
					VALUES	('".$_POST['hardware_name']."', '".$_POST['hardware_create']."')
					RETURNING id";					
			CDatabase::ExecuteQuery($sql);
			echo "Ralert фурнитура: '".$_POST['hardware_name']."'  добавлена!!";
		}
		else
		{
			$sql="UPDATE public.window_hardware_groups SET name='".$_POST['value']."' WHERE public.window_hardware_groups.id='".$_POST['hardware_name']."'";
			CDatabase::ExecuteQuery($sql);
			echo "alert наименование: '".$_POST['value']."'  записано!!";
		}	
		exit;			
	}	

	if (isset($_POST['profile_folder_name']))
	{
		$sql="UPDATE public.profile_system_folders SET name='".$_POST['value']."' WHERE public.profile_system_folders.id='".$_POST['profile_folder_name']."'";
		CDatabase::ExecuteQuery($sql);
		echo "alert наименование: '".$_POST['value']."'  записано!!";
		exit;			
	}	

	if (isset($_POST['hardware_folder_name']))
	{
		$sql="UPDATE public.window_hardware_folders SET name='".$_POST['value']."' WHERE public.window_hardware_folders.id='".$_POST['hardware_folder_name']."'";
		CDatabase::ExecuteQuery($sql);
		echo "alert наименование: '".$_POST['value']."'  записано!!";
		exit;			
	}	

	
	if (isset($_POST['set_locales']))
	{
		$factory_id	= $_SESSION['user_id'];
		$table_name	= $_POST['set_locales'];
		$table_id	= $_POST['element'];
		$base_name	= get_SQLvalue($_POST['base_name']);
		$ru_name	= get_SQLvalue($_POST['ru_name']);
		$en_name	= get_SQLvalue($_POST['en_name']);
		$ua_name	= get_SQLvalue($_POST['ua_name']);
		$de_name	= get_SQLvalue($_POST['de_name']);
		$ro_name	= get_SQLvalue($_POST['ro_name']);		
		$it_name	= get_SQLvalue($_POST['it_name']);
		$pl_name	= get_SQLvalue($_POST['pl_name']);
		$bg_name	= get_SQLvalue($_POST['bg_name']);
		$es_name	= get_SQLvalue($_POST['es_name']);
		$sql_base = "UPDATE	public.$table_name
						SET	name=$base_name
					WHERE	public.$table_name.id=$table_id and public.$table_name.table_attr='name'";		
		$sql="SELECT	public.locales_names.id 
				FROM	public.locales_names 
				WHERE	public.locales_names.table_name='$table_name' and public.locales_names.table_id='$table_id' and public.locales_names.table_attr='name'";
		$result	= CDatabase::GetResult($sql);				
		$row 	= CDatabase::FetchRow($result);
		if (isset($row[0]))
			$sql = "UPDATE	public.locales_names
						SET	ru=$ru_name,
							en=$en_name,
							ua=$ua_name,
							de=$de_name,
							ro=$ro_name,
							it=$it_name,
							pl=$pl_name,
							bg=$bg_name,
							es=$es_name
					WHERE	public.locales_names.id=$row[0]";
		else 
			$sql = "INSERT INTO public.locales_names 
							(factory_id, table_name, table_id, table_attr, ru, en, ua, de, ro, it, pl, bg, es) 
					VALUES	('$factory_id','$table_name', '$table_id', 'name', $ru_name, $en_name, $ua_name, $de_name, $ro_name, $it_name, $pl_name, $bg_name, $es_name)
					RETURNING id";
		$result	= CDatabase::ExecuteQuery($sql_base);						
		$result	= CDatabase::GetResult($sql);				
		$row 	= CDatabase::FetchRow($result);
		
		if (isset($_POST['base_description']))
		{
			$base_description	= get_SQLvalue($_POST['base_description']);
			$ru_description		= get_SQLvalue($_POST['ru_description']);
			$en_description		= get_SQLvalue($_POST['en_description']);
			$ua_description		= get_SQLvalue($_POST['ua_description']);
			$de_description		= get_SQLvalue($_POST['de_description']);
			$ro_description		= get_SQLvalue($_POST['ro_description']);
			$it_description		= get_SQLvalue($_POST['it_description']);
			$pl_description		= get_SQLvalue($_POST['pl_description']);
			$bg_description		= get_SQLvalue($_POST['bg_description']);
			$es_description		= get_SQLvalue($_POST['es_description']);			
			$sql_base = "UPDATE	public.$table_name
							SET	description=$base_description
						WHERE	public.$table_name.id=$table_id and public.$table_name.table_attr='description'";		
			$sql="SELECT	public.locales_names.id 
					FROM	public.locales_names 
					WHERE	public.locales_names.table_name='$table_name' and public.locales_names.table_id='$table_id' and public.locales_names.table_attr='description'";
			$result	= CDatabase::GetResult($sql);				
			$row 	= CDatabase::FetchRow($result);
			if (isset($row[0]))
				$sql = "UPDATE	public.locales_names
							SET	ru=$ru_description,
								en=$en_description,
								ua=$ua_description,
								de=$de_description,
								ro=$ro_description,
								it=$it_description,
								pl=$pl_description,
								bg=$bg_description,
								es=$es_description
						WHERE	public.locales_names.id=$row[0]";
			else 
				$sql = "INSERT INTO public.locales_names 
								(factory_id, table_name, table_id, table_attr, ru, en, ua, de, ro, it, pl, bg, es) 
						VALUES	('$factory_id', '$table_name', '$table_id', 'description', $ru_description, $en_description, $ua_description, $de_description, $ro_description, $it_description, $pl_description, $bg_description, $es_description)
						RETURNING id";
			$result	= CDatabase::ExecuteQuery($sql_base);
			$result	= CDatabase::GetResult($sql);
			$row 	= CDatabase::FetchRow($result);
		}	
//		echo "alert Сохранено!!";
//		echo $sql;
		echo "refresh";
		exit;			
	}
	
	if (isset($_POST['update']))
	{
		if ($_POST['update']==1)  //синхронизация тестовая база -> рабочая база
		{
			$bd=new StekoBD();
			foreach ($bd->copy_tables as $table_name)
			{
				$bd->copy_table($bd -> db1, $bd -> db0, $table_name);
			}
			exit;
		}
		if ($_POST['update']==0)  //синхронизация рабочая база -> тестовая рабочая
		{
			$bd=new StekoBD();
			foreach ($bd->copy_tables as $table_name)
			{
				$bd->copy_table($bd -> db0, $bd -> db1, $table_name);
			}
			exit;
		}
	}
	
	if (isset($_POST['factory_create']))
	{
		if ($_POST['factory_create']==1)
		{
			if (empty($_POST['factory_name']))
			{
				echo "!!Введите логин:";
				exit;
			}
			if (empty($_POST['factory_pass']))
			{
				echo "!!Введите пароль:";
				exit;
			}
			if (empty($_POST['factory_sync']))
			{
				echo "!!Введите код синхронизации:";
				exit;
			}
			$bd=new StekoBD();
			$bd->create_factory($_POST['factory_name'], $_POST['factory_pass'], $_POST['factory_sync']);
			echo "Ralert завод создан:";
			exit;
		}
		echo "refresh";
		exit;					
	}
	
	if (isset($_POST['select_dest_factory']))
	{
		$_SESSION['factory_dest_id']=$_POST['select_dest_factory'];
		echo "refresh";
		exit;					
			
	}

	if (isset($_POST['sync_factory']))
	{
		if ($_POST['sync_factory']=='table')  // копирование таблицы
		{
//			echo "alert";
			$bd=new StekoBD();
			$table_arr=$bd->sync_tables[$_POST['t_id']];
			$bd->table_copy($table_arr);
			echo "<script></script>";			
			echo "<html>    ";
			echo "<div class='button1' style='background:grey;padding:5px;color:green;margin:5px;'>".$table_arr['sync_filds']['id']['sync_table']."</div>";				
			echo "</html>";
			exit;			
		}
		if ($_POST['sync_factory']=='table_sync')  // синхронизация таблицы выборочная
		{
//			echo "alert";
			$bd=new StekoBD();
			$table_arr=$bd->sync_tables[$_POST['t_id']];
			$bd->table_sync($table_arr);
			echo "<script></script>";			
			echo "<html>    ";
			echo "<div class='button1' style='background:grey;padding:5px;color:green;margin:5px;'>".$table_arr['sync_filds']['id']['sync_table']."</div>";				
			echo "</html>";
			exit;			
		}
		if ($_POST['sync_factory']==1)  // копирование полное
		{
			$bd=new StekoBD();
			foreach ($bd->sync_tables as $table_arr)
			{
				$bd->table_copy($table_arr);				
				echo $table_arr['table_name']." -> ok<br>";
			}
			exit;
		}
		if  ($_POST['sync_factory']==2)  // копирование таблицы
		{
			$bd=new StekoBD();
			$bd->table_copy($bd->sync_tables[$_POST['t_id']]);
			$next=$_POST['t_id']+1;
			if (isset($bd->sync_tables[$next]['table_name']))
			{
				echo "<script>ajax_post('sync_factory=2&t_id=$next','table_$next');</script>";
				echo "<html>";
				echo "<div class='button1' style='background:grey;padding:5px;color:green;margin:5px;'>".$bd->sync_tables[$_POST['t_id']]['sync_filds']['id']['sync_table']."</div>";				
				echo "</html>";
				exit;
			}
			echo "<script>alert('Копирование завершено!!');</script>";
			echo "<html>";
			echo "<div class='button1' style='background:grey;padding:5px;color:green;margin:5px;'>".$bd->sync_tables[$_POST['t_id']]['sync_filds']['id']['sync_table']."</div>";				
			echo "</html>";
			exit;	
		}
		if  ($_POST['sync_factory']==3)  // синхронизация полная
		{
			$bd=new StekoBD();
			$bd->table_sync($bd->sync_tables[$_POST['t_id']]);
//			$next=$_POST['t_id']+1;
//			if (isset($bd->sync_tables[$next]['table_name']))
//			{
//				echo "<script>ajax_post('sync_factory=3&t_id=$next','table_$next');</script>";
//				echo "<html>";
//				echo "<div class='button1' style='background:grey;padding:5px;color:green;margin:5px;'>".$bd->sync_tables[$_POST['t_id']]['sync_filds']['id']['sync_table']."</div>";				
//				echo "</html>";
//				exit;
//			}
			echo "<script>alert('Синхронизация завершена!!');</script>";
			echo "<html>";
//			echo "<div class='button1' style='background:grey;padding:5px;color:green;margin:5px;'>".$bd->sync_tables[$_POST['t_id']]['sync_filds']['id']['sync_table']."</div>";				
			echo "</html>";
			exit;	
		}
		if ($_POST['sync_factory']=='form_sync')  // форма синхронизации 
		{
			$_SESSION['sync_view_id']=$_POST['sync_factory'];
			echo "refresh";
			exit;					
		}
		if ($_POST['sync_factory']=='check_element')  // форма синхронизации элементов таблицы
		{
			$bd=new StekoBD();
			$bd->check_sync_form($bd->sync_tables[$_POST['t_id']], $_POST['t_id']);	
			exit;			
		}
		if ($_POST['sync_factory']=='check_element_sync')  // 
		{
			if (isset($_SESSION["form_sync_".$_POST['t_sync_id']."_check"]))
			{
				unset($_SESSION["form_sync_".$_POST['t_sync_id']."_check"]);
			}	
			else 
			{
				$_SESSION["form_sync_".$_POST['t_sync_id']."_check"]=1;
			}
			$bd=new StekoBD();
			$form_sync_data	= $bd->get_form_sync_data();
			foreach ($form_sync_data as $form_sync_data_key => $form_sync_data_arr)
			{
				$name	= $form_sync_data_arr["name"];
				$t_sync	= $form_sync_data_arr["table"];
				if ($form_sync_data_key==$_POST['t_sync_id'])
				{
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
					if ($_SESSION["form_sync_".$_POST['t_sync_id']."_check"])
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
				}
			}	
			exit;			
		}		
		exit;		
	}

	if (isset($_POST['check_sync']))
	{
		if ($_POST['t_id'])
		{
			$bd=new StekoBD();
			$table_sync = $bd->sync_tables[$_POST['t_id']]['sync_filds']['id']['sync_table'];
			$bcode_sync	= $_POST['check_sync'];
			$table_key	= $_POST['t_id'];
			if ($_POST['value'] == 0)
			{
				$sql = "DELETE FROM	add.tablesync WHERE	add.tablesync.factory_sync='$bd->factory_dest_id' and table_sync='$table_sync' and bcode_sync='$bcode_sync'";
				$result	= CDatabase::ExecuteQuery($sql);
				echo "<td onclick=\"ajax_post('check_sync=$bcode_sync&value=1&t_id=$table_key&data_name=".$_POST['data_name']."','chek_tr_$table_key_$bcode_sync');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/uncheck.png' height='20px'></td>";
				echo "<td style='float:left;font-size: 15px;margin:5px;'>".$_POST['data_name']."</td>";
			}			
			elseif ($_POST['value'] == 1)
			{
				$sql="INSERT INTO add.tablesync	(factory_sync, table_sync, bcode_sync) VALUES ('$bd->factory_dest_id', '$table_sync', '$bcode_sync') RETURNING id";
				$result	= CDatabase::ExecuteQuery($sql);
				echo "<td onclick=\"ajax_post('check_sync=$bcode_sync&value=0&t_id=$table_key&data_name=".$_POST['data_name']."','chek_tr_$table_key_$bcode_sync');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/check.png' height='20px'></td>";
				echo "<td style='float:left;font-size: 15px;margin:5px;'>".$_POST['data_name']."</td>";
			}
			exit;
		}
		if ($_POST['t_sync'])
		{
			$bd=new StekoBD();	
			$table_sync 	= $_POST['t_sync'];
			$bcode_sync		= $_POST['check_sync'];
			$element_id		= $_POST['check_sync'];
			$table_key	= $_POST['t_id'];
			$element_name	= $_POST['data_name'];
			if ($_POST['value'] == 0)
			{
				$sql = "DELETE FROM	add.tablesync WHERE	add.tablesync.factory_sync='$bd->factory_dest_id' and table_sync='$table_sync' and bcode_sync='$bcode_sync'";
				$result	= CDatabase::ExecuteQuery($sql);
				echo "<td onclick=\"ajax_post('check_sync=$element_id&value=1&t_sync=$table_sync&data_name=$element_name','chek_tr_".$table_sync."_".$element_id."');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/uncheck.png' height='20px'></td>";
				echo "<td style='float:left;font-size: 15px;margin:5px;'>$element_name</td>";
			}			
			elseif ($_POST['value'] == 1)
			{
				$sql="INSERT INTO add.tablesync	(factory_sync, table_sync, bcode_sync) VALUES ('$bd->factory_dest_id', '$table_sync', '$bcode_sync') RETURNING id";
				$result	= CDatabase::ExecuteQuery($sql);
				echo "<td onclick=\"ajax_post('check_sync=$element_id&value=0&t_sync=$table_sync&data_name=$element_name','chek_tr_".$table_sync."_".$element_id."');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/check.png' height='20px'></td>";
				echo "<td style='float:left;font-size: 15px;margin:5px;'>$element_name</td>";
			}
			exit;
		}
		exit;
	}
	if (isset($_POST['clear_factory']))
	{
		$bd=new StekoBD();
		if ($_POST['clear_factory']=='dest')
		{
			$bd->clearbd($bd->factory_dest_id);
		}
		else
		{		
//			$bd->clearfactory($bd->factory_base_id);
		}
		echo "alert 'Очистка завершена!!'";
		exit;		
	}		
//-----Необработанный запрос
	if (count($_POST)>1)
	{		
		echo "alert  Необработанный запрос:";
		var_dump($_POST);
		var_dump($_FILES);
	}			
	exit;   
} 