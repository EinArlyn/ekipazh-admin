<?php
//Работа с базой данных
class StekoBD
{
	public function StekoBD()
	{
		$this->user_browser($_SERVER["HTTP_USER_AGENT"]);
		$this->user_device($_SERVER["HTTP_USER_AGENT"]);
		$this->base_id		= $_SESSION['user_id'];
		$this->basefactory();
		$this->destfactory();

		//для копирования таблиц между базами
		$this -> db0= "steko_prod";
		$this -> db1= "steko";
		$this -> copy_tables[]='public.currencies';
		$this -> copy_tables[]='public.background_templates';
		$this -> copy_tables[]='public.lamination_factory_colors';
		$this -> copy_tables[]='public.options_discounts';
		$this -> copy_tables[]='public.options_coefficients';
		$this -> copy_tables[]='public.addition_folders';
		$this -> copy_tables[]='public.glass_folders';
		$this -> copy_tables[]='public.profile_system_folders';
		$this -> copy_tables[]='public.doors_folders';
		$this -> copy_tables[]='public.window_hardware_folders';
		$this -> copy_tables[]='public.window_hardware_groups';
		$this -> copy_tables[]='public.doors_hardware_groups';
		$this -> copy_tables[]='public.suppliers';
		$this -> copy_tables[]='public.elements';
		$this -> copy_tables[]='public.lists';
		$this -> copy_tables[]='public.list_contents';
		$this -> copy_tables[]='public.window_hardwares';
		$this -> copy_tables[]='public.doors_hardware_items';
		$this -> copy_tables[]='public.profile_systems';
		$this -> copy_tables[]='public.doors_groups';
		$this -> copy_tables[]='public.doors_groups_dependencies';						
		$this -> copy_tables[]='public.doors_laminations_dependencies';						
		$this -> copy_tables[]='public.elements_profile_systems';						
		$this -> copy_tables[]='public.beed_profile_systems';						
		$this -> copy_tables[]='public.profile_laminations';						
		$this -> copy_tables[]='public.mosquitos';						
		$this -> copy_tables[]='public.similarities';						
		$this -> copy_tables[]='public.glass_similarities';						
		$this -> copy_tables[]='public.window_hardware_type_ranges';						
		$this -> copy_tables[]='public.window_hardware_handles';						
		$this -> copy_tables[]='public.glass_prices';											
		$this -> copy_tables[]='public.doors_groups_dependencies';


		//для копирования заводских таблиц между базами
		//$this -> copy_tables[]='public.currencies';
		$sync_table 							= array();
		$sync_table['table_name']				= "public.currencies";
		$sync_table['table_base_sql']			= "SELECT * FROM public.currencies WHERE public.currencies.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.currencies WHERE public.currencies.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "currencies";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;
		//$this -> copy_tables[]='background_templates';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.background_templates";
		$sync_table['table_base_sql']			= "SELECT * FROM public.background_templates WHERE public.background_templates.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.background_templates WHERE public.background_templates.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "background_templates";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
		//$this -> copy_tables[]='lamination_factory_colors';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.lamination_factory_colors";
		$sync_table['table_base_sql']			= "SELECT * FROM public.lamination_factory_colors WHERE public.lamination_factory_colors.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.lamination_factory_colors WHERE public.lamination_factory_colors.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "lamination_factory_colors";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.options_discounts';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.options_discounts";
		$sync_table['table_base_sql']			= "SELECT * FROM public.options_discounts WHERE public.options_discounts.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.options_discounts WHERE public.options_discounts.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "options_discounts";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.options_coefficients';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.options_coefficients";
		$sync_table['table_base_sql']			= "SELECT * FROM public.options_coefficients WHERE public.options_coefficients.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.options_coefficients WHERE public.options_coefficients.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "options_coefficients";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.addition_folders';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.addition_folders";
		$sync_table['table_base_sql']			= "SELECT * FROM public.addition_folders WHERE public.addition_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.addition_folders WHERE public.addition_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "addition_folders";
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.glass_folders';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.glass_folders";
		$sync_table['table_base_sql']			= "SELECT * FROM public.glass_folders WHERE public.glass_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.glass_folders WHERE public.glass_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "glass_folders";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.profile_system_folders';
		$sync_table 							= array();
//		$sync_table['sync_fl']					= true;
		$sync_table['table_name']				= "public.profile_system_folders";
		$sync_table['table_base_sql']			= "SELECT * FROM public.profile_system_folders WHERE public.profile_system_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.profile_system_folders WHERE public.profile_system_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "profile_system_folders";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.doors_folders';
		$sync_table 							= array();
//		$sync_table['sync_fl']					= true;	
		$sync_table['table_name']				= "public.doors_folders";
		$sync_table['table_base_sql']			= "SELECT * FROM public.doors_folders WHERE public.doors_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.doors_folders WHERE public.doors_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "doors_folders";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.window_hardware_folders';
		$sync_table 							= array();
//		$sync_table['sync_fl']					= true;			
		$sync_table['table_name']				= "public.window_hardware_folders";
		$sync_table['table_base_sql']			= "SELECT * FROM public.window_hardware_folders WHERE public.window_hardware_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.window_hardware_folders WHERE public.window_hardware_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "window_hardware_folders";	
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.window_hardware_groups';
		$sync_table 											= array();	
		$sync_table['sync_fl']									= true;
		$sync_table['table_name']								= "public.window_hardware_groups";
		$sync_table['table_base_sql']							= "SELECT public.window_hardware_groups.* FROM public.window_hardware_groups JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id WHERE public.window_hardware_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']							= "SELECT public.window_hardware_groups.* FROM public.window_hardware_groups JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id WHERE public.window_hardware_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 											= array();
		$sync_filds['id']['sync_table']							= "window_hardware_groups";	
		$sync_filds['folder_id']['sync_table']					= "window_hardware_folders";
		$sync_filds['sync_filds_update_fix']['name']			= 1;
		$sync_filds['sync_filds_update_fix']['short_name']		= 1;
		$sync_filds['sync_filds_update_fix']['is_editable']		= 1;
		$sync_filds['sync_filds_update_fix']['description']		= 1;			
		$sync_table['sync_filds']								= $sync_filds;
		$ext_table_link											= array(); //таблицы для выборочной синхронизации текущей таблицы
		$ext_table_link['window_hardwares']['name']				= 'window_hardwares';
		$ext_table_link['window_hardware_type_ranges']['name']	= 'window_hardware_type_ranges';
		$sync_table['ext_table_link']							= $ext_table_link;		
		$this -> sync_tables[]									= $sync_table;
//		$this -> copy_tables[]='public.window_hardware_sync';		
//		$sync_table 								= array();	
//		$sync_table['table_name']					= "public.window_hardware_sync";
//		$sync_table['table_base_sql']				= "SELECT public.window_hardware_sync.* FROM public.window_hardware_sync JOIN public.window_hardware_groups on public.window_hardware_groups.id=public.window_hardware_sync.hardware_id JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id WHERE public.window_hardware_folders.factory_id='$this->factory_base_id'";
//		$sync_table['table_dest_sql']				= "SELECT public.window_hardware_sync.* FROM public.window_hardware_sync JOIN public.window_hardware_groups on public.window_hardware_groups.id=public.window_hardware_sync.hardware_id JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id WHERE public.window_hardware_folders.factory_id='$this->factory_dest_id'";
//		$sync_filds 								= array();
//		$sync_filds['id']['sync_table']				= "window_hardware_sync";	
//		$sync_filds['hardware_id']['sync_table']	= "window_hardware_groups";
//		$sync_filds['hardware_id']['null_value']	= FALSE;		
//		$sync_table['sync_filds']					= $sync_filds;
//		$this -> sync_tables[]						= $sync_table;
//-----------------------
//		$this -> copy_tables[]='public.doors_hardware_groups';
		$sync_table 											= array();
		$sync_table['sync_fl']									= true;	
		$sync_table['table_name']								= "public.doors_hardware_groups";
		$sync_table['table_base_sql']							= "SELECT * FROM public.doors_hardware_groups WHERE public.doors_hardware_groups.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']							= "SELECT * FROM public.doors_hardware_groups WHERE public.doors_hardware_groups.factory_id='$this->factory_dest_id'";
		$sync_filds 											= array();
		$sync_filds['id']['sync_table']							= "doors_hardware_groups";
		$sync_filds['factory_id']['sync_value']					= "$this->factory_dest_id";
		$sync_table['sync_filds']								= $sync_filds;
		$ext_table_link											= array(); //таблицы для выборочной синхронизации текущей таблицы
		$ext_table_link['lock_lists']['name']					= 'lock_lists';
		$ext_table_link['doors_hardware_items']['name']			= 'doors_hardware_items';
//		$ext_table_link['doors_groups_dependencies']['name']	= 'doors_groups_dependencies';
		$sync_table['ext_table_link']							= $ext_table_link;						
		$this -> sync_tables[]									= $sync_table;		
//		$this -> copy_tables[]='public.suppliers';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.suppliers";
		$sync_table['table_base_sql']			= "SELECT * FROM public.suppliers WHERE public.suppliers.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT * FROM public.suppliers WHERE public.suppliers.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "suppliers";
		$sync_filds['factory_id']['sync_value']	= "$this->factory_dest_id";			
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;		
//		$this -> copy_tables[]='public.elements';
		$sync_table 								= array();	
		$sync_table['table_name']					= "public.elements";
		$sync_table['table_base_sql']				= "SELECT public.elements.* FROM public.elements WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']				= "SELECT public.elements.* FROM public.elements WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 								= array();
		$sync_filds['id']['sync_table']				= "elements";
		$sync_filds['factory_id']['sync_value']		= "$this->factory_dest_id";
		$sync_filds['currency_id']['sync_table']	= "currencies";
		$sync_filds['supplier_id']['sync_table']	= "suppliers";
		$sync_filds['glass_folder_id']['sync_table']= "glass_folders";
		$sync_table['sync_filds']					= $sync_filds;
//		$ext_table_link								= array(); //таблицы для выборочной синхронизации текущей таблицы
//		$ext_table_link[]							= 'elements_profile_systems';
//		$sync_table['ext_table_link']				= $ext_table_link;							
		$this -> sync_tables[]						= $sync_table;		
//		$this -> copy_tables[]='public.lists';
		$sync_table 										= array();
		$sync_table['sync_fl']								= true;		
		$sync_table['table_name']							= "public.lists";
		$sync_table['table_base_sql']						= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']						= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 										= array();
		$sync_filds['id']['sync_table']						= "lists";
		$sync_filds['parent_element_id']['sync_table']		= "elements";
		$sync_filds['beed_lamination_id']['sync_table']		= "lamination_factory_colors";
		$sync_filds['beed_lamination_id']['null_value']		= "1";
		$sync_filds['addition_folder_id']['sync_table']		= "addition_folders";
		$sync_filds['addition_folder_id']['null_value']		= "0";					
		$sync_table['sync_filds']							= $sync_filds;
		$ext_table_link										= array(); //таблицы для выборочной синхронизации текущей таблицы
		$ext_table_link['list_contents']['name']			= 'list_contents';
		$ext_table_link['window_hardware_handles']['name']	= 'window_hardware_handles';
		$sync_table['ext_table_link']						= $ext_table_link;
		$this -> sync_tables[]								= $sync_table;		
//		$this -> copy_tables[]='public.list_contents';
		$sync_table 										= array();	
		$sync_table['table_name']							= "public.list_contents";
		$sync_table['table_base_sql']						= "SELECT public.list_contents.* FROM public.list_contents JOIN public.lists on public.lists.id=public.list_contents.parent_list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']						= "SELECT public.list_contents.* FROM public.list_contents JOIN public.lists on public.lists.id=public.list_contents.parent_list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 										= array();
		$sync_filds['id']['sync_table']						= "list_contents";
		$sync_filds['parent_list_id']['sync_table']			= "lists";
		$sync_filds['child_id']['type_table']				= "child_type";
		$sync_filds['child_id']['list']['sync_table']		= "lists";
		$sync_filds['child_id']['element']['sync_table']	= "elements";
		$sync_filds['child_id']['null_value']				= FALSE;
		$sync_table['sync_filds']							= $sync_filds;
		$this -> sync_tables[]								= $sync_table;		
//		$this -> copy_tables[]='public.window_hardwares';
		$sync_table 											= array();
//		$sync_table['sync_fl']									= true;	
		$sync_table['table_name']								= "public.window_hardwares";
		$sync_table['table_base_sql']							= "SELECT public.window_hardwares.* FROM public.window_hardwares WHERE public.window_hardwares.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']							= "SELECT public.window_hardwares.* FROM public.window_hardwares WHERE public.window_hardwares.factory_id='$this->factory_dest_id'";
		$sync_filds 											= array();
		$sync_filds['id']['sync_table']							= "window_hardwares";
		$sync_filds['factory_id']['sync_value']					= "$this->factory_dest_id";
		$sync_filds['window_hardware_group_id']['sync_table']	= "window_hardware_groups";		
		$sync_filds['child_id']['type_table']					= "child_type";
		$sync_filds['child_id']['list']['sync_table']			= "lists";
		$sync_filds['child_id']['element']['sync_table']		= "elements";
		$sync_filds['child_id']['null_value']					= FALSE;
//может быть 0 или 1 в противном случае не синхронизировать
		$sync_filds['window_hardware_color_id']['sync_table']	= "lamination_factory_colors";
		$sync_filds['window_hardware_color_id']['null_value'][0]= "0";
		$sync_filds['window_hardware_color_id']['null_value'][1]= "1";
		$sync_table['sync_filds']								= $sync_filds;
		$this -> sync_tables[]									= $sync_table;		
//		$this -> copy_tables[]='public.doors_hardware_items';
		$sync_table 										= array();	
		$sync_table['table_name']							= "public.doors_hardware_items";
		$sync_table['table_base_sql']						= "SELECT public.doors_hardware_items.* FROM public.doors_hardware_items JOIN public.doors_hardware_groups on public.doors_hardware_groups.id=public.doors_hardware_items.hardware_group_id WHERE public.doors_hardware_groups.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']						= "SELECT public.doors_hardware_items.* FROM public.doors_hardware_items JOIN public.doors_hardware_groups on public.doors_hardware_groups.id=public.doors_hardware_items.hardware_group_id WHERE public.doors_hardware_groups.factory_id='$this->factory_dest_id'";
		$sync_filds 										= array();
		$sync_filds['id']['sync_table']						= "doors_hardware_items";
		$sync_filds['hardware_group_id']['sync_table']		= "doors_hardware_groups";
		$sync_filds['child_id']['type_table']				= "child_type";
		$sync_filds['child_id']['list']['sync_table']		= "lists";
		$sync_filds['child_id']['element']['sync_table']	= "elements";					
		$sync_table['sync_filds']							= $sync_filds;
		$this -> sync_tables[]								= $sync_table;		
//		$this -> copy_tables[]='public.profile_systems';
		$sync_table 										= array();	
		$sync_table['sync_fl']								= true;		
		$sync_table['table_name']							= "public.profile_systems";		
		$sync_table['table_base_sql']						= "SELECT public.profile_systems.* FROM public.profile_systems JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']						= "SELECT public.profile_systems.* FROM public.profile_systems JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 										= array();
		$sync_filds['id']['sync_table']						= "profile_systems";
		$sync_filds['folder_id']['sync_table']				= "profile_system_folders";
		$sync_filds['rama_list_id']['sync_table']			= "lists";
		$sync_filds['rama_still_list_id']['sync_table']		= "lists";
		$sync_filds['stvorka_list_id']['sync_table']		= "lists";
		$sync_filds['impost_list_id']['sync_table']			= "lists";
		$sync_filds['shtulp_list_id']['sync_table']			= "lists";
		$sync_filds['sync_filds_update_fix']['name']		= 1;
		$sync_filds['sync_filds_update_fix']['short_name']	= 1;
		$sync_filds['sync_filds_update_fix']['is_editable']	= 1;
		$sync_filds['sync_filds_update_fix']['description']	= 1;					
		$ext_table_link										= array(); //таблицы для выборочной синхронизации текущей таблицы
		$ext_table_link['elements_profile_systems']['name']	= 'elements_profile_systems';
		$ext_table_link['beed_profile_systems']['name']		= 'beed_profile_systems';
		$ext_table_link['profile_laminations']['name']		= 'profile_laminations';
		$ext_table_link['mosquitos']['name']				= 'mosquitos';
		$sync_table['ext_table_link']						= $ext_table_link;				
		$sync_table['sync_filds']							= $sync_filds;
		$this -> sync_tables[]								= $sync_table;	
//		$this -> copy_tables[]='public.doors_groups';
		$sync_table 												= array();	
		$sync_table['sync_fl']										= true;		
		$sync_table['table_name']									= "public.doors_groups";
		$sync_table['table_base_sql']								= "SELECT public.doors_groups.* FROM public.doors_groups WHERE public.doors_groups.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']								= "SELECT public.doors_groups.* FROM public.doors_groups WHERE public.doors_groups.factory_id='$this->factory_dest_id'";
		$sync_filds 												= array();
		$sync_filds['id']['sync_table']								= "doors_groups";
		$sync_filds['factory_id']['sync_value']						= "$this->factory_dest_id";
		$sync_filds['folder_id']['sync_table']						= "doors_folders";
		$sync_filds['folder_id']['null_value']						= FALSE;
		$sync_filds['rama_list_id']['sync_table']					= "lists";
		$sync_filds['door_sill_list_id']['sync_table']				= "lists";
		$sync_filds['stvorka_list_id']['sync_table']				= "lists";
		$sync_filds['impost_list_id']['sync_table']					= "lists";
		$sync_filds['shtulp_list_id']['sync_table']					= "lists";
		$sync_filds['rama_sill_list_id']['sync_table']				= "lists";
		$ext_table_link												= array(); //таблицы для выборочной синхронизации текущей таблицы
		$ext_table_link['doors_groups_dependencies']['name']		= 'doors_groups_dependencies';
		$ext_table_link['doors_laminations_dependencies']['name']	= 'doors_laminations_dependencies';
		$sync_table['ext_table_link']								= $ext_table_link;		
		$sync_table['sync_filds']									= $sync_filds;
		$this -> sync_tables[]										= $sync_table;				
//		$this -> copy_tables[]='public.doors_groups_dependencies';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.doors_groups_dependencies";
		$sync_table['table_base_sql']					= "SELECT public.doors_groups_dependencies.* FROM public.doors_groups_dependencies JOIN public.doors_groups on public.doors_groups.id=public.doors_groups_dependencies.doors_group_id WHERE public.doors_groups.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.doors_groups_dependencies.* FROM public.doors_groups_dependencies JOIN public.doors_groups on public.doors_groups.id=public.doors_groups_dependencies.doors_group_id WHERE public.doors_groups.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "doors_groups_dependencies";
		$sync_filds['doors_group_id']['sync_table']		= "doors_groups";
		$sync_filds['doors_group_id']['null_value']		= FALSE;
		$sync_filds['hardware_group_id']['sync_table']	= "doors_hardware_groups";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;										
//		$this -> copy_tables[]='public.doors_laminations_dependencies';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.doors_laminations_dependencies";
		$sync_table['table_base_sql']					= "SELECT public.doors_laminations_dependencies.* FROM public.doors_laminations_dependencies JOIN public.doors_groups on public.doors_groups.id=public.doors_laminations_dependencies.group_id WHERE public.doors_groups.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.doors_laminations_dependencies.* FROM public.doors_laminations_dependencies JOIN public.doors_groups on public.doors_groups.id=public.doors_laminations_dependencies.group_id WHERE public.doors_groups.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "doors_laminations_dependencies";
		$sync_filds['group_id']['sync_table']			= "doors_groups";
		$sync_filds['group_id']['null_value']			= FALSE;
		$sync_filds['lamination_in']['sync_table']		= "lamination_factory_colors";
		$sync_filds['lamination_in']['null_value']		= "1";
		$sync_filds['lamination_out']['sync_table']		= "lamination_factory_colors";
		$sync_filds['lamination_out']['null_value']		= "1";		
		$sync_filds['rama_list_id']['sync_table']		= "lists";
		$sync_filds['door_sill_list_id']['sync_table']	= "lists";
		$sync_filds['stvorka_list_id']['sync_table']	= "lists";
		$sync_filds['impost_list_id']['sync_table']		= "lists";
		$sync_filds['shtulp_list_id']['sync_table']		= "lists";
		$sync_filds['rama_sill_list_id']['sync_table']	= "lists";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;																			
//		$this -> copy_tables[]='public.elements_profile_systems';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.elements_profile_systems";
		$sync_table['table_base_sql']					= "SELECT public.elements_profile_systems.* FROM public.elements_profile_systems JOIN public.elements on public.elements.id=public.elements_profile_systems.element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.elements_profile_systems.* FROM public.elements_profile_systems JOIN public.elements on public.elements.id=public.elements_profile_systems.element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "elements_profile_systems";
		$sync_filds['element_id']['sync_table']			= "elements";
		$sync_filds['element_id']['null_value']			= FALSE;
		$sync_filds['profile_system_id']['sync_table']	= "profile_systems";
		$sync_filds['profile_system_id']['null_value']	= FALSE;		
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;																									
//		$this -> copy_tables[]='public.beed_profile_systems';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.beed_profile_systems";
		$sync_table['table_base_sql']					= "SELECT public.beed_profile_systems.* FROM public.beed_profile_systems JOIN public.lists on public.lists.id=public.beed_profile_systems.list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.beed_profile_systems.* FROM public.beed_profile_systems JOIN public.lists on public.lists.id=public.beed_profile_systems.list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "beed_profile_systems";
		$sync_filds['list_id']['sync_table']			= "lists";
		$sync_filds['profile_system_id']['sync_table']	= "profile_systems";
		$sync_filds['profile_system_id']['null_value']	= FALSE;
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;																									
//		$this -> copy_tables[]='public.profile_laminations';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.profile_laminations";
		$sync_table['table_base_sql']					= "SELECT public.profile_laminations.* FROM public.profile_laminations JOIN public.profile_systems on profile_systems.id=public.profile_laminations.profile_id JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.profile_laminations.* FROM public.profile_laminations JOIN public.profile_systems on profile_systems.id=public.profile_laminations.profile_id JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "profile_laminations";
		$sync_filds['profile_id']['sync_table']			= "profile_systems";
		$sync_filds['profile_id']['null_value']			= FALSE;
		$sync_filds['lamination_in_id']['sync_table']	= "lamination_factory_colors";
		$sync_filds['lamination_in_id']['null_value']	= "1";
		$sync_filds['lamination_out_id']['sync_table']	= "lamination_factory_colors";
		$sync_filds['lamination_out_id']['null_value']	= "1";
		$sync_filds['rama_list_id']['sync_table']		= "lists";
		$sync_filds['rama_still_list_id']['sync_table']	= "lists";
		$sync_filds['stvorka_list_id']['sync_table']	= "lists";
		$sync_filds['impost_list_id']['sync_table']		= "lists";
		$sync_filds['shtulp_list_id']['sync_table']		= "lists";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;
//		$this -> copy_tables[]='public.mosquitos';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.mosquitos";
		$sync_table['table_base_sql']					= "SELECT public.mosquitos.* FROM public.mosquitos JOIN public.profile_systems on profile_systems.id=public.mosquitos.profile_id JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.mosquitos.* FROM public.mosquitos JOIN public.profile_systems on profile_systems.id=public.mosquitos.profile_id JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "mosquitos";
		$sync_filds['profile_id']['sync_table']			= "profile_systems";
		$sync_filds['profile_id']['null_value']			= FALSE;
		$sync_filds['bottom_id']['sync_table']			= "lists";
		$sync_filds['left_id']['sync_table']			= "lists";
		$sync_filds['right_id']['sync_table']			= "lists";
		$sync_filds['top_id']['sync_table']				= "lists";
		$sync_filds['cloth_id']['sync_table']			= "lists";
		$sync_filds['group_id']['sync_table']			= "addition_folders";
		$sync_filds['group_id']['null_value']			= "0";				
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;						
//		$this -> copy_tables[]='public.similarities';					
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.similarities";
		$sync_table['table_base_sql']					= "SELECT public.similarities.* FROM public.similarities WHERE public.similarities.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.similarities.* FROM public.similarities WHERE public.similarities.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "similarities";
		$sync_filds['factory_id']['sync_value']			= "$this->factory_dest_id";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;						
//		$this -> copy_tables[]='public.glass_similarities';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.glass_similarities";
		$sync_table['table_base_sql']					= "SELECT public.glass_similarities.* FROM public.glass_similarities JOIN public.elements on public.elements.id=public.glass_similarities.element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.glass_similarities.* FROM public.glass_similarities JOIN public.elements on public.elements.id=public.glass_similarities.element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "glass_similarities";
		$sync_filds['element_id']['sync_table']			= "elements";
		$sync_filds['profile_system_id']['sync_table']	= "profile_systems";
		$sync_filds['profile_system_id']['null_value']	= FALSE;		
		$sync_filds['similarity_id']['sync_table']		= "similarities";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;												
//		$this -> copy_tables[]='public.window_hardware_type_ranges';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.window_hardware_type_ranges";
		$sync_table['table_base_sql']					= "SELECT public.window_hardware_type_ranges.* FROM public.window_hardware_type_ranges WHERE public.window_hardware_type_ranges.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.window_hardware_type_ranges.* FROM public.window_hardware_type_ranges WHERE public.window_hardware_type_ranges.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "window_hardware_type_ranges";
		$sync_filds['factory_id']['sync_value']			= "$this->factory_dest_id";
		$sync_filds['group_id']['sync_table']			= "window_hardware_groups";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;																
//		$this -> copy_tables[]='public.window_hardware_handles';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.window_hardware_handles";
		$sync_table['table_base_sql']					= "SELECT public.window_hardware_handles.* FROM public.window_hardware_handles JOIN public.lists on public.lists.id=public.window_hardware_handles.list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.window_hardware_handles.* FROM public.window_hardware_handles JOIN public.lists on public.lists.id=public.window_hardware_handles.list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "window_hardware_handles";
		$sync_filds['list_id']['sync_table']			= "lists";
		$sync_filds['list_id']['null_value']			= FALSE;
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;																					
//		$this -> copy_tables[]='public.glass_prices';											
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.glass_prices";
		$sync_table['table_base_sql']					= "SELECT public.glass_prices.* FROM public.glass_prices JOIN public.elements on public.elements.id=public.glass_prices.element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.glass_prices.* FROM public.glass_prices JOIN public.elements on public.elements.id=public.glass_prices.element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "glass_prices";
		$sync_filds['element_id']['sync_table']			= "elements";
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;
		//$this -> copy_tables[]='public.lock_lists';
		$sync_table 							= array();	
		$sync_table['table_name']				= "public.lock_lists";
		$sync_table['table_base_sql']			= "SELECT public.lock_lists.* FROM public.lock_lists JOIN public.lists on public.lists.id=public.lock_lists.list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']			= "SELECT public.lock_lists.* FROM public.lock_lists JOIN public.lists on public.lists.id=public.lock_lists.list_id JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.elements.factory_id='$this->factory_dest_id'";
		$sync_filds 							= array();
		$sync_filds['id']['sync_table']			= "lock_lists";
		$sync_filds['list_id']['sync_table']	= "lists";
		$sync_filds['group_id']['sync_table']	= "doors_hardware_groups";							
		$sync_table['sync_filds']				= $sync_filds;
		$this -> sync_tables[]					= $sync_table;
		//$this -> copy_tables[]='public.mosquitos_singles';
		$sync_table 									= array();	
		$sync_table['table_name']						= "public.mosquitos_singles";
		$sync_table['table_base_sql']					= "SELECT public.mosquitos_singles.* FROM public.mosquitos_singles WHERE public.mosquitos_singles.factory_id='$this->factory_base_id'";
		$sync_table['table_dest_sql']					= "SELECT public.mosquitos_singles.* FROM public.mosquitos_singles WHERE public.mosquitos_singles.factory_id='$this->factory_dest_id'";
		$sync_filds 									= array();
		$sync_filds['id']['sync_table']					= "mosquitos_singles";
		$sync_filds['factory_id']['sync_value']			= "$this->factory_dest_id";
		$sync_filds['bottom_id']['sync_table']			= "lists";
		$sync_filds['left_id']['sync_table']			= "lists";
		$sync_filds['right_id']['sync_table']			= "lists";
		$sync_filds['top_id']['sync_table']				= "lists";
		$sync_filds['cloth_id']['sync_table']			= "lists";
		$sync_filds['group_id']['sync_table']			= "addition_folders";
		$sync_filds['group_id']['null_value']			= "0";				
		$sync_table['sync_filds']						= $sync_filds;
		$this -> sync_tables[]							= $sync_table;						
	}
	
	public function linkdb($db='steko_prod')
	{
		return pg_pconnect('host=localhost port=5432 dbname='.$db.' user=bauvoice password=7LWLiLLWBUbn');
	}

	public function basefactory()
	{
		$this->factory_base_id		= $_SESSION['user_id'];
		$sql="SELECT	public.users.code_sync,
						public.factories.name
				FROM	public.users
			LEFT JOIN	public.factories on public.factories.id=public.users.id  
				WHERE	public.factories.id='$this->factory_base_id'";
		$result	= CDatabase::GetResult($sql);
		$row 	= CDatabase::FetchRow($result);
		if (isset($row))
		{
			$this->factory_base_sync	= $row[0];
			$this->factory_base_name	= $row[1];
		}
		return;	
	}

	public function destfactory()
	{
		if (!isset($_SESSION['factory_dest_id']))
		{
			if (isset($this->factory_base_id))
			{
				$dest_factories = $this->get_dest_factories();
				foreach ($dest_factories as $dest_factory_id => $dest_factory_arr)
				{ 
					if ($dest_factory_id==$this->factory_base_id) unset($dest_factories[$dest_factory_id]);
				}
				reset($dest_factories);
				$_SESSION['factory_dest_id'] = key($dest_factories);
			}
		} 	
		$this->factory_dest_id		= $_SESSION['factory_dest_id'];
		$sql="SELECT	public.users.code_sync,
						public.factories.name
				FROM	public.users
			LEFT JOIN	public.factories on public.factories.id=public.users.id  
				WHERE	public.factories.id='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		$row 	= CDatabase::FetchRow($result);
		if (isset($row))
		{
			$this->factory_dest_sync	= $row[0];
			$this->factory_dest_name	= $row[1];
		}
		return;	
	}

	public function get_dest_factories()
	{
		$factory_arr	= array();
		$sql="SELECT	public.users.id,
						public.users.code_sync,
						public.factories.name
				FROM	public.users
			LEFT JOIN	public.factories on public.factories.id=public.users.id  
				WHERE public.factories.name is not NULL";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$factory_arr[$row[0]]['name']=$row[2];
			$factory_arr[$row[0]]['code_sync']=$row[1];
		}
		return $factory_arr;
	}

	//форма отметки синхронизируемых элементов	
	public function check_sync_form_table($sync_table)
	{
		$form_sync_data	= $bd->get_form_sync_data();
		foreach ($form_sync_data as $form_sync_data_key => $form_sync_data_arr)
		{
			$name	= $form_sync_data_arr["name"];
			$t_sync	= $form_sync_data_arr["table"];
			if ($t_sync==$sync_table)
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
					else
					{	
//						if ($_SESSION["form_sync_".$sync_table."_check"])
//						{
							echo "<tr id='chek_tr_$table_key_$key'>";
							echo "<td style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/uncheck.png' height='20px'></td>";
							echo "<td style='float:left;font-size: 15px;margin:5px;'>$element_name</td>";
							echo "</tr>";
//						}
					}
				}
				echo "</table></td>";
			}
		}	
//		echo "$sync_table  -> ".$_SESSION["form_sync_".$sync_table."_check"];
		return;
	}
	
	//форма отметки синхронизируемых элементов	
	public function check_sync_form($table_arr, $table_key, $check_element=0)
	{
		$table_sync_arr	= array();
		$sql="SELECT	add.basesync.table_sync,
						add.basesync.bcode_sync,
						add.basesync.table_id
				FROM	add.basesync
				WHERE	add.basesync.factory_sync='$this->factory_dest_id'";			
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_sync_arr[$row[0]][$row[1]]=$row[2];		
		}
		$check_sync_arr	= array();
		$sql="SELECT	add.tablesync.table_sync,
						add.tablesync.bcode_sync
				FROM	add.tablesync
				WHERE	add.tablesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$check_sync_arr[$row[0]][$row[1]]=1;		
		}
		$table_data				= $table_arr["table_name"];
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$table_filds_key_arr= array_flip($table_filds_name_arr);		
		$table_base	= array(); //базовая таблица		
		$sql=$table_arr["table_base_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_base[$row[$key_id]]=$row;		
		}
		$base_crc32=crc32(serialize($table_base));   //crc-код базовой таблицы (для проверки изменений)
		$table_dest	= array(); //синхронизируемая таблица
		$sql=$table_arr["table_dest_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_dest[$row[$key_id]]=$row;			
		}
		echo "<td colspan=4><table>";
		foreach ($table_base as $key => $data_arr)
		{
			if (isset($check_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$key]))
			{				
				echo "<tr id='chek_tr_$table_key_$key'>";
				echo "<td onclick=\"ajax_post('check_sync=$key&value=0&t_id=$table_key&data_name=".$data_arr[1]."','chek_tr_$table_key_$key');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/check.png' height='20px'></td>";
				echo "<td style='float:left;font-size: 15px;margin:5px;'>".$data_arr[1]."</td>";
				echo "</tr>";				
			}
			else
			{
				if ($check_element == 0)
				{	
					echo "<tr id='chek_tr_$table_key_$key'>";
					echo "<td onclick=\"ajax_post('check_sync=$key&value=1&t_id=$table_key&data_name=".$data_arr[1]."','chek_tr_$table_key_$key');\" style='cursor:pointer;font-size: 15px;margin:5px'><img src='img/uncheck.png' height='20px'></td>";
					echo "<td style='float:left;font-size: 15px;margin:5px;'>".$data_arr[1]."</td>";
					echo "</tr>";
				}
			}			
		}
		echo "</table></td>";
//		var_dump($table_base);
		return;
	}
	
	//форма выборочной синхронизации между заводами в одной базе	
	public function sync_form()
	{
		echo "<table>";
		echo "<tr>";
		echo "<td colspan=4>";
		echo "<div OnClick=\"if (confirm('Синхронизировать базу?')) ajax_post('sync_factory=3&t_id=0','table_0');\" class='button1' style='cursor:pointer;float:left;background:grey;padding:5px;'>Синхронизировать</div>";
		echo "</td>";
		echo "</tr>";
		foreach ($this->sync_tables as $table_key => $table_arr)
		{
			echo "<tr>";		
			echo "<td><img OnClick=\"ajax_post('sync_factory=check_element&t_id=$table_key','check_table_$table_key');\" src='img/down_arrow_info.png' style='height:20px'></td>";
			echo "<td><div class='button1' style='cursor:default;background:grey;padding:5px;color:#ff643a;margin:5px;'>".$table_arr['table_name']."</div></td>";
			echo "<td><img src='img/down_arrow_info.png' style='height:20px;transform: rotate(-90deg)'></td>";
			echo "<td></td>";
			echo "</tr>";
			echo "<tr id=check_table_$table_key></tr>";
		}	
		echo "</table>";
		return;
	}
	//форма выборочной синхронизации между заводами в одной базе	
	public function copy_form()
	{
		echo "<table>";
		echo "<tr>";
		echo "<td colspan=4>";
		echo "<div OnClick=\"if (confirm('Копировать базу?')) ajax_post('sync_factory=2&t_id=0','table_0');\" class='button1' style='float:left;background:grey;padding:5px;'>Копировать</div>";
		echo "</td>";
		echo "</tr>";
		foreach ($this->sync_tables as $table_key => $table_arr)
		{
			echo "<tr>";		
			echo "<td><div class='button1' style='cursor:default;background:grey;padding:5px;color:#ff643a;margin:5px;'>".$table_arr['table_name']."</div></td>";
			echo "<td></td>";
			echo "<td></td>";
			echo "<td></td>";
			echo "</td>";
			echo "</tr>";
		}	
		echo "</table>";
		return;
	}

	//синхронизация таблицы между заводами в одной базе
	public function table_sync($table_arr)
	{
		$mem0=memory_get_usage();
		$start = microtime(true);
		//заполнение индексов таблиц
		$this->set_metadata();
		//заполнение всех элементов базового завода
		$this->set_table_base_all();
		//получение таблицы связанных элементов
		$this->linked_sync_tables();
		//получение актуальной таблицы синхронизации
		$table_sync 			= $this->get_table_sync();
		$this->table_sync		= $table_sync;
		$table_sync_arr 		= $table_sync['table_sync_arr'];
		$table_dest_sync_arr	= $table_sync['table_dest_sync_arr'];
		//------
		$check_sync_arr	= $this->get_check_sync();
		$this->check_sync_arr = $check_sync_arr;
		//--выбираем отмеченные наборы 
		$this->sync_check_list();	
//синхронизация выбранных элементов
		$del_arr = array(); 	//массив удаляемых элементов c указанием таблицы и id_elementa
		foreach ($this->sync_tables as $current_key => $table_arr)
		{	
			$table_data				= $table_arr["table_name"];
			$table_filds_name_arr	= $table_arr['table_filds_name'];
			$table_filds_key_arr	= $table_arr['table_filds_key'];
			$key_id					= $table_arr['table_key_id'];			
			$table_base				= $table_arr['table_base']; 	//базовая таблица		
			$table_dest				= $table_arr['table_dest']; 	//синхронизируемая таблица			
			foreach ($table_base as $key => $data_arr)
			{
				if (empty($data_arr))
				{
//echo "элемент: $key в таблице: $table_data не найден.<br>";
					continue;
				}	
				$arr_base	= $data_arr;			
				$key_sync	= $table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$key];
				if (empty($key_sync)) //нет строки в целевой таблице
				{
					$into_name	= "";
					$into_value	= "";
					$insert_status=1;	
					foreach ($table_filds_name_arr as $data_key => $data_value)
					{									
						if ($table_filds_name_arr[$data_key]<>'id')
						{						
							if ($into_name<>"")
							{
								$into_name .=', '.$data_value;
							}
							else
							{
								$into_name .=$data_value;
							}
						}			
					}
					foreach ($data_arr as $data_key => $data_value)
					{
						if ($table_filds_name_arr[$data_key]<>'id')
						{
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
							{
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
								$sql_value	= $this->get_SQLvalue($sync_value);
								if ($sql_value=='NULL')
								{
									$table_sync_arr = $this -> element_insert_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'], $table_sync_arr);
									$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];							
									$sql_value	= $this->get_SQLvalue($sync_value);
								}								
								if ($sql_value=='NULL')
								{								
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
										{
											if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
											{
												$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
											}
											else 
											{
												$insert_status=0; //запрет вставки строк
											}
										}
										elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
										{
											$insert_status=0; //запрет вставки строки	
										}
										else 
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
										}									
									}	
								}							
							}
							elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
							{
								$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
							}	
							elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
							{
								$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
								{
									$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];								
									$sql_value	= $this->get_SQLvalue($sync_value);
									if ($sql_value=='NULL')
									{
										$table_sync_arr = $this -> element_insert_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table'], $table_sync_arr);
										$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];
										$sql_value	= $this->get_SQLvalue($sync_value);
									}																	
									if ($sql_value=='NULL')
									{
										if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
										{
											if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
											{
												if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
												{
													$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
												}
												else 
												{
													$insert_status=0; //запрет вставки строк
												}
											}
											elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
											{
												$insert_status=0; //запрет вставки строки	
											}
											else 
											{
												$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
											}									
										}
									}							
								}
								else 
								{
//									echo "ошибка!!!";
									$sql_value	= $this->get_SQLvalue($data_value);								
								}
							}												
							else 
							{
								$sql_value	= $this->get_SQLvalue($data_value);
							}
							if ($into_value<>"")
							{
								$into_value .= ', '.$sql_value;
							}
							else
							{
								$into_value .= $sql_value;
							}
						}
						else 
						{
							$bcode_sync			= $this->get_SQLvalue($data_value);
							$bcode_sync_value	= $data_value;		
						}			
					}
					if ($insert_status===1)
					{
						$sql_insert='INSERT INTO '.$table_data.' ('.$into_name.') VALUES ('.$into_value.') RETURNING id;';
//echo $sql_insert.'<br>';				
						$result			= CDatabase::GetResult($sql_insert);
						$row_insert		= CDatabase::FetchRow($result);
						if (empty($row_insert[0]))
						{
							echo "alert ";					
							echo "ERROR:insert ".$sql_insert;
							var_dump($data_arr);
							exit;
						}
						$base_sync		= $this->get_SQLvalue($this->factory_dest_sync);
						$table_sync		= $this->get_SQLvalue($table_arr['sync_filds']['id']['sync_table']);
						$table_id		= $this->get_SQLvalue($row_insert[0]);
						$factory_sync	= $this->get_SQLvalue($this->factory_dest_id);  
						$sql_sync		= "INSERT INTO add.basesync (base_sync, bcode_sync, table_sync, table_id, factory_sync) VALUES	($base_sync, $bcode_sync, $table_sync, $table_id, $factory_sync) RETURNING id";
//echo $sql_sync.'<br>';											
						$result			= CDatabase::GetResult($sql_sync);
						$row_sync		= CDatabase::FetchRow($result);
						if (empty($row_sync[0]))
						{
							echo "alert ERROR:sync ".$sql_sync;
							exit;
						}
						$table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$bcode_sync_value]=$row_insert[0];
					}
				}
				else
				{
//echo "Обновление строки:";
					$arr_sync		= array();
					$set_value		= "";
					$update_where	= "";
					$update_status=1;
					foreach ($data_arr as $data_key => $data_value)
					{			
						if ($table_filds_name_arr[$data_key]=='id')
						{
							$update_id	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
							$update_where = ' WHERE id='.$update_id.';';
						}
						else
						{
							if 	(!isset($table_arr['sync_filds']['sync_filds_update_fix'][$table_filds_name_arr[$data_key]]))
							{
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
								{
									$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
									$sql_value	= $this->get_SQLvalue($sync_value);
									//если это ссылка на удаляемый элемент таблицы - отменим удаление 
									if (isset($del_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']."_".$sync_value]))									
									{
										unset($del_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']."_".$sync_value]);
									}
									if ($sql_value=='NULL')
									{
										if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
										{
											if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
											{
												if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
												{
													$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
												}
												else 
												{
													$update_status=0; //запрет обновления строк
												}
											}
											elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
											{
												$update_status=0; //запрет обновления строки	
											}
											else 
											{
												$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
											}									
										}									
									}															
								}
								elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
								{
									$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
								}	
								elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
								{
									$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
									{
										$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];
										$sql_value	= $this->get_SQLvalue($sync_value);
										//если это ссылка на удаляемый элемент таблицы - отменим удаление 
										if (isset($del_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']."_".$sync_value]))									
										{
											unset($del_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']."_".$sync_value]);
										}										
										if ($sql_value=='NULL')
										{
											if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
											{
												if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
												{
													if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
													{
														$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
													}
													else 
													{
														$update_status=0; //запрет обновления строк
													}
												}
												elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
												{
													$update_status=0; //запрет обновления строки	
												}
												else 
												{
													$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
												}									
											}
										}																							
									}
									else 
									{
//										echo "ошибка!!!";
										$sql_value	= $this->get_SQLvalue($data_value);								
									}
								}
								else 
								{
									$sql_value	= $this->get_SQLvalue($data_value);
								}
								if ($set_value<>"")
								{
									$set_value .= ', '.$table_filds_name_arr[$data_key].'='.$sql_value;
								}
								else
								{
									$set_value .= $table_filds_name_arr[$data_key].'='.$sql_value;
								}
							}
						}
					}
					if ($update_status===1)
					{
						$sql_upd='UPDATE '.$table_data.' SET '.$set_value.$update_where;
//echo $sql_upd.'<br>';				
						$result	= CDatabase::ExecuteQuery($sql_upd);
						if (isset($table_dest[$update_id]))
						{
							unset($table_dest[$update_id]);
						}	
					}
				}
			}
//echo "Удаление несинхронизированных строк таблицы:";
			foreach ($table_dest as $key => $data_arr)
			{
				$sql_del	= 'DELETE FROM '.$table_data.' WHERE id='.$key.';';
				$sync_id	= $this->get_destSyncId($table_arr['sync_filds']['id']['sync_table'], $key);
				if (!empty($sync_id))
				{			
					$sql_del	.= 'DELETE FROM add.basesync WHERE id='.$sync_id.';';
				}
//echo $sql_del;
				$del_arr[$table_arr['sync_filds']['id']['sync_table']."_".$key]=$sql_del;				
//				$result	= CDatabase::ExecuteQuery($sql_del);
			}
		}
//echo "<br> Script memori: ".(memory_get_usage()-$mem0-sizeof($mem0))." bytes<br>";
//echo 'Время выполнения скрипта: '.(microtime(true) - $start).' сек.<br>';
//var_dump($del_arr);
foreach (array_reverse($del_arr) as $sql_del)
{
//	echo $sql_del."<br>";
	$result	= CDatabase::ExecuteQuery($sql_del);	
}
//exit;
//		$this->sync_price();	
		return;
	}

	//Получение таблицы отметок синхронизации
	public function get_check_sync()
	{
		$check_sync_arr	= array();
		$sql="SELECT	add.tablesync.table_sync,
						add.tablesync.bcode_sync
				FROM	add.tablesync
				WHERE	add.tablesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$check_sync_arr[$row[0]][$row[1]]=1;		
		}
		return ($check_sync_arr);
	}
	
	//Синхронизация цен
	public function sync_price()
	{
		$sql_price_base="";
		$sql_price_dest="";
//		echo "<br>$sql_price_base<br>$sql_price_dest";
		return;
	}

	//Синхронизация наборов
	public function sync_check_list()
	{
		//выбираем отмеченные стеклопакеты
		//$this->check_sync_arr['lists'])  - отмеченнные наборы
		//ищем таблицу наборов для передачи
		foreach ($this->sync_tables as $current_key => $table_arr)
		{
			if ($table_arr['sync_filds']['id']['sync_table']=="lists")
			{
				$table_base				= $table_arr['table_base'];
				$table_filds_name_arr	= $table_arr['table_filds_name'];
				$table_filds_key_arr	= $table_arr['table_filds_key'];
				$key_id					= $table_arr['table_key_id'];			
				$table_base				= $table_arr['table_base'];  //базовая таблица
				$sp_base6				= array(); //массив отобранных стеклопакетов
				$sp_uncheck6			= array(); //массив стеклопакетов для удаления
				$sp_base8				= array(); //массив отобранных наборов
				$sp_uncheck8			= array(); //массив наборов для удаления
				$sp_base9				= array(); //массив отобранных наборов
				$sp_uncheck9			= array(); //массив наборов для удаления
				$sp_base12				= array(); //массив отобранных наборов
				$sp_uncheck12			= array(); //массив наборов для удаления
				$sp_base20				= array(); //массив отобранных наборов
				$sp_uncheck20			= array(); //массив наборов для удаления
				$sp_base21				= array(); //массив отобранных наборов
				$sp_uncheck21			= array(); //массив наборов для удаления
				$sp_base24				= array(); //массив отобранных наборов
				$sp_uncheck24			= array(); //массив наборов для удаления																								
				//Выбираем стеклопакеты
				foreach ($table_base as $list_id => $list_arr)
				{
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 6)
					{
						$sp_base6[$list_id] = $list_arr;
						$sp_uncheck6[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck6[$list_id]);
						}	
					}
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 8)
					{
						$sp_base8[$list_id] = $list_arr;
						$sp_uncheck8[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck8[$list_id]);
						}	
					}
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 9)
					{
						$sp_base9[$list_id] = $list_arr;
						$sp_uncheck9[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck9[$list_id]);
						}	
					}
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 12)
					{
						$sp_base12[$list_id] = $list_arr;
						$sp_uncheck12[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck12[$list_id]);
						}	
					}
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 20)
					{
						$sp_base20[$list_id] = $list_arr;
						$sp_uncheck20[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck20[$list_id]);
						}	
					}
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 21)
					{
						$sp_base21[$list_id] = $list_arr;
						$sp_uncheck21[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck21[$list_id]);
						}	
					}
					if ($list_arr[$table_filds_key_arr['list_group_id']] == 24)
					{
						$sp_base24[$list_id] = $list_arr;
						$sp_uncheck24[$list_id] = $list_arr;
						if (isset($this->check_sync_arr['lists'][$list_id]))
						{
							unset($sp_uncheck24[$list_id]);
						}	
					}
				}
				if (count($sp_uncheck6) < count($sp_base6) and count($sp_base6) > 0.5)
				{
					$this->clearCheckList($sp_uncheck6);
				}
				if (count($sp_uncheck8) < count($sp_base8) and count($sp_base8) > 0.5)
				{
					$this->clearCheckList($sp_uncheck8);
				}
				if (count($sp_uncheck9) < count($sp_base9) and count($sp_base9) > 0.5)
				{
					$this->clearCheckList($sp_uncheck9);
				}
				if (count($sp_uncheck12) < count($sp_base12) and count($sp_base12) > 0.5)
				{
					$this->clearCheckList($sp_uncheck12);
				}
				if (count($sp_uncheck20) < count($sp_base20) and count($sp_base20) > 0.5)
				{
					$this->clearCheckList($sp_uncheck20);
				}
				if (count($sp_uncheck21) < count($sp_base21) and count($sp_base21) > 0.5)
				{
					$this->clearCheckList($sp_uncheck21);
				}
				if (count($sp_uncheck24) < count($sp_base24) and count($sp_base24) > 0.5)
				{
					$this->clearCheckList($sp_uncheck24);
				}
			}
		}		
		return;
	}

	//очистка невыбранных доп. элементов 
	public function clearCheckList($list_uncheck)
	{
		foreach ($this->sync_tables as $current_key => $table_arr)
		{
			if ($table_arr['sync_filds']['id']['sync_table']=="lists")
			{
				$lists_table_key=$current_key;
			}
			if ($table_arr['sync_filds']['id']['sync_table']=="list_contents")
			{
				$table_filds_key_arr		= $table_arr['table_filds_key'];				
				$list_contents_table_key	= $current_key;
			}
		}
		foreach ($list_uncheck as $list_id => $list_arr)
		{
			if (isset($this->sync_tables[$lists_table_key]['table_base'][$list_id]))
			{
				unset($this->sync_tables[$lists_table_key]['table_base'][$list_id]);
				foreach ($this->sync_tables[$list_contents_table_key]['table_base'] as $list_contents_id => $list_contents_arr)
				{
					if ($list_contents_arr[$table_filds_key_arr['parent_list_id']] == $list_id)
					{
						unset($this->sync_tables[$list_contents_table_key]['table_base'][$list_contents_id]);
					}
				}
			}
		}
		return;		
	}
		
	//добавление элемента для синхронизации
	public function element_insert_sync($element_id, $table_name, $table_sync_arr)
	{
//		echo "добавить ".$element_id." в таблицу: ".$table_name."<br>";
		foreach ($this->sync_tables as $current_key => $table_arr)
		{
			if ($table_arr["sync_filds"]["id"]["sync_table"] == $table_name)
			{
				break;						
			}
		}
		if ($table_arr["sync_filds"]["id"]["sync_table"] <> $table_name)
		{
			echo "error";
			exit;					
		}				
		$table_data				= $table_arr["table_name"];
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$table_filds_key_arr= array_flip($table_filds_name_arr);		
		$table_base	= array(); //базовая таблица		
//		$sql="SELECT * FROM ".$table_arr["table_name"]." WHERE id='$element_id'";
		$sql=$table_arr["table_base_sql"]." and ".$table_arr["table_name"].".id='$element_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_base[$row[$key_id]]=$row;		
		}
		foreach ($table_base as $key => $data_arr)
		{
			$arr_base	= $data_arr;			
			$key_sync	= $table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$key];
			if (empty($key_sync)) //нет строки в целевой таблице
			{
				$into_name	= "";
				$into_value	= "";
				$insert_status=1;	
				foreach ($table_filds_name_arr as $data_key => $data_value)
				{									
					if ($table_filds_name_arr[$data_key]<>'id')
					{						
						if ($into_name<>"")
						{
							$into_name .=', '.$data_value;
						}
						else
						{
							$into_name .=$data_value;
						}
					}			
				}
				foreach ($data_arr as $data_key => $data_value)
				{
					if ($table_filds_name_arr[$data_key]<>'id')
					{
						if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
						{
//echo $table_filds_name_arr[$data_key]." -> ".$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']."<br>";							
							$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];							
							$sql_value	= $this->get_SQLvalue($sync_value);
							if ($sql_value=='NULL')
							{
								$table_sync_arr = $this -> element_insert_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'], $table_sync_arr);
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];							
								$sql_value	= $this->get_SQLvalue($sync_value);
							}
							if ($sql_value=='NULL')
							{
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
								{
									if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
									{
										$insert_status=0; //запрет вставки строки	
									}
									else 
									{
										$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
									}									
								}	
							}							
						}
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
						{
							$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
						}	
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
						{
							$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
							{
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];								
								$sql_value	= $this->get_SQLvalue($sync_value);
								if ($sql_value=='NULL')
								{
									$table_sync_arr = $this -> element_insert_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table'], $table_sync_arr);
									$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];
									$sql_value	= $this->get_SQLvalue($sync_value);
								}								
								if ($sql_value=='NULL')
								{
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
										{
											$insert_status=0; //запрет вставки строки	
										}
										else 
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
										}
									}
								}							
							}
							else 
							{
//								echo "ошибка!!!";
								$sql_value	= $this->get_SQLvalue($data_value);								
							}
						}												
						else 
						{
							$sql_value	= $this->get_SQLvalue($data_value);
						}
						if ($into_value<>"")
						{
							$into_value .= ', '.$sql_value;
						}
						else
						{
							$into_value .= $sql_value;
						}
					}
					else 
					{
						$bcode_sync			= $this->get_SQLvalue($data_value);		
						$bcode_sync_value	= $data_value;
					}			
				}
				if ($insert_status===1)
				{
					$sql_insert='INSERT INTO '.$table_data.' ('.$into_name.') VALUES ('.$into_value.') RETURNING id;';
echo $sql_insert.'<br>';				
					$result			= CDatabase::GetResult($sql_insert);
					$row_insert		= CDatabase::FetchRow($result);
					if (empty($row_insert[0]))
					{
						echo "alert ";					
						echo "ERROR:insert ".$sql_insert;
						var_dump($data_arr);
						exit;
					}
					$base_sync		= $this->get_SQLvalue($this->factory_dest_sync);
					$table_sync		= $this->get_SQLvalue($table_arr['sync_filds']['id']['sync_table']);
					$table_id		= $this->get_SQLvalue($row_insert[0]);
					$factory_sync	= $this->get_SQLvalue($this->factory_dest_id);  
					$sql_sync		= "INSERT INTO add.basesync (base_sync, bcode_sync, table_sync, table_id, factory_sync) VALUES	($base_sync, $bcode_sync, $table_sync, $table_id, $factory_sync) RETURNING id";
echo $sql_sync.'<br>';											
					$result			= CDatabase::GetResult($sql_sync);
					$row_sync		= CDatabase::FetchRow($result);
					if (empty($row_sync[0]))
					{
						echo "alert ERROR:sync ".$sql_sync;
						exit;
					}
					$table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$bcode_sync_value]=$row_insert[0];
				}
			}
		}				 
		return $table_sync_arr;
	}
	
	//синхронизация связанной таблицы между заводами в одной базе
	public function table_linked_sync($table_arr, $table_linked_arr)
	{
		// контроль таблицы синхронизации
		$basesync_control="";
		$sql	=	"SELECT	add.basesync.id, ".$table_arr["table_name"].".id
					FROM	add.basesync
				LEFT JOIN	".$table_arr["table_name"]." on ".$table_arr["table_name"].".id= CAST (add.basesync.table_id AS INTEGER)
					WHERE	add.basesync.table_sync='elements_profile_systems' 
							and add.basesync.factory_sync='$this->factory_dest_id' 
							and public.elements_profile_systems.id IS NULL";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$basesync_control .="DELETE FROM add.basesync WHERE id='".$row[0]."';";		
		}
		if (!empty($basesync_control))
		{	
//echo $basesync_control;
			$result	= CDatabase::GetResult($basesync_control);
		}
		$table_sync_arr			= array();
		$table_dest_sync_arr	= array();
		$sql="SELECT	add.basesync.table_sync,
						add.basesync.bcode_sync,
						add.basesync.table_id
				FROM	add.basesync
				WHERE	add.basesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_sync_arr[$row[0]][$row[1]]=$row[2];
			$table_dest_sync_arr[$row[0]][$row[2]]=$row[1];		
		}
		$check_sync_arr	= array();
		$sql="SELECT	add.tablesync.table_sync,
						add.tablesync.bcode_sync
				FROM	add.tablesync
				WHERE	add.tablesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$check_sync_arr[$row[0]][$row[1]]=1;		
		}
//var_dump($check_sync_arr);		
//		
		$table_data				= $table_arr["table_name"];
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$table_filds_key_arr= array_flip($table_filds_name_arr);		
		$table_base	= array(); //базовая таблица		
		$sql=$table_arr["table_base_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_base[$row[$key_id]]=$row;		
		}
		$table_base_linked_arr=array();
		foreach ($table_base as $key => $data_arr)
		{
			foreach ($data_arr as $data_key => $data_value)
			{
				if ($table_filds_name_arr[$data_key]<>'id')
				{
					if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
					{
						if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'] == $table_linked_arr['sync_filds']['id']['sync_table'])
						{				
							if 	(isset($check_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value]))
							{
								$table_base_linked_arr[$key]=$table_base[$key];
								continue;
							}
						}		
					}
				}
			}
		}					
		$table_dest	= array(); //синхронизируемая таблица
		$sql=$table_arr["table_dest_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_dest[$row[$key_id]]=$row;			
		}
		$table_dest_linked_arr=array();
		foreach ($table_dest as $key => $data_arr)
		{
			foreach ($data_arr as $data_key => $data_value)
			{
				if ($table_filds_name_arr[$data_key]<>'id')
				{
					if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
					{
						if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'] == $table_linked_arr['sync_filds']['id']['sync_table'])
						{
							$sync_value=$table_dest_sync_arr[$table_linked_arr['sync_filds']['id']['sync_table']][$data_value];
							if 	(isset($check_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$sync_value]))
							{
								$table_dest_linked_arr[$key]=$table_dest[$key];
								continue;
							}
						}	
					}
				}
			}
		}							
		$table_base=$table_base_linked_arr;		
		$table_dest=$table_dest_linked_arr;
//echo count($table_base)." -> ".count($table_dest_linked_arr)."<br>";
		foreach ($table_base as $key => $data_arr)
		{
			$arr_base	= $data_arr;			
			$key_sync	= $table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$key];
			if (empty($key_sync)) //нет строки в целевой таблице
			{
				$into_name	= "";
				$into_value	= "";
				$insert_status=1;	
				foreach ($table_filds_name_arr as $data_key => $data_value)
				{									
					if ($table_filds_name_arr[$data_key]<>'id')
					{						
						if ($into_name<>"")
						{
							$into_name .=', '.$data_value;
						}
						else
						{
							$into_name .=$data_value;
						}
					}			
				}
				foreach ($data_arr as $data_key => $data_value)
				{
					if ($table_filds_name_arr[$data_key]<>'id')
					{
						if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
						{
//echo $table_filds_name_arr[$data_key]." -> ".$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']."<br>";							
							$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];							
							$sql_value	= $this->get_SQLvalue($sync_value);
							if ($sql_value=='NULL')
							{
								$table_sync_arr = $this -> element_insert_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'], $table_sync_arr);
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];							
								$sql_value	= $this->get_SQLvalue($sync_value);
							}
							if ($sql_value=='NULL')
							{
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
								{
									if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
									{
										$insert_status=0; //запрет вставки строки	
									}
									else 
									{
										$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
									}									
								}	
							}							
						}
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
						{
							$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
						}	
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
						{
							$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
							{
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];								
								$sql_value	= $this->get_SQLvalue($sync_value);
								if ($sql_value=='NULL')
								{
									$table_sync_arr = $this -> element_insert_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table'], $table_sync_arr);
									$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];
									$sql_value	= $this->get_SQLvalue($sync_value);
								}								
								if ($sql_value=='NULL')
								{
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
										{
											$insert_status=0; //запрет вставки строки	
										}
										else 
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
										}
									}
								}							
							}
							else 
							{
//								echo "ошибка!!!";
								$sql_value	= $this->get_SQLvalue($data_value);								
							}
						}												
						else 
						{
							$sql_value	= $this->get_SQLvalue($data_value);
						}
						if ($into_value<>"")
						{
							$into_value .= ', '.$sql_value;
						}
						else
						{
							$into_value .= $sql_value;
						}
					}
					else 
					{
						$bcode_sync			= $this->get_SQLvalue($data_value);
						$bcode_sync_value	= $data_value;		
					}			
				}
				if ($insert_status===1)
				{
					$sql_insert='INSERT INTO '.$table_data.' ('.$into_name.') VALUES ('.$into_value.') RETURNING id;';
//echo $sql_insert.'<br>';				
					$result			= CDatabase::GetResult($sql_insert);
					$row_insert		= CDatabase::FetchRow($result);
					if (empty($row_insert[0]))
					{
						echo "alert ";					
						echo "ERROR:insert ".$sql_insert;
						var_dump($data_arr);
						exit;
					}
					$base_sync		= $this->get_SQLvalue($this->factory_dest_sync);
					$table_sync		= $this->get_SQLvalue($table_arr['sync_filds']['id']['sync_table']);
					$table_id		= $this->get_SQLvalue($row_insert[0]);
					$factory_sync	= $this->get_SQLvalue($this->factory_dest_id);  
					$sql_sync		= "INSERT INTO add.basesync (base_sync, bcode_sync, table_sync, table_id, factory_sync) VALUES	($base_sync, $bcode_sync, $table_sync, $table_id, $factory_sync) RETURNING id";
//echo $sql_sync.'<br>';											
					$result			= CDatabase::GetResult($sql_sync);
					$row_sync		= CDatabase::FetchRow($result);
					if (empty($row_sync[0]))
					{
						echo "alert ERROR:sync ".$sql_sync;
						exit;
					}
					$table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$bcode_sync_value]=$row_insert[0];
				}
			}
			else
			{
//echo "Обновление строки:";
				$arr_sync		= array();
				$set_value		= "";
				$update_where	= "";
				$update_status=1;
				foreach ($data_arr as $data_key => $data_value)
				{			
					if ($table_filds_name_arr[$data_key]=='id')
					{
						$update_id	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
						$update_where = ' WHERE id='.$update_id.';';
					}
					else
					{
						if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
						{
							$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
							$sql_value	= $this->get_SQLvalue($sync_value);
							if ($sql_value=='NULL')
							{
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
								{
									if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
									{
										$update_status=0; //запрет обновления строки	
									}
									else 
									{
										$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
									}
								}									
							}															
						}
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
						{
							$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
						}	
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
						{
							$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
							{
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];
								$sql_value	= $this->get_SQLvalue($sync_value);
								if ($sql_value=='NULL')
								{
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
										{
											$update_status=0; //запрет обновления строки	
										}
										else 
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
										}
									}
								}																							
							}
							else 
							{
//								echo "ошибка!!!";
								$sql_value	= $this->get_SQLvalue($data_value);								
							}
						}						
						else 
						{
							$sql_value	= $this->get_SQLvalue($data_value);
						}
						if ($set_value<>"")
						{
							$set_value .= ', '.$table_filds_name_arr[$data_key].'='.$sql_value;
						}
						else
						{
							$set_value .= $table_filds_name_arr[$data_key].'='.$sql_value;
						}
					}
				}
				if ($update_status===1)
				{
					$sql_upd='UPDATE '.$table_data.' SET '.$set_value.$update_where;
//echo $sql_upd.'<br>';				
					$result	= CDatabase::ExecuteQuery($sql_upd);
					unset($table_dest[$update_id]);
				}
			}
		}
//echo "Удаление несинхронизированных строк таблицы:";
		foreach ($table_dest as $key => $data_arr)
		{		
			$sql_del	= 'DELETE FROM '.$table_data.' WHERE id='.$key.';';
			$sync_id	= $this->get_destSyncId($table_arr['sync_filds']['id']['sync_table'], $key);
			if (!empty($sync_id))
			{			
				$sql_del	.= 'DELETE FROM add.basesync WHERE id='.$sync_id.';';
			}
//echo $sql_del.'<br>';				
			$result	= CDatabase::ExecuteQuery($sql_del);
		}
//выбор таблиц с возможными ссылками на текущую таблицу
		foreach ($this->sync_tables as $current_key => $current_arr)
		{
			if ($current_arr == $table_arr)
				continue;
			foreach ($current_arr['sync_filds'] as $sync_table_arr)
			{
				if (isset($sync_table_arr['sync_table']))
					if ($sync_table_arr['sync_table'] == $table_arr['sync_filds']['id']['sync_table'])
					{
						echo $current_key."<br>";
						var_dump($current_arr);
						echo "<br>";
						break;						
					}				 
			}
		}
		return;
	}

	//копирование таблицы между заводами в одной базе
	public function table_copy($table_arr)
	{
//		echo "alert Копирование";exit;
		// контроль таблицы синхронизации
		$basesync_control="";
		$sql	=	"SELECT	add.basesync.id, ".$table_arr["table_name"].".id
					FROM	add.basesync
				LEFT JOIN	".$table_arr["table_name"]." on ".$table_arr["table_name"].".id= CAST (add.basesync.table_id AS INTEGER)
					WHERE	add.basesync.table_sync='".$table_arr['sync_filds']['id']['sync_table']."' 
							and add.basesync.factory_sync='$this->factory_dest_id' 
							and ".$table_arr['table_name'].".id IS NULL";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$basesync_control .="DELETE FROM add.basesync WHERE id='".$row[0]."';";		
		}
		if (!empty($basesync_control))
		{	
//echo $basesync_control;
			$result	= CDatabase::GetResult($basesync_control);
		}
		$table_sync_arr	= array();
		$sql="SELECT	add.basesync.table_sync,
						add.basesync.bcode_sync,
						add.basesync.table_id
				FROM	add.basesync
				WHERE	add.basesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_sync_arr[$row[0]][$row[1]]=$row[2];		
		}
		$table_data				= $table_arr["table_name"];
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$table_filds_key_arr= array_flip($table_filds_name_arr);		
		$table_base	= array(); //базовая таблица		
		$sql=$table_arr["table_base_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_base[$row[$key_id]]=$row;		
		}
		$base_crc32=crc32(serialize($table_base));   //crc-код базовой таблицы (для проверки изменений)
		$table_dest	= array(); //синхронизируемая таблица
		$sql=$table_arr["table_dest_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_dest[$row[$key_id]]=$row;			
		}
		foreach ($table_base as $key => $data_arr)
		{
			$arr_base	= $data_arr;			
//			$key_sync	= $this->get_destSyncValue($table_arr['sync_filds']['id']['sync_table'], $key);
			$key_sync	= $table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$key];
			if (empty($key_sync)) //нет строки в целевой таблице
			{
				$into_name	= "";
				$into_value	= "";
				$insert_status=1;	
				foreach ($table_filds_name_arr as $data_key => $data_value)
				{									
					if ($table_filds_name_arr[$data_key]<>'id')
					{						
						if ($into_name<>"")
						{
							$into_name .=', '.$data_value;
						}
						else
						{
							$into_name .=$data_value;
						}
					}			
				}
				foreach ($data_arr as $data_key => $data_value)
				{
					if ($table_filds_name_arr[$data_key]<>'id')
					{
						if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
						{
//							$sync_value	= $this->get_destSyncValue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'], $data_value);
							$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];							
							$sql_value	= $this->get_SQLvalue($sync_value);
							if ($sql_value=='NULL')
							{
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
								{
									if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
										}
										else 
										{
											$insert_status=0; //запрет вставки строк
										}
									}
									elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
									{
										$insert_status=0; //запрет вставки строки	
									}
									else 
									{
										$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
									}									
								}	
							}							
						}
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
						{
							$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
						}	
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
						{
							$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
							{
//								$sync_value	= $this->get_destSyncValue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table'], $data_value);
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];								
								$sql_value	= $this->get_SQLvalue($sync_value);
								if ($sql_value=='NULL')
								{
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
										{
											if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
											{
												$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
											}
											else 
											{
												$insert_status=0; //запрет вставки строк
											}
										}
										elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
										{
											$insert_status=0; //запрет вставки строки	
										}
										else 
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
										}									
									}
								}							
							}
							else 
							{
//								echo "ошибка!!!";
								$sql_value	= $this->get_SQLvalue($data_value);								
							}
						}												
						else 
						{
							$sql_value	= $this->get_SQLvalue($data_value);
						}
						if ($into_value<>"")
						{
							$into_value .= ', '.$sql_value;
						}
						else
						{
							$into_value .= $sql_value;
						}
					}
					else 
					{
						$bcode_sync			= $this->get_SQLvalue($data_value);
						$bcode_sync_value	= $data_value;		
					}			
				}
				if ($insert_status===1)
				{
					$sql_insert='INSERT INTO '.$table_data.' ('.$into_name.') VALUES ('.$into_value.') RETURNING id;';
//echo $sql_insert.'<br>';				
					$result			= CDatabase::GetResult($sql_insert);
					$row_insert		= CDatabase::FetchRow($result);
					if (empty($row_insert[0]))
					{
						echo "alert ";					
						echo "ERROR:insert ".$sql_insert;
						var_dump($data_arr);
						exit;
					}
					$base_sync		= $this->get_SQLvalue($this->factory_dest_sync);
					$table_sync		= $this->get_SQLvalue($table_arr['sync_filds']['id']['sync_table']);
					$table_id		= $this->get_SQLvalue($row_insert[0]);
					$factory_sync	= $this->get_SQLvalue($this->factory_dest_id);  
					$sql_sync		= "INSERT INTO add.basesync (base_sync, bcode_sync, table_sync, table_id, factory_sync) VALUES	($base_sync, $bcode_sync, $table_sync, $table_id, $factory_sync) RETURNING id";
//echo $sql_sync.'<br>';											
					$result			= CDatabase::GetResult($sql_sync);
					$row_sync		= CDatabase::FetchRow($result);
					if (empty($row_sync[0]))
					{
						echo "alert ERROR:sync ".$sql_sync;
						exit;
					}
					$table_sync_arr[$table_arr['sync_filds']['id']['sync_table']][$bcode_sync_value]=$row_insert[0];
				}
			}
			else
			{
//echo "Обновление строки:";
				$arr_sync		= array();
				$set_value		= "";
				$update_where	= "";
				$update_status=1;
				foreach ($data_arr as $data_key => $data_value)
				{			
					if ($table_filds_name_arr[$data_key]=='id')
					{
//						$sync_value	= $this->get_destSyncValue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'], $data_value);
						$update_id	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
						$update_where = ' WHERE id='.$update_id.';';
					}
					else
					{
						if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
						{
//							$sync_value	= $this->get_destSyncValue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table'], $data_value);
							$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']][$data_value];
							$sql_value	= $this->get_SQLvalue($sync_value);
							if ($sql_value=='NULL')
							{
								if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
								{
									if (is_array($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]))
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'][$data_value]);
										}
										else 
										{
											$insert_status=0; //запрет вставки строк
										}
									}
									elseif ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
									{
										$insert_status=0; //запрет вставки строки	
									}
									else 
									{
										$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
									}									
								}									
							}															
						}
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
						{
							$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
						}	
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
						{
							$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
							{
//								$sync_value	= $this->get_destSyncValue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table'], $data_value);
								$sync_value	= $table_sync_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']][$data_value];
								$sql_value	= $this->get_SQLvalue($sync_value);
								if ($sql_value=='NULL')
								{
									if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']))
									{
										if ($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']===FALSE)
										{
											$update_status=0; //запрет обновления строки	
										}
										else 
										{
											$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value']);
										}
									}
								}																							
							}
							else 
							{
//								echo "ошибка!!!";
								$sql_value	= $this->get_SQLvalue($data_value);								
							}
						}						
						else 
						{
							$sql_value	= $this->get_SQLvalue($data_value);
						}
						if ($set_value<>"")
						{
							$set_value .= ', '.$table_filds_name_arr[$data_key].'='.$sql_value;
						}
						else
						{
							$set_value .= $table_filds_name_arr[$data_key].'='.$sql_value;
						}
					}
				}
				if ($update_status===1)
				{
					$sql_upd='UPDATE '.$table_data.' SET '.$set_value.$update_where;
//echo $sql_upd.'<br>';				
					$result	= CDatabase::ExecuteQuery($sql_upd);
					unset($table_dest[$update_id]);
				}
			}
		}
//echo "Удаление несинхронизированных строк таблицы:";
		foreach ($table_dest as $key => $data_arr)
		{		
			$sql_del	= 'DELETE FROM '.$table_data.' WHERE id='.$key.';';
			$sync_id	= $this->get_destSyncId($table_arr['sync_filds']['id']['sync_table'], 'id', $key);
			if (!empty($sync_id))
			{			
				$sql_del	.= 'DELETE FROM add.basesync WHERE id='.$sync_id.';';
			}
//echo $sql_del.'<br>';				
			$result	= CDatabase::ExecuteQuery($sql_del);
		}
		return;
	}

// получение синхронизированного значения элемента таблицы 
	public function get_destSyncValue($table_sync, $bcode_sync)
	{
		$sql="SELECT	add.basesync.table_id 
				FROM	add.basesync 
				WHERE	add.basesync.table_sync='$table_sync'
						and add.basesync.bcode_sync='$bcode_sync'
						and add.basesync.factory_sync='$this->factory_dest_id'
						and add.basesync.base_sync='$this->factory_dest_sync'";
		$result	= CDatabase::GetResult($sql);
		$row 	= CDatabase::FetchRow($result);
		return $row[0];
	}

// получение id таблицы синхронизации для синхронизированного значения элемента таблицы 
//$table_sync	- наименование таблицы
//$fild  		- наименование поля
//$table_id		- 
	public function get_destSyncId($table_sync, $table_id)	
	{
		$factory_id		= $this->factory_dest_id;
		$factory_sync	= $this->factory_dest_sync;
		$sql="SELECT	add.basesync.id 
				FROM	add.basesync 
				WHERE	add.basesync.table_sync='$table_sync'
						and add.basesync.table_id='$table_id'
						and add.basesync.factory_sync='$factory_id'
						and add.basesync.base_sync='$factory_sync'";
//echo $sql;						
		$result	= CDatabase::GetResult($sql);
		$row 	= CDatabase::FetchRow($result);				
		return $row[0];
	}

	
	//полное копирование таблицы в другую базу
	public function copy_table($db0, $db1, $table_name)
	{
		$link0					=	$this -> linkdb($db0);
		$link1					=	$this -> linkdb($db1);
		$meta_table_arr0		=	pg_meta_data($link0, $table_name);
		$meta_table_arr1		=	pg_meta_data($link1, $table_name);	
		if ($meta_table_arr0<>$meta_table_arr1)
		{
			echo "ERROR: Несоответствие структуры копируемых таблиц!!!";
			return;
		}
		$table_filds_name_arr	=	array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr1 as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //уникальный ключ таблицы
			}
			if 	($fild_name=="modified")
			{
				$key_modified	=	count($table_filds_name_arr)-1; //уникальный ключ таблицы
			}
			
		}
		$sql='SELECT * FROM '.$table_name;
		$table0=array();
		$res = pg_query($link0, $sql);
		while ($row = pg_fetch_row($res))
		{
			$table0[$row[$key_id]]=$row;
		}
		$table1=array();
		$res = pg_query($link1, $sql);
		while ($row = pg_fetch_row($res))
		{
			$table1[$row[$key_id]]=$row;
		}
		$table_copy	= array();		
		if ($table0<>$table1)
		{
			foreach ($table0 as $key => $data_arr)
			{
				if (isset($table1[$key])) //обновление записей в целевой таблице
				{
					$arr0	= $data_arr;
					$arr1	= $table1[$key];
					if ($arr0[$key_modified]<>-1)
					{
						unset($arr0[$key_modified]);
						unset($arr1[$key_modified]);
					}
					if ($arr0<>$arr1)
					{
						$sql='UPDATE '.$table_name.' SET ';
						foreach ($data_arr as $data_key => $data_value)
						{
							if ($data_key==0)
							{
								$sql.=$table_filds_name_arr[$data_key].'='.$this->get_SQLvalue($data_value);
							}
							else
							{
								$sql.=', '.$table_filds_name_arr[$data_key].'='.$this->get_SQLvalue($data_value);
							}	
						}
						$sql.=' WHERE '.$table_filds_name_arr[$key_id].'='.$this->get_SQLvalue($data_arr[$key_id]).';';
						$table_copy[] = $sql;	
					}
					unset($table1[$key]);
				}
				else //добавление записей в целевую таблице
				{
					$sql='INSERT INTO '.$table_name.' (';
					foreach ($table_filds_name_arr as $data_key => $data_value)
					{
						if ($data_key==0)
						{
							$sql.=$data_value;
						}	
						else
						{	
							$sql.=', '.$data_value;
						}	
					}
					$sql.=') VALUES (';
					foreach ($data_arr as $data_key => $data_value)
					{
						if ($data_key==0)
						{
							$sql.=$this->get_SQLvalue($data_value);
						}	
						else
						{	
							$sql.=', '.$this->get_SQLvalue($data_value);
						}	
					}
					$sql.=');';
					$table_copy[] = $sql;						
				}				
			}	
			//удаление лишних записей в целевой таблице
			foreach ($table1 as $key => $data_arr) 
			{
				$sql='DELETE FROM '.$table_name.' WHERE '.$table_filds_name_arr[$key_id].'='.$this->get_SQLvalue($data_arr[$key_id]).';';
				$table_copy[] = $sql;
			}
		}
		//обновление целевой таблицы
		foreach ($table_copy as $sql) 
		{
//echo $sql.'<br>';			
			if (!pg_query($link1, $sql))
			{	
				echo "Копирование ".$table_name.": <br>ERROR: ".$sql;
				exit;
			}			
		}
		echo "Копирование ".$table_name.": ok!<br>";					
	}	

	public function get_SQLvalue($value='')
	{
		if		(is_null($value))	$value="NULL";
		elseif	($value=="NULL")	$value="NULL";
		else  						$value="'".str_replace("'", "''", $value)."'";
		return $value;
	}

	public function get_profiles()
	{
		$profile=array();
		$profile['groups']=array();		
		$sql="SELECT	public.profile_system_folders.id,
						public.profile_system_folders.name
				FROM	public.profile_system_folders	 
				WHERE	public.profile_system_folders.factory_id='$this->base_id'
			ORDER BY	public.profile_system_folders.name";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$profile['groups'][$row[0]]['name']=$row[1];
			$profile['groups'][$row[0]]['profile_sys']=array();
			$sql1="SELECT	public.profile_systems.id,
							public.profile_systems.name,
							public.profile_systems.is_editable
					FROM	public.profile_systems	 
					WHERE	public.profile_systems.folder_id='".$row[0]."'
				ORDER BY	public.profile_systems.name";					
			$result1	= CDatabase::GetResult($sql1);
			while ($row1 	= CDatabase::FetchRow($result1))
			{
				$profile['groups'][$row[0]]['profile_sys'][$row1[0]]['name']=$row1[1];
				$profile['groups'][$row[0]]['profile_sys'][$row1[0]]['is_editable']=$row1[2];
			}			
		}
		return ($profile);
	}

	public function get_hardwares()
	{
		$hardware=array();
		$hardware['groups']=array();		
		$sql="SELECT	public.window_hardware_folders.id,
						public.window_hardware_folders.name
				FROM	public.window_hardware_folders	 
				WHERE	public.window_hardware_folders.factory_id='$this->base_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$hardware['groups'][$row[0]]['name']=$row[1];
			$hardware['groups'][$row[0]]['hardware_sys']=array();
			$sql1="SELECT	public.window_hardware_groups.id,
							public.window_hardware_groups.name,
							public.window_hardware_groups.is_in_calculation
					FROM	public.window_hardware_groups	 
					WHERE	public.window_hardware_groups.folder_id='".$row[0]."'";					
			$result1	= CDatabase::GetResult($sql1);
			while ($row1 	= CDatabase::FetchRow($result1))
			{
				$hardware['groups'][$row[0]]['hardware_sys'][$row1[0]]['name']=$row1[1];
				$hardware['groups'][$row[0]]['hardware_sys'][$row1[0]]['is_in_calculation']=$row1[2];
			}			
		}
		return ($hardware);
	}

	public function add_hardwares_sync($hw_id)
	{
		$hw_type=array();
		$hw_type[2]='Поворотная';					//Поворотная
		$hw_type[4]='Штульповая';					//Штульповая
		$hw_type[6]='Поворотно-откидная';			//Поворотно-откидная
		$hw_type[7]='Фрамуга';						//Фрамуга
		$hw_type[17]='Поворотно-откидная (штульп)';	//Поворотно-откидная (штульп)			
		$ks=array();
		$sql="SELECT	public.window_hardware_types.id,
						public.window_hardware_types.name,
						public.window_hardware_sync.id,
						public.window_hardware_sync.sync_hardware_id,
						public.window_hardware_sync.sync_hardware_id2,
						public.window_hardware_sync.limit,
						public.window_hardware_sync.sync_hardware_name
				FROM	public.window_hardware_types
			LEFT JOIN	public.window_hardware_sync on public.window_hardware_sync.hardware_type=public.window_hardware_types.id
				WHERE	public.window_hardware_sync.hardware_id='$hw_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$ks[$row[0]]['name']=$row[1];
			$ks[$row[0]]['value1']=$row[3];
			$ks[$row[0]]['value2']=$row[4];
			$ks[$row[0]]['limit']=$row[5];
		}
		foreach ($hw_type as $hw_type_id => $hw_type_name)
		{
			if (empty($ks[$hw_type_id]))
			{
				$sql="INSERT INTO public.window_hardware_sync
					(hardware_id, hardware_type, sync_hardware_name, sync_hardwareparent_id, sync_hardwareparent_name) 
					VALUES	('".$hw_id."', '".$hw_type_id."', '".$hw_type_name."', '1', 'Steko')
					RETURNING id";					
				CDatabase::ExecuteQuery($sql);
			}	
		}
		return;			
	}

	public function get_hardwares_sync($hw_id)
	{
		$ks=array();
		$sql="SELECT	public.window_hardware_types.id,
						public.window_hardware_types.name,
						public.window_hardware_sync.id,
						public.window_hardware_sync.sync_hardware_id,
						public.window_hardware_sync.sync_hardware_id2,
						public.window_hardware_sync.limit,
						public.window_hardware_sync.sync_hardware_name
				FROM	public.window_hardware_types
			LEFT JOIN	public.window_hardware_sync on public.window_hardware_sync.hardware_type=public.window_hardware_types.id
				WHERE	public.window_hardware_sync.hardware_id='$hw_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$ks[$row[0]]['name']=$row[1];
			$ks[$row[0]]['value1']=$row[3];
			$ks[$row[0]]['value2']=$row[4];
			$ks[$row[0]]['limit']=$row[5];
		}
		if (empty($ks))
		{
			$this->add_hardwares_sync($hw_id);
			$ks=array();
			$sql="SELECT	public.window_hardware_types.id,
							public.window_hardware_types.name,
							public.window_hardware_sync.id,
							public.window_hardware_sync.sync_hardware_id,
							public.window_hardware_sync.sync_hardware_id2,
							public.window_hardware_sync.limit,
							public.window_hardware_sync.sync_hardware_name
					FROM	public.window_hardware_types
				LEFT JOIN	public.window_hardware_sync on public.window_hardware_sync.hardware_type=public.window_hardware_types.id
					WHERE	public.window_hardware_sync.hardware_id='$hw_id'";
			$result	= CDatabase::GetResult($sql);
			while ($row 	= CDatabase::FetchRow($result))
			{
				$ks[$row[0]]['name']=$row[1];
				$ks[$row[0]]['value1']=$row[3];
				$ks[$row[0]]['value2']=$row[4];
				$ks[$row[0]]['limit']=$row[5];
			}						
		}
		return $ks;			
	}

	public function get_form_sync_data()
	{
		$form_sync_data	= array();

		$form_sync_data['profile_systems']						= array();
		$form_sync_data['profile_systems']['table_name']		= "public.profile_systems";		
		$form_sync_data['profile_systems']['table_base_sql']	= "SELECT public.profile_systems.* FROM public.profile_systems JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_base_id' ORDER BY public.profile_systems.name";
		$form_sync_data['profile_systems']['table_dest_sql']	= "SELECT public.profile_systems.* FROM public.profile_systems JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id WHERE public.profile_system_folders.factory_id='$this->factory_dest_id' ORDER BY public.profile_systems.name";
		$form_sync_data['profile_systems']['name']				= 'Профильные системы';
		$form_sync_data['profile_systems']['table']				= 'profile_systems';
		$form_sync_data['profile_systems']['table_key_name']	= 'name';						
		$form_sync_data['profile_systems']['data'] 				= array();
//				
		$form_sync_data['window_hardware_groups']					= array();
		$form_sync_data['window_hardware_groups']['table_name']		= "public.window_hardware_groups";		
		$form_sync_data['window_hardware_groups']['table_base_sql']	= "SELECT public.window_hardware_groups.* FROM public.window_hardware_groups JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id WHERE public.window_hardware_folders.factory_id='$this->factory_base_id' ORDER BY public.window_hardware_groups.name";
		$form_sync_data['window_hardware_groups']['table_dest_sql']	= "SELECT public.window_hardware_groups.* FROM public.window_hardware_groups JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id WHERE public.window_hardware_folders.factory_id='$this->factory_dest_id' ORDER BY public.window_hardware_groups.name";
		$form_sync_data['window_hardware_groups']['name']			= 'Фурнитурные системы';
		$form_sync_data['window_hardware_groups']['table']			= 'window_hardware_groups';
		$form_sync_data['window_hardware_groups']['table_key_name']	= 'name';						
		$form_sync_data['window_hardware_groups']['data'] 			= array();
//
		$form_sync_data['doors_groups']							= array();
		$form_sync_data['doors_groups']['table_name']			= "public.doors_groups";		
		$form_sync_data['doors_groups']['table_base_sql']		= "SELECT public.doors_groups.* FROM public.doors_groups WHERE public.doors_groups.factory_id='$this->factory_base_id' ORDER BY public.doors_groups.name";
		$form_sync_data['doors_groups']['table_dest_sql']		= "SELECT public.doors_groups.* FROM public.doors_groups WHERE public.doors_groups.factory_id='$this->factory_dest_id' ORDER BY public.doors_groups.name";
		$form_sync_data['doors_groups']['name']					= 'Входные двери';
		$form_sync_data['doors_groups']['table']				= 'doors_groups';
		$form_sync_data['doors_groups']['table_key_name']		= 'name';						
		$form_sync_data['doors_groups']['data'] 				= array();
//
//		$form_sync_data['doors_hardware_groups']					= array();
//		$form_sync_data['doors_hardware_groups']['table_name']		= "public.doors_hardware_groups";		
//		$form_sync_data['doors_hardware_groups']['table_base_sql']	= "SELECT * FROM public.doors_hardware_groups WHERE public.doors_hardware_groups.factory_id='$this->factory_base_id' ORDER BY public.doors_hardware_groups.name";
//		$form_sync_data['doors_hardware_groups']['table_dest_sql']	= "SELECT * FROM public.doors_hardware_groups WHERE public.doors_hardware_groups.factory_id='$this->factory_dest_id' ORDER BY public.doors_hardware_groups.name";
//		$form_sync_data['doors_hardware_groups']['name']			= 'Фурнитурные системы (двери)';
//		$form_sync_data['doors_hardware_groups']['table']			= 'doors_hardware_groups';
//		$form_sync_data['doors_hardware_groups']['table_key_name']	= 'name';						
//		$form_sync_data['doors_hardware_groups']['data'] 			= array();
//
		$form_sync_data['lists_6']						= array();
		$form_sync_data['lists_6']['table_name']		= "public.lists";		
		$form_sync_data['lists_6']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=6 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
		$form_sync_data['lists_6']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=6 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
		$form_sync_data['lists_6']['name']				= 'Стеклопакеты';
		$form_sync_data['lists_6']['table']				= 'lists';
		$form_sync_data['lists_6']['table_key_name']	= 'name';						
		$form_sync_data['lists_6']['data'] 				= array();
//
		$form_sync_data['lists_8']						= array();
		$form_sync_data['lists_8']['table_name']		= "public.lists";		
		$form_sync_data['lists_8']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=8 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
		$form_sync_data['lists_8']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=8 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
		$form_sync_data['lists_8']['name']				= 'Подоконники';
		$form_sync_data['lists_8']['table']				= 'lists';
		$form_sync_data['lists_8']['table_key_name']	= 'name';
		$form_sync_data['lists_8']['locales']			= array();
//
		$form_sync_data['lists_9']						= array();
		$form_sync_data['lists_9']['table_name']		= "public.lists";		
		$form_sync_data['lists_9']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=9 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
		$form_sync_data['lists_9']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=9 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
		$form_sync_data['lists_9']['name']				= 'Отливы';
		$form_sync_data['lists_9']['table']				= 'lists';
		$form_sync_data['lists_9']['table_key_name']	= 'name';
		$form_sync_data['lists_9']['locales']			= array();
//
		$form_sync_data['lists_12']						= array();
		$form_sync_data['lists_12']['table_name']		= "public.lists";		
		$form_sync_data['lists_12']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=12 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
		$form_sync_data['lists_12']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=12 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
		$form_sync_data['lists_12']['name']				= 'Соединители';
		$form_sync_data['lists_12']['table']			= 'lists';
		$form_sync_data['lists_12']['table_key_name']	= 'name';
		$form_sync_data['lists_12']['locales']			= array();
//
		$form_sync_data['lists_24']						= array();
		$form_sync_data['lists_24']['table_name']		= "public.lists";		
		$form_sync_data['lists_24']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=24 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
		$form_sync_data['lists_24']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=24 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
		$form_sync_data['lists_24']['name']				= 'Ручки';
		$form_sync_data['lists_24']['table']			= 'lists';
		$form_sync_data['lists_24']['table_key_name']	= 'name';
		$form_sync_data['lists_24']['locales']			= array();
//
//		$form_sync_data['lists_20']						= array();
//		$form_sync_data['lists_20']['table_name']		= "public.lists";		
//		$form_sync_data['lists_20']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=20 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
//		$form_sync_data['lists_20']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=20 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
//		$form_sync_data['lists_20']['name']				= 'Москитные сетки';
//		$form_sync_data['lists_20']['table']			= 'lists';
//		$form_sync_data['lists_20']['table_key_name']	= 'name';
//		$form_sync_data['lists_20']['locales']			= array();		
//
		$form_sync_data['lists_21']						= array();
		$form_sync_data['lists_21']['table_name']		= "public.lists";		
		$form_sync_data['lists_21']['table_base_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=21 and public.elements.factory_id='$this->factory_base_id' ORDER BY public.lists.name";
		$form_sync_data['lists_21']['table_dest_sql']	= "SELECT public.lists.* FROM public.lists JOIN public.elements on public.elements.id=public.lists.parent_element_id WHERE public.lists.list_group_id=21 and public.elements.factory_id='$this->factory_dest_id' ORDER BY public.lists.name";
		$form_sync_data['lists_21']['name']				= 'Козырьки и нащельники';
		$form_sync_data['lists_21']['table']			= 'lists';
		$form_sync_data['lists_21']['table_key_name']	= 'name';
		$form_sync_data['lists_21']['locales']			= array();		

//--------------------------------------------------------------------
		$check_sync_arr	= array();
		$sql="SELECT	add.tablesync.table_sync,
						add.tablesync.bcode_sync
				FROM	add.tablesync
				WHERE	add.tablesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$check_sync_arr[$row[0]][$row[1]]=1;		
		}
		foreach ($form_sync_data as $form_sync_data_id => $form_sync_data_arr)
		{
			$form_sync_data[$form_sync_data_id]['meta_data']	= $this->get_metadata($form_sync_data_arr['table_name']);
			$key_id				= $form_sync_data[$form_sync_data_id]['meta_data']['table_key_id'];
			$key_name			= $form_sync_data[$form_sync_data_id]['meta_data']['table_filds_key'][$form_sync_data_arr['table_key_name']];
			$check_table_name	= $form_sync_data_arr['table'];
			$sql	= $form_sync_data_arr['table_base_sql'];
			$result	= CDatabase::GetResult($sql);
			while ($row	= CDatabase::FetchRow($result))
			{
//				$form_sync_data[$form_sync_data_id]['data'][$row[$key_id]]['']=$row;
				$form_sync_data[$form_sync_data_id]['data'][$row[$key_id]]['name'] 	= $row[$key_name];
				$form_sync_data[$form_sync_data_id]['data'][$row[$key_id]]['check'] = $check_sync_arr[$check_table_name][$row[$key_id]];
			}
		}			
		return ($form_sync_data);
	}
		
	public function get_locales()
	{
		$locales											= array();
		
		$locales['profile_system_folders']					= array();
		$locales['profile_system_folders']['left_join']		= '';
		$locales['profile_system_folders']['where']			= 'WHERE public.profile_system_folders.factory_id='.$this->base_id;
		$locales['profile_system_folders']['name']			= 'Группы оконных систем';
		$locales['profile_system_folders']['table']			= 'profile_system_folders';		
		$locales['profile_system_folders']['locales']		= array();

		$locales['door_profile_system_folders']				= array();
		$locales['door_profile_system_folders']['left_join']= '';
		$locales['door_profile_system_folders']['where']	= 'WHERE public.doors_folders.factory_id='.$this->base_id;
		$locales['door_profile_system_folders']['name']		= 'Группы дверных систем';
		$locales['door_profile_system_folders']['table']	= 'doors_folders';		
		$locales['door_profile_system_folders']['locales']	= array();
		
		$locales['profile_systems']							= array();
		$locales['profile_systems']['left_join']			= 'JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id';		
		$locales['profile_systems']['where']				= 'WHERE public.profile_system_folders.factory_id='.$this->base_id;
		$locales['profile_systems']['name']					= 'Профильные системы';
		$locales['profile_systems']['table']				= 'profile_systems';				
		$locales['profile_systems']['locales'] 				= array();

		$locales['door_profile_systems']					= array();
		$locales['door_profile_systems']['left_join']		= '';		
		$locales['door_profile_systems']['where']			= 'WHERE public.doors_groups.factory_id='.$this->base_id;
		$locales['door_profile_systems']['name']			= 'Профильные системы (дверные)';
		$locales['door_profile_systems']['table']			= 'doors_groups';				
		$locales['door_profile_systems']['locales'] 		= array();

		$locales['window_hardware_folders']					= array();
		$locales['window_hardware_folders']['left_join']	= '';
		$locales['window_hardware_folders']['where']		= 'WHERE public.window_hardware_folders.factory_id='.$this->base_id;	
		$locales['window_hardware_folders']['name']			= 'Группы оконных фурнитур';
		$locales['window_hardware_folders']['table']		= 'window_hardware_folders';
		$locales['window_hardware_folders']['locales']		= array();
		
		$locales['window_hardware_groups']					= array();
		$locales['window_hardware_groups']['left_join']		= 'LEFT JOIN public.window_hardware_folders on public.window_hardware_folders.id=public.window_hardware_groups.folder_id';
		$locales['window_hardware_groups']['where']			= 'WHERE public.window_hardware_folders.factory_id='.$this->base_id;			
		$locales['window_hardware_groups']['name']			= 'Фурнитурные системы';
		$locales['window_hardware_groups']['table']			= 'window_hardware_groups';
		$locales['window_hardware_groups']['locales']		= array();

		$locales['doors_hardware_groups']					= array();
		$locales['doors_hardware_groups']['left_join']		= '';
		$locales['doors_hardware_groups']['where']			= 'WHERE public.doors_hardware_groups.factory_id='.$this->base_id;	
		$locales['doors_hardware_groups']['name']			= 'Фурнитурные системы (дверные)';
		$locales['doors_hardware_groups']['table']			= 'doors_hardware_groups';
		$locales['doors_hardware_groups']['locales']		= array();

		$locales['lists_t36']								= array();
		$locales['lists_t36']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_t36']['where']						= 'WHERE public.lists.list_type_id=36 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_t36']['name']						= 'Офисные ручки';
		$locales['lists_t36']['table']						= 'lists';
		$locales['lists_t36']['locales']					= array();

		$locales['lists_t35']								= array();
		$locales['lists_t35']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_t35']['where']						= 'WHERE public.lists.list_type_id=35 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_t35']['name']						= 'Нажимные гарнитуры';
		$locales['lists_t35']['table']						= 'lists';
		$locales['lists_t35']['locales']					= array();

		$locales['glass_folders']							= array();
		$locales['glass_folders']['left_join']				= '';
		$locales['glass_folders']['where']					= 'WHERE public.glass_folders.factory_id='.$this->base_id;			
		$locales['glass_folders']['name']					= 'Группы стеклопакетов';
		$locales['glass_folders']['table']					= 'glass_folders';
		$locales['glass_folders']['locales']				= array();

		$locales['lists_6']									= array();
		$locales['lists_6']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_6']['where']						= 'WHERE public.lists.list_group_id=6 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_6']['name']							= 'Стеклопакеты';
		$locales['lists_6']['table']						= 'lists';
		$locales['lists_6']['locales']						= array();

		$locales['addition_folders_8']						= array();
		$locales['addition_folders_8']['left_join']			= '';
		$locales['addition_folders_8']['where']				= 'WHERE public.addition_folders.addition_type_id=8 and public.addition_folders.factory_id='.$this->base_id;			
		$locales['addition_folders_8']['name']				= 'Группы подоконников';
		$locales['addition_folders_8']['table']				= 'addition_folders';
		$locales['addition_folders_8']['locales']			= array();

		$locales['lists_8']									= array();
		$locales['lists_8']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_8']['where']						= 'WHERE public.lists.list_group_id=8 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_8']['name']							= 'Подоконники';
		$locales['lists_8']['table']						= 'lists';
		$locales['lists_8']['locales']						= array();

		$locales['addition_folders_9']						= array();
		$locales['addition_folders_9']['left_join']			= '';
		$locales['addition_folders_9']['where']				= 'WHERE public.addition_folders.addition_type_id=9 and public.addition_folders.factory_id='.$this->base_id;			
		$locales['addition_folders_9']['name']				= 'Группы отливов';
		$locales['addition_folders_9']['table']				= 'addition_folders';
		$locales['addition_folders_9']['locales']			= array();

		$locales['lists_9']									= array();
		$locales['lists_9']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_9']['where']						= 'WHERE public.lists.list_group_id=9 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_9']['name']							= 'Отливы';
		$locales['lists_9']['table']						= 'lists';
		$locales['lists_9']['locales']						= array();

		$locales['addition_folders_7']						= array();
		$locales['addition_folders_7']['left_join']			= '';
		$locales['addition_folders_7']['where']				= 'WHERE public.addition_folders.addition_type_id=7 and public.addition_folders.factory_id='.$this->base_id;			
		$locales['addition_folders_7']['name']				= 'Группы соединителей';
		$locales['addition_folders_7']['table']				= 'addition_folders';
		$locales['addition_folders_7']['locales']			= array();

		$locales['lists_12']								= array();
		$locales['lists_12']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_12']['where']						= 'WHERE public.lists.list_group_id=12 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_12']['name']						= 'Соединители';
		$locales['lists_12']['table']						= 'lists';
		$locales['lists_12']['locales']						= array();

		$locales['addition_folders_10']						= array();
		$locales['addition_folders_10']['left_join']		= '';
		$locales['addition_folders_10']['where']			= 'WHERE public.addition_folders.addition_type_id=10 and public.addition_folders.factory_id='.$this->base_id;			
		$locales['addition_folders_10']['name']				= 'Группы ручек';
		$locales['addition_folders_10']['table']			= 'addition_folders';
		$locales['addition_folders_10']['locales']			= array();

		$locales['addition_folders_11']						= array();
		$locales['addition_folders_11']['left_join']		= '';
		$locales['addition_folders_11']['where']			= 'WHERE public.addition_folders.addition_type_id=11 and public.addition_folders.factory_id='.$this->base_id;			
		$locales['addition_folders_11']['name']				= 'Группы прочих елементов';
		$locales['addition_folders_11']['table']			= 'addition_folders';
		$locales['addition_folders_11']['locales']			= array();

		$locales['lists_24']								= array();
		$locales['lists_24']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_24']['where']						= 'WHERE public.lists.list_group_id=24 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_24']['name']						= 'Ручки';
		$locales['lists_24']['table']						= 'lists';
		$locales['lists_24']['locales']						= array();

		$locales['addition_colors_24']						= array();
		$locales['addition_colors_24']['left_join']			= '';
		$locales['addition_colors_24']['where']				= 'WHERE public.addition_colors.lists_type_id=24 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_24']['name']				= 'Цвета ручек';
		$locales['addition_colors_24']['table']				= 'addition_colors';
		$locales['addition_colors_24']['locales']			= array();

		$locales['addition_colors_32']						= array();
		$locales['addition_colors_32']['left_join']			= '';
		$locales['addition_colors_32']['where']				= 'WHERE public.addition_colors.lists_type_id=32 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_32']['name']				= 'Цвета подоконников';
		$locales['addition_colors_32']['table']				= 'addition_colors';
		$locales['addition_colors_32']['locales']			= array();

		$locales['addition_colors_33']						= array();
		$locales['addition_colors_33']['left_join']			= '';
		$locales['addition_colors_33']['where']				= 'WHERE public.addition_colors.lists_type_id=33 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_33']['name']				= 'Цвета отливов';
		$locales['addition_colors_33']['table']				= 'addition_colors';
		$locales['addition_colors_33']['locales']			= array();

		$locales['addition_colors_20']						= array();
		$locales['addition_colors_20']['left_join']			= '';
		$locales['addition_colors_20']['where']				= 'WHERE public.addition_colors.lists_type_id=20 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_20']['name']				= 'Цвета москитных сеток';
		$locales['addition_colors_20']['table']				= 'addition_colors';
		$locales['addition_colors_20']['locales']			= array();

		$locales['addition_colors_27']						= array();
		$locales['addition_colors_27']['left_join']			= '';
		$locales['addition_colors_27']['where']				= 'WHERE public.addition_colors.lists_type_id=27 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_27']['name']				= 'Цвета соединителей';
		$locales['addition_colors_27']['table']				= 'addition_colors';
		$locales['addition_colors_27']['locales']			= array();

		$locales['addition_colors_29']						= array();
		$locales['addition_colors_29']['left_join']			= '';
		$locales['addition_colors_29']['where']				= 'WHERE public.addition_colors.lists_type_id=29 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_29']['name']				= 'Цвета козырьков';
		$locales['addition_colors_29']['table']				= 'addition_colors';
		$locales['addition_colors_29']['locales']			= array();
		
		$locales['addition_colors_18']						= array();
		$locales['addition_colors_18']['left_join']			= '';
		$locales['addition_colors_18']['where']				= 'WHERE public.addition_colors.lists_type_id=18 and public.addition_colors.factory_id='.$this->base_id;			
		$locales['addition_colors_18']['name']				= 'Цвета прочих елементов';
		$locales['addition_colors_18']['table']				= 'addition_colors';
		$locales['addition_colors_18']['locales']			= array();

//		$locales['addition_folders_12']						= array();
//		$locales['addition_folders_12']['left_join']		= '';
//		$locales['addition_folders_12']['where']			= 'WHERE public.addition_folders.addition_type_id=12 and public.addition_folders.factory_id='.$this->base_id;			
//		$locales['addition_folders_12']['name']				= 'Группы москитных сеток';
//		$locales['addition_folders_12']['table']			= 'addition_folders';
//		$locales['addition_folders_12']['locales']			= array();

//		$locales['lists_20']								= array();
//		$locales['lists_20']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
//		$locales['lists_20']['where']						= 'WHERE public.lists.list_group_id=20 and public.elements.factory_id='.$this->base_id;			
//		$locales['lists_20']['name']						= 'Москитные сетки';
//		$locales['lists_20']['table']						= 'lists';
//		$locales['lists_20']['locales']						= array();

		$locales['mosquitos']								= array();
		$locales['mosquitos']['left_join']					= 'JOIN public.profile_systems on public.profile_systems.id=public.mosquitos.profile_id JOIN public.profile_system_folders on public.profile_system_folders.id=public.profile_systems.folder_id';
		$locales['mosquitos']['where']						= 'WHERE public.profile_system_folders.factory_id='.$this->base_id;			
		$locales['mosquitos']['name']						= 'Москитные сетки';
		$locales['mosquitos']['table']						= 'mosquitos';
		$locales['mosquitos']['locales']					= array();

		$locales['mosquitos_singles']						= array();
		$locales['mosquitos_singles']['left_join']			= '';
		$locales['mosquitos_singles']['where']				= 'WHERE public.mosquitos_singles.factory_id='.$this->base_id;			
		$locales['mosquitos_singles']['name']				= 'Москитные сетки (отдельные)';
		$locales['mosquitos_singles']['table']				= 'mosquitos_singles';
		$locales['mosquitos_singles']['locales']			= array();

		$locales['addition_folders_21']						= array();
		$locales['addition_folders_21']['left_join']		= '';
		$locales['addition_folders_21']['where']			= 'WHERE public.addition_folders.addition_type_id=21 and public.addition_folders.factory_id='.$this->base_id;			
		$locales['addition_folders_21']['name']				= 'Группы козырьков и нащельников';
		$locales['addition_folders_21']['table']			= 'addition_folders';
		$locales['addition_folders_21']['locales']			= array();

		$locales['lists_21']								= array();
		$locales['lists_21']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_21']['where']						= 'WHERE public.lists.list_group_id=21 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_21']['name']						= 'Козырьки и нащельники';
		$locales['lists_21']['table']						= 'lists';
		$locales['lists_21']['locales']						= array();

		$locales['lists_18']								= array();
		$locales['lists_18']['left_join']					= 'LEFT JOIN public.elements on public.elements.id=public.lists.parent_element_id';
		$locales['lists_18']['where']						= 'WHERE public.lists.list_group_id=18 and public.elements.factory_id='.$this->base_id;			
		$locales['lists_18']['name']						= 'Прочее';
		$locales['lists_18']['table']						= 'lists';
		$locales['lists_18']['locales']						= array();

		$locales['lamination_factory_colors']				= array();
		$locales['lamination_factory_colors']['left_join']	= '';
		$locales['lamination_factory_colors']['where']		= 'WHERE public.lamination_factory_colors.factory_id='.$this->base_id;			
		$locales['lamination_factory_colors']['name']		= 'Цвет ламинации';
		$locales['lamination_factory_colors']['table']		= 'lamination_factory_colors';
		$locales['lamination_factory_colors']['locales']	= array();

//		$locales['add_elements']							= array();
//		$locales['add_elements']['left_join']				= '';
//		$locales['add_elements']['where']					= 'WHERE .factory_id='.$this->base_id;			
//		$locales['add_elements']['name']					= 'Дополнительные элементы';
//		$locales['add_elements']['table']					= '';
//		$locales['add_elements']['locales']					= array();
		
		foreach ($locales as $locales_id => $locales_arr)
		{
			$table_name = $locales_arr['table'];
			$left_join	= $locales_arr['left_join'];
			$where		= $locales_arr['where'];
			$sql="SELECT	public.$table_name.id,
							public.$table_name.name,
							public.locales_names.id,
							public.locales_names.ru,
							public.locales_names.en,
							public.locales_names.ua,
							public.locales_names.de,
							public.locales_names.ro,
							public.locales_names.it,
							public.locales_names.pl,
							public.locales_names.bg,
							public.locales_names.es
					FROM	public.$table_name
					LEFT JOIN public.locales_names on public.locales_names.table_name='$table_name' and public.locales_names.table_id=public.$table_name.id and public.locales_names.table_attr='name'
					$left_join
					$where
					ORDER BY public.$table_name.name";
//echo "<br>".$sql;
			$result	= CDatabase::GetResult($sql);
			while ($row 	= CDatabase::FetchRow($result))
			{
				$locales[$locales_id]['locales'][$row[0]]['base_name']=$row[1];
				$locales[$locales_id]['locales'][$row[0]]['locales_id']=$row[2];				
				$locales[$locales_id]['locales'][$row[0]]['ru_name']=$row[3];
				$locales[$locales_id]['locales'][$row[0]]['en_name']=$row[4];
				$locales[$locales_id]['locales'][$row[0]]['ua_name']=$row[5];
				$locales[$locales_id]['locales'][$row[0]]['de_name']=$row[6];
				$locales[$locales_id]['locales'][$row[0]]['ro_name']=$row[7];
				$locales[$locales_id]['locales'][$row[0]]['it_name']=$row[8];
				$locales[$locales_id]['locales'][$row[0]]['pl_name']=$row[9];
				$locales[$locales_id]['locales'][$row[0]]['bg_name']=$row[10];
				$locales[$locales_id]['locales'][$row[0]]['es_name']=$row[11];
			}
			$sql="SELECT	public.$table_name.id,
							public.$table_name.description,
							public.locales_names.id,
							public.locales_names.ru,
							public.locales_names.en,
							public.locales_names.ua,
							public.locales_names.de,
							public.locales_names.ro,
							public.locales_names.it,
							public.locales_names.pl,
							public.locales_names.bg,
							public.locales_names.es
					FROM	public.$table_name
					LEFT JOIN public.locales_names on public.locales_names.table_name='$table_name' and public.locales_names.table_id=public.$table_name.id and public.locales_names.table_attr='description'
					$left_join
					$where
					ORDER BY public.$table_name.description";
//			echo "<br>".$sql;
			$result	= CDatabase::GetResult($sql);
			while ($row 	= CDatabase::FetchRow($result))
			{
				$locales[$locales_id]['locales'][$row[0]]['base_description']=$row[1];
				$locales[$locales_id]['locales'][$row[0]]['locales_description_id']=$row[2];				
				$locales[$locales_id]['locales'][$row[0]]['ru_description']=$row[3];
				$locales[$locales_id]['locales'][$row[0]]['en_description']=$row[4];
				$locales[$locales_id]['locales'][$row[0]]['ua_description']=$row[5];
				$locales[$locales_id]['locales'][$row[0]]['de_description']=$row[6];
				$locales[$locales_id]['locales'][$row[0]]['ro_description']=$row[7];
				$locales[$locales_id]['locales'][$row[0]]['it_description']=$row[8];
				$locales[$locales_id]['locales'][$row[0]]['pl_description']=$row[9];
				$locales[$locales_id]['locales'][$row[0]]['bg_description']=$row[10];
				$locales[$locales_id]['locales'][$row[0]]['es_description']=$row[11];								
			}					
		}
		return ($locales);
	}

	public function get_sync($table, $id=0)
	{
		$sync=array();
		$where="";
		if ($table='profile_systems')
		{
			
		}
		elseif ($table='window_hardwares')
		{
			
		}
		else
		{
			$sql="SELECT	public.$table.id,
							public.$table.code_sync
							public.$table.code_sync_white
					FROM	$table
					$where
					";
			$result	= CDatabase::GetResult($sql);
			while ($row = CDatabase::FetchRow($result))
			{
				$code_sync_arr=array();
				$code_sync_arr['code_sync']=$row[1];
				$code_sync_arr['code_sync_white']=$row[2];
				$sync[$table][$row[0]][] = $code_sync_arr;
			}						 
		}
		return ($sync);
	}

	public function create_factory($name_, $pass_, $codesync_)
	{
		$sql="SELECT public.users.city_id, public.users.phone FROM public.users WHERE public.users.id='$this->factory_base_id'";
		$result	= CDatabase::GetResult($sql);
		$row = CDatabase::FetchRow($result);
//		echo "id города: ".$row[0]; 		
		$city_id_	= $row[0];
		$phone_		= $row[1];				
		$email			= "'".$name_."@windowscalculator.net'";
		$password 		= "'".md5($pass_)."'";
		$session		= "NULL";
		$short_id		= "'--'";
		$parent_id		= "'0'";
		$factory_id		= "'0'"; //первоначальное
		$name			= "'".$name_."'";
		$phone			= "'".$name_."'";
		$inn			= "''";
		$okpo			= "''";
		$mfo			= "''";
		$bank_name		= "''";
		$bank_acc_no	= "''";
		$director		= "''";
		$stamp_file_name= "NULL";
		$locked			= "'1'";
		$user_type		= "'7'";
		$contact_name	= "''";
		$city_phone		= "''";
		$city_id		= "'".$city_id_."'";
		$legal_name		= "''";
		$fax			= "''";
		$avatar			= "''";
		$birthday		= "NULL";
		$sex			= "NULL";
		$min_term		= "NULL";
		$internal_count	= "NULL";
		$device_code	= "'".md5($pass_)."'";
		$modified		= "now()";
		$created_at		= "now()";
		$updated_at		= "now()";
		$address		= "''";
		$identificator	= "'10'";
		$is_payer		= "'0'";
		$is_employee	= "'1'";
		$is_buch		= "'0'";
		$is_to			= "'0'";
		$is_all_calcs	= "'0'";
		$mount_mon		= "'0.00'";
		$mount_tue		= "'0.00'";
		$mount_wed		= "'0.00'";
		$mount_thu		= "'0.00'";
		$mount_fri		= "'0.00'";
		$mount_sat		= "'0.00'";
		$mount_sun		= "'0.00'";
		$last_sync		= "now()";
		$code_sync		= "'".$codesync_."'";
		$export_folder	= "'0'";
		$code_kb		= "NULL";
		$sql="INSERT INTO public.users 
							(email, password, session, short_id, parent_id, factory_id, name, phone, inn, okpo, mfo, bank_name, bank_acc_no, director, stamp_file_name, locked, user_type, contact_name, city_phone, city_id, legal_name, fax, avatar, birthday, sex, min_term, internal_count, device_code, modified, created_at, updated_at, address, identificator, is_payer, is_employee, is_buch, is_to, is_all_calcs, mount_mon, mount_tue, mount_wed, mount_thu, mount_fri, mount_sat, mount_sun, last_sync, code_sync, export_folder, code_kb) 
					VALUES	($email, $password, $session, $short_id, $parent_id, $factory_id, $name, $phone, $inn, $okpo, $mfo, $bank_name, $bank_acc_no, $director, $stamp_file_name, $locked, $user_type, $contact_name, $city_phone, $city_id, $legal_name, $fax, $avatar, $birthday, $sex, $min_term, $internal_count, $device_code, $modified, $created_at, $updated_at, $address, $identificator, $is_payer, $is_employee, $is_buch, $is_to, $is_all_calcs, $mount_mon, $mount_tue, $mount_wed, $mount_thu, $mount_fri, $mount_sat, $mount_sun, $last_sync, $code_sync, $export_folder, $code_kb) 
					RETURNING id";
		$result	= CDatabase::GetResult($sql);
		$row = CDatabase::FetchRow($result);
		$factory_id	= $row[0];
//		echo $sql;
//		echo "id пользователя: ".$factory_id;
		$id									= "'".$factory_id."'";
		$name								= "'".$name_."'";
		$modified							= "now()";
		$app_token							= "'".md5($pass_)."'";
		$link								= "NULL";
		$therm_coeff_id						= "'1'";
		$max_construct_square				= "'6'";
		$max_construct_size					= "'3200'";
		$max_lamination_construct_square	= "'5'";
		$max_lamination_construct_size		= "'2500'";
		$sql="INSERT INTO public.factories 
							(id, name, modified, app_token, link, therm_coeff_id, max_construct_square, max_construct_size, max_lamination_construct_square, max_lamination_construct_size)
					VALUES	($id, $name, $modified, $app_token, $link, $therm_coeff_id, $max_construct_square, $max_construct_size, $max_lamination_construct_square, $max_lamination_construct_size)
					RETURNING id";
		$result	= CDatabase::GetResult($sql);
		$row = CDatabase::FetchRow($result);
		$sql="UPDATE public.users SET factory_id='$factory_id' WHERE id='$factory_id'";			
		$result	= CDatabase::GetResult($sql);
		$row = CDatabase::FetchRow($result);
//		echo "id завода: ".$row[0];		
		$sql = "INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '1', '1', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '2', '2', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '3', '3', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '4', '4', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '5', '5', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '6', '6', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '7', '7', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '8', '8', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '9', '9', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '10', '10', now());
				INSERT INTO public.users_accesses (user_id, menu_id, position, modified) VALUES	('$factory_id', '11', '11', now());";			
		$result	= CDatabase::GetResult($sql);
		$row = CDatabase::FetchRow($result);
		$sql = "INSERT INTO public.users_discounts 
							(user_id, max_construct, max_add_elem, default_construct, default_add_elem, week_1_construct, week_1_add_elem, week_2_construct, week_2_add_elem, week_3_construct, week_3_add_elem, week_4_construct, week_4_add_elem, week_5_construct, week_5_add_elem, week_6_construct, week_6_add_elem, week_7_construct, week_7_add_elem, week_8_construct, week_8_add_elem) 
					VALUES	('$factory_id', '50.0', '50.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0')";
		$result	= CDatabase::GetResult($sql);
		$row = CDatabase::FetchRow($result);
		//записываем новый завод 
//		$this->factory_dest_id		= $factory_id;
//		$sql="SELECT	public.users.code_sync,
//						public.factories.name
//				FROM	public.users
//			LEFT JOIN	public.factories on public.factories.id=public.users.id  
//				WHERE	public.factories.id='$this->factory_dest_id'";
//		$result	= CDatabase::GetResult($sql);
//		$row 	= CDatabase::FetchRow($result);
		return;	
	}

	
	public function user_device($agent)
	{
		$tablet_browser = 0;
		$mobile_browser = 0;
		if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($agent))) 
		{
    		$tablet_browser++;
		}
		if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', strtolower($agent))) 
		{
    		$mobile_browser++;
		}
		if ((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') > 0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) 
		{
		    $mobile_browser++;
		}
		$mobile_ua = strtolower(substr($agent, 0, 4));
		$mobile_agents = array(
    'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
    'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
    'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
    'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
    'newt','noki','palm','pana','pant','phil','play','port','prox',
    'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
    'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
    'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
    'wapr','webc','winw','winw','xda ','xda-'); 
		if (in_array($mobile_ua,$mobile_agents)) 
		{
    		$mobile_browser++;
		}
 		if (strpos(strtolower($agent),'opera mini') > 0) 
 		{
    		$mobile_browser++;
    		//Check for tablets on opera mini alternative headers
    		$stock_ua = strtolower(isset($_SERVER['HTTP_X_OPERAMINI_PHONE_UA'])?$_SERVER['HTTP_X_OPERAMINI_PHONE_UA']:(isset($_SERVER['HTTP_DEVICE_STOCK_UA'])?$_SERVER['HTTP_DEVICE_STOCK_UA']:''));
		    if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $stock_ua)) 
		    {
      			$tablet_browser++;
    		}
		}
		if ($tablet_browser > 0) 
		{
			$this->device ='tablet';
		}
		else if ($mobile_browser > 0) 
		{
			$this->device ='mobile';
		}
		else 
		{
			$this->device ='desktop';
//			$this->device ='mobile';			
		} 		
		return;
	}

	public function user_browser($agent) 
	{
		preg_match("/(MSIE|Opera|Firefox|Chrome|Version|Opera Mini|Netscape|Konqueror|SeaMonkey|Camino|Minefield|Iceweasel|K-Meleon|Maxthon)(?:\/| )([0-9.]+)/", $agent, $browser_info); // регулярное выражение, которое позволяет отпределить 90% браузеров
        list(,$browser,$version) = $browser_info; 
   	    if (preg_match("/Opera ([0-9.]+)/i", $agent, $opera))
		{
			$this -> browser='Opera';
			$this -> browser_info=$opera[1]; 
   	    	return;
		}	
       	if ($browser == 'MSIE')
       	{ 
       		preg_match("/(Maxthon|Avant Browser|MyIE2)/i", $agent, $ie);
	        if ($ie) return $ie[1].' based on IE '.$version;
	        {
	        	$this -> browser='IE';
				$this -> browser_info=$version;  
   	            return;
        	}
		}	
        if ($browser == 'Firefox') 
        {
        	preg_match("/(Flock|Navigator|Epiphany)\/([0-9.]+)/", $agent, $ff); // проверяем, не разработка ли это на основе Firefox
       	    if ($ff)
			{
        		$this -> browser=$ff[1];
				$this -> browser_info=$ff[2];  					 
       	    	return;
       	    }	
       	}
        if ($browser == 'Opera' && $version == '9.80')
		{
       		$this -> browser='Opera';
			$this -> browser_info=substr($agent,-5);
			return;  					 				 
		}
   	    if ($browser == 'Version') 
   	    {
   	    	$this -> browser='Safari';
			$this -> browser_info=$version;
   	    	return;
		}	 
       	if (!$browser && strpos($agent, 'Gecko'))
		{
   	    	$this -> browser='Browser based on Gecko';
			$this -> browser_info='';				 
       		return;
		}
	   	$this -> browser=$browser;
		$this -> browser_info=$version;				    	
       	return;
	}	

	//очистка базы данных завода
	public function clearbd($factory_id)
	{
		$this->factory_dest_id	= $factory_id;
		$this->sync_tables = array_reverse($this->sync_tables);
		foreach ($this->sync_tables as $table_arr)
		{
			$table_data				= $table_arr["table_name"];
			$meta_table_arr			= CDatabase::GetMetaData($table_data);
			$table_filds_name_arr	= array();
			$table_filds_key_arr	= array();
			$key_id					= -1;
			$key_modified			= -1;
			foreach ($meta_table_arr as $fild_name => $fild_par_arr)
			{
				$table_filds_name_arr[]	=	$fild_name;
				if 	($fild_name=="id")
				{
					$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
				}
			}
			$table_filds_key_arr= array_flip($table_filds_name_arr);	
			$table_clear	= array();  //таблица для очистки
			$str_clear	= ""; 			//запрос для очистки		
			$sql=$table_arr["table_dest_sql"];
			$result	= CDatabase::GetResult($sql);
			while ($row 	= CDatabase::FetchRow($result))
			{
				$table_clear[$row[$key_id]]=$row;
				$str_clear .="DELETE FROM ".$table_arr['table_name']." WHERE id='".$row[$key_id]."';";		
			}
			if (!empty($str_clear))
			{	
				$result	= CDatabase::GetResult($str_clear);
			}						
		// контроль таблицы синхронизации
			$basesync_control="";
			$sql	=	"SELECT	add.basesync.id, ".$table_arr["table_name"].".id
						FROM	add.basesync
					LEFT JOIN	".$table_arr["table_name"]." on ".$table_arr["table_name"].".id= CAST (add.basesync.table_id AS INTEGER)
						WHERE	add.basesync.table_sync='".$table_arr['sync_filds']['id']['sync_table']."' 
								and add.basesync.factory_sync='$this->factory_dest_id'"; 
			$result	= CDatabase::GetResult($sql);
			while ($row 	= CDatabase::FetchRow($result))
			{
				if (is_null($row[1]))
				{
					$basesync_control .="DELETE FROM add.basesync WHERE id='".$row[0]."';";
				}	
				else 
				{
					$basesync_control .="DELETE FROM ".$table_arr["table_name"]." WHERE id='".$row[1]."';";
					$basesync_control .="DELETE FROM add.basesync WHERE id='".$row[0]."';";
					
				}		
			}
			if (!empty($basesync_control))
			{	
				$result	= CDatabase::GetResult($basesync_control);
			}
		}		
		return;
	}

	//получение таблицы синхронизации
	public function get_table_sync()
	{
		$table_sync							= array();
		$table_sync['table_sync_arr'] 		= array();
		$table_sync['table_dest_sync_arr']	= array();
		$sql="SELECT	add.basesync.table_sync,
						add.basesync.bcode_sync,
						add.basesync.table_id
				FROM	add.basesync
				WHERE	add.basesync.factory_sync='$this->factory_dest_id'";				
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_sync['table_sync_arr'][$row[0]][$row[1]]=$row[2];
			$table_sync['table_dest_sync_arr'][$row[0]][$row[2]]=$row[1];		
		}
		return 	$table_sync;			
	}

	//Контроль таблицы синхронизации
	public function basesync_control($table_arr)
	{
		$basesync_control="";
		$sql	=	"SELECT	add.basesync.id, ".$table_arr["table_name"].".id
					FROM	add.basesync
				LEFT JOIN	".$table_arr["table_name"]." on ".$table_arr["table_name"].".id= CAST (add.basesync.table_id AS INTEGER)
					WHERE	add.basesync.table_sync='".$table_arr['sync_filds']['id']['sync_table']."' 
							and add.basesync.factory_sync='$this->factory_dest_id' 
							and ".$table_arr['table_name'].".id IS NULL";
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$basesync_control .="DELETE FROM add.basesync WHERE id='".$row[0]."';";		
		}
		if (!empty($basesync_control))
		{	
			$result	= CDatabase::GetResult($basesync_control);
		}
		return;		
	}
	
	public function linked_sync_tables()
	{
		//таблицы полной синхронизации
		$all_sync_table['doors_folders']			= 1;
		$all_sync_table['window_hardware_folders']	= 1; // для админки необходима группа default		
		$all_sync_table['addition_folders']			= 1;
		$all_sync_table['profile_system_folders']	= 1;
		$all_sync_table['background_templates']		= 1;
		$all_sync_table['options_discounts']		= 1;
		$all_sync_table['options_coefficients']		= 1;
		$all_sync_table['currencies']				= 1;
		$all_sync_table['lamination_factory_colors']= 1;
		$all_sync_table['mosquitos_singles']		= 1;
		//таблицы выборочной синхронизации
		$check_sync_arr	= array();
		$sql="SELECT	add.tablesync.table_sync,
						add.tablesync.bcode_sync
				FROM	add.tablesync
				WHERE	add.tablesync.factory_sync='$this->factory_dest_id'";
		$result	= CDatabase::GetResult($sql);		
		while ($row 	= CDatabase::FetchRow($result))
		{
			$check_sync_arr[$row[0]][$row[1]]=1;		
		}
		//заполнение таблицы элементов для синхронизации:
		foreach ($this->sync_tables as $table_key => $table_arr)
		{
			$table_base	= array(); //инициализация таблицы элементов для синхронизации
			//заполняем выбранные элементы синхронизации	
			if (isset($check_sync_arr[$table_arr['sync_filds']['id']['sync_table']]))
			{
				$table_base_all	= $this->get_table_base_copy($table_arr);
				$table_base	= array();
				foreach ($check_sync_arr[$table_arr['sync_filds']['id']['sync_table']] as $el_id => $el_fl)
				{
					$table_base[$el_id]	= $table_base_all[$el_id];
				}
				$this->sync_tables[$table_key]['table_base']=$table_base;
			}
			//заполняем необходимые элементы синхронизации
			if (isset($all_sync_table[$table_arr['sync_filds']['id']['sync_table']]))
			{
				$table_base=$this->get_table_base_copy($table_arr);
				$this->sync_tables[$table_key]['table_base']=$table_base;
			}
			//заполняем таблицу копируемого завода
			$this->sync_tables[$table_key]['table_dest']=$this->get_table_dest_copy($table_arr);			
		}
//echo "<br>добавление связанных элементов синхронизации<br>";
		foreach ($this->sync_tables as $table_key => $table_arr)
		{
			$table_data				= $table_arr["table_name"];
//echo "<br>--таблица: $table_data--<br>";
			if (!isset($this->sync_tables[$table_key]["table_filds_name"]))
			{
				$this->set_metadata();
			}	
			$table_filds_name_arr	= $table_arr["table_filds_name"];
			$table_filds_key_arr	= $table_arr["table_filds_key"];
			$key_id					= $table_arr["table_key_id"];
			$table_base = $this->sync_tables[$table_key]['table_base'];
			foreach ($table_base as $key => $data_arr)
			{
				foreach ($data_arr as $data_key => $data_value)
				{
					if ($table_filds_name_arr[$data_key]<>'id')
					{
						if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
						{
							if ($data_value <> $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'])
							{
								$this->element_add_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']);
							}
						}
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
						{
//							$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
						}	
						elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
						{					
							$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
							if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
							{
								if ($data_value <> $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['null_value'])
								{
									$this->element_add_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']);									
								}
							}
						}												
					}
				}
			}
		}
//echo "<br><br>-ДОПОЛНЕННАЯ ТАБЛИЦА СИНХРОНИЗАЦИИ-<br><br>";
//foreach ($this->sync_tables as $table_key => $table_arr)
//{
//	$table_data				= $table_arr["table_name"];
//echo "<br>--таблица: $table_data--<br>";
//echo count($table_arr['table_base']);
//var_dump($table_arr['table_base']);			
//}
//echo "<br> Script memori: ".(memory_get_usage()-$mem0-sizeof($mem0))." bytes<br>";
//echo 'Время выполнения скрипта: '.(microtime(true) - $start).' сек.<br>';
//exit;
//echo "<br>добавляем элементы неявно ссылающиеся на текущие таблицы";
		$flag_table_add_sync=FALSE;
		foreach ($this->sync_tables as $table_key => $table_arr)
		{
			if (isset($table_arr['ext_table_link']))			
			{
				foreach ($table_arr['ext_table_link'] as $ext_table_name => $data_arr)
				{					
//echo "<br>--внешняя таблица: $ext_table_name -> для: ".$table_arr['sync_filds']['id']['sync_table']."--";
//echo "<br>-$table_key-$ext_table_name----<br>";
					$this->sync_tables[$table_key]['ext_table_link'][$ext_table_name]['data']=$table_arr['table_base'];
					if (count($this->sync_tables[$table_key]['ext_table_link'][$ext_table_name]['data'])>0.5)
					{
						$flag_table_add_sync=TRUE;
					}
//var_dump($this->sync_tables[$table_key]['ext_table_link'][$ext_table_name]['data']);						
				}				
			}			
		}
//
		while ($flag_table_add_sync)
		{
			$flag_table_add_sync=FALSE;		
			foreach ($this->sync_tables as $table_key => $table_arr)
			{
				$table_data				= $table_arr["table_name"];
//echo "<br>--таблица: $table_data--";
				if (isset($table_arr['ext_table_link']))			
				{
					foreach (array_reverse($table_arr['ext_table_link']) as $ext_table_name => $data_arr)
					{					
						$this->table_add_sync($ext_table_name, $table_arr['sync_filds']['id']['sync_table']);
						if (count($this->sync_tables[$table_key]['ext_table_link'][$ext_table_name]['data'])>0.5)
						{
							$flag_table_add_sync=TRUE;
						}						
					}				
				}
			}
		}
		return;
	}


	//Получение индексов таблиц 
	public function get_metadata($table_data)
	{
		$meta_data	=	array();
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$meta_data['table_filds_name']	= $table_filds_name_arr;
		$meta_data['table_filds_key']	= array_flip($table_filds_name_arr);
		$meta_data['table_key_id']		= $key_id;			
		return ($meta_data); 
	}

	//Запись индексов таблиц 
	public function set_metadata()
	{
		foreach ($this->sync_tables as $current_key => $table_arr)
		{	
			$table_data				= $table_arr["table_name"];
			$meta_table_arr			= CDatabase::GetMetaData($table_data);
			$table_filds_name_arr	= array();
			$table_filds_key_arr	= array();
			$key_id					= -1;
			$key_modified			= -1;
			foreach ($meta_table_arr as $fild_name => $fild_par_arr)
			{
				$table_filds_name_arr[]	=	$fild_name;
				if 	($fild_name=="id")
				{
					$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
				}
			}
			$this->sync_tables[$current_key]['table_filds_name']	= $table_filds_name_arr;
			$this->sync_tables[$current_key]['table_filds_key']		= array_flip($table_filds_name_arr);
			$this->sync_tables[$current_key]['table_key_id']		= $key_id;			
		}			
		return; 
	}

	//заполнение полной базовой таблицы для копирования 
	public function set_table_base_all()
	{
		foreach ($this->sync_tables as $current_key => $table_arr)
		{
			$this->sync_tables[$current_key]['table_base_all']	= $this->get_table_base_copy($table_arr);
		}					
		return;
	}

	//Получение полной базовой таблицы для копирования 
	public function get_table_base_copy($table_arr)
	{
		$table_data				= $table_arr["table_name"];
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$table_filds_key_arr= array_flip($table_filds_name_arr);		
		$table_base	= array(); //базовая таблица		
		$sql=$table_arr["table_base_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_base[$row[$key_id]]=$row;		
		}
		return $table_base;
	}

	//Получение текущей таблицы копируемого завода 
	public function get_table_dest_copy($table_arr)
	{
		$table_data				= $table_arr["table_name"];
		$meta_table_arr			= CDatabase::GetMetaData($table_data);
		$table_filds_name_arr	= array();
		$table_filds_key_arr	= array();
		$key_id					= -1;
		$key_modified			= -1;
		foreach ($meta_table_arr as $fild_name => $fild_par_arr)
		{
			$table_filds_name_arr[]	=	$fild_name;
			if 	($fild_name=="id")
			{
				$key_id	=	count($table_filds_name_arr)-1; //индекс уникального ключа таблицы в результате запроса
			}
		}
		$table_filds_key_arr= array_flip($table_filds_name_arr);		
		$table_dest	= array(); //таблица копируемого завода	
		$sql=$table_arr["table_dest_sql"];
		$result	= CDatabase::GetResult($sql);
		while ($row 	= CDatabase::FetchRow($result))
		{
			$table_dest[$row[$key_id]]=$row;		
		}
		return $table_dest;
	}
	
	//добавление элемента для синхронизации
	public function element_add_sync($element_id, $table_name)
	{
//echo "<br>добавить ".$element_id." в таблицу: ".$table_name."<br>";
		foreach ($this->sync_tables as $current_key => $table_arr)
		{
			if ($table_arr["sync_filds"]["id"]["sync_table"] == $table_name)
			{
				$table_base=$table_arr['table_base'];
				if (isset($table_base[$element_id]))
				{
//echo "<br>элемент: ".$element_id." уже есть в таблице: ".$table_name."<br>";
					return;
				}
				break;						
			}
		}
		if ($table_arr["sync_filds"]["id"]["sync_table"] <> $table_name)
		{
			echo "error";
			exit;					
		}
		$table_base_all	= $this->sync_tables[$current_key]['table_base_all'];
		//добавляем элемент в таблицу для синхронизации
		$this->sync_tables[$current_key]['table_base'][$element_id]=$table_base_all[$element_id];
		//добавляем элемент в таблицы добавленных элементов для синхронизации
		foreach ($this->sync_tables[$current_key]['ext_table_link'] as $link_table_name => $link_table_arr)
		{
			$this->sync_tables[$current_key]['ext_table_link'][$link_table_name]['data'][$element_id]=$table_base_all[$element_id];
		}
		//проверяем ссылки на другие элементы
		if (!isset($this->sync_tables[$current_key]["table_filds_name"]))
		{ 
			$this->set_metadata();
		}	
		$table_filds_name_arr	= $this->sync_tables[$current_key]["table_filds_name"];
		$table_filds_key_arr	= $this->sync_tables[$current_key]["table_filds_key"];
		$key_id					= $this->sync_tables[$current_key]["table_key_id"];
		$data_arr				= $table_base_all[$element_id];
		foreach ($data_arr as $data_key => $data_value)
		{
			if ($table_filds_name_arr[$data_key]<>'id')
			{
				if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']))
				{
					if ($data_value <> $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['null_value'])
					{
						$this->element_add_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_table']);
					}
				}
				elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']))
				{
//					$sql_value	= $this->get_SQLvalue($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['sync_value']);
				}	
				elseif (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']))
				{					
					$type_t=$data_arr[$table_filds_key_arr[$table_arr['sync_filds'][$table_filds_name_arr[$data_key]]['type_table']]];
					if (isset($table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']))
					{
						if ($data_value <> $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['null_value'])
						{
							$this->element_add_sync($data_value, $table_arr['sync_filds'][$table_filds_name_arr[$data_key]][$type_t]['sync_table']);									
						}
					}
				}												
			}
		}				
		return;
	}

	//добавление элементов из внешней таблицы для синхронизации
	public function table_add_sync($ext_table_name, $link_table_name)
	{
//echo "<br>добавить элементы из таблицы: ".$ext_table_name." для таблицы: ".$link_table_name."<br>";
		foreach ($this->sync_tables as $current_key => $link_table_arr)
		{
			if ($link_table_arr["sync_filds"]["id"]["sync_table"] == $link_table_name)
			{
				break;						
			}
		}
		if ($link_table_arr["sync_filds"]["id"]["sync_table"] <> $link_table_name)
		{
			echo "error $link_table_name";
			exit;					
		}
		$link_table_key = $current_key;
		foreach ($this->sync_tables as $current_key => $ext_table_arr)
		{
			if ($ext_table_arr["sync_filds"]["id"]["sync_table"] == $ext_table_name)
			{
				break;						
			}
		}
		if ($ext_table_arr["sync_filds"]["id"]["sync_table"] <> $ext_table_name)
		{
			echo "error $ext_table_name";
			exit;					
		}
		$ext_table_key = $current_key;
//echo "<br>--$ext_table_key-$ext_table_name-----$link_table_key-$link_table_name--<br>";		
		$link_table_base	= $this->sync_tables[$link_table_key]['ext_table_link'][$ext_table_name]["data"];
		$this->sync_tables[$link_table_key]['ext_table_link'][$ext_table_name]["data"]	= array(); 
		$table_data				= $this->sync_tables[$ext_table_key]["table_name"];
		if (!isset($this->sync_tables[$ext_table_key]["table_filds_name"]))
		{ 
			$this->set_metadata();
		}			
		$table_filds_name_arr	= $this->sync_tables[$ext_table_key]["table_filds_name"];
		$table_filds_key_arr	= $this->sync_tables[$ext_table_key]["table_filds_key"];
		$key_id					= $this->sync_tables[$ext_table_key]["table_key_id"];
//ищем индекс поля ссылки во внешней таблице		
		$link_key = -1;
		$link_name = "";
		foreach ($this->sync_tables[$ext_table_key] ["sync_filds"] as $link_name => $fild_arr)
		{
//echo "<br>$link_name -> ".$fild_arr['sync_table'];
			if ($fild_arr['sync_table'] == $link_table_name)
			{
				$link_key=$table_filds_key_arr[$link_name];				
				break;
			}
		} 
		if ($link_key == -1)
		{
//			echo "<br> в таблице: $ext_table_name нет ссылок на элементы таблицы: $link_table_name";
			return;
		}
//echo "<br>$link_name - > $link_key";		
		foreach ($link_table_base as $link_element_id => $link_element_arr)
		{			
//echo "<br>Ищем ссылку на элемент: $link_element_id";
			$sql=$ext_table_arr["table_base_sql"]." and ".$this->sync_tables[$ext_table_key]['table_name'].".$link_name='$link_element_id'";
			$result	= CDatabase::GetResult($sql);
			$table_add =array();
			while ($row	= CDatabase::FetchRow($result))
			{
				$table_add[$row[$key_id]]=$row;		
			}
			foreach ($table_add as $add_element_id => $add_elemen_arr)
			{
//echo "<br>добавляем элемент $add_element_id в таблицу $ext_table_name";
				$this->element_add_sync($add_element_id, $ext_table_name);				
			}
		}
		return;
	}

	// получение времени последнего обновления
	public function getFactoryUpdate($factory_id, $modified_name='update_price')
	{
		$update = new stdClass;
		if (empty($factory_id))
			$factory_id = $this->factory_base_id;
		$sql	= "SELECT id, modified, modified_size FROM add.factory_update WHERE factory_id='$factory_id' and modified_name='$modified_name'";
		$result	= CDatabase::GetResult($sql);
		$row	= CDatabase::FetchRow($result);
		if (empty($row))
		{
			$update -> context = "не обновлялось"; 
		}
		else
		{
			$update -> stamp	= $row[1];
			$update -> size		= $row[2];
			$update -> date		= new DateTime($row[1]);
			$update -> context	= "последнее обновление";
		}				
		return 	$update;		
	}
}	
?>