<?php 


class CDatabase  {

	function GetResult ($sql,$srv = 1) {

		global $db_serv, $db_user, $db_pass, $db_db;

		include('cnfg'.$srv.'.php');

		//$link = mysql_connect($mysql_serv, $mysql_user, $mysql_pass);

		$link = pg_pconnect('host=' . $db_serv . ' port=5432 dbname=' . $db_db . ' user=' . $db_user . ' password=' . $db_pass);

		if ($link == null) {

			echo "Could not connect to postgresql ".pg_last_error();

			return null;

		}

		return pg_exec($link, $sql);

	}

	function GetMetaData ($sql ,$srv = 1) {

		global $db_serv, $db_user, $db_pass, $db_db;

		include('cnfg'.$srv.'.php');

		$link = pg_pconnect('host=' . $db_serv . ' port=5432 dbname=' . $db_db . ' user=' . $db_user . ' password=' . $db_pass);

		if ($link == null) {

			echo "Could not connect to postgresql ".pg_last_error();

			return null;

		}

		return pg_meta_data($link, $sql);

	}
	

	function ExecuteQuery ($sql,$srv = 1) {

		global $db_serv, $db_user, $db_pass, $db_db;

		include('cnfg'.$srv.'.php');

		$link = pg_pconnect('host=' . $db_serv . ' port=5432 dbname=' . $db_db . ' user=' . $db_user . ' password=' . $db_pass);

		if ($link == null) {

			echo "Could not connect to postgresql ".pg_last_error();

			return null;

		}

		$result = pg_exec($link, $sql);

		$err =  pg_last_error();

		pg_close($link);

        return $err;

	}	

	

	function FetchRow($result) {

		return pg_fetch_row($result);

	}

	

	function FetchArray($result) {

		return pg_fetch_array($result);

	} 

	

function UTF8toCP1251($str){ // by SiMM, $table from http://ru.wikipedia.org/wiki/CP1251

static $table = array("\xD0\x81" => "\xA8",

"\xD1\x91" => "\xB8",

// ���������� �������

"\xD0\x8E" => "\xA1", 

"\xD1\x9E" => "\xA2", 

"\xD0\x84" => "\xAA", 

"\xD0\x87" => "\xAF", 

"\xD0\x86" => "\xB2", 

"\xD1\x96" => "\xB3", 

"\xD1\x94" => "\xBA",

"\xD1\x97" => "\xBF", 

// ��������� �������

"\xD3\x90" => "\x8C", 

"\xD3\x96" => "\x8D", 

"\xD2\xAA" => "\x8E",

"\xD3\xB2" => "\x8F", 

"\xD3\x91" => "\x9C", 

"\xD3\x97" => "\x9D", 

"\xD2\xAB" => "\x9E", 

"\xD3\xB3" => "\x9F", 

);

return preg_replace('#([\xD0-\xD1])([\x80-\xBF])#se',

'isset($table["$0"]) ? $table["$0"] :

chr(ord("$2")+("$1" == "\xD0" ? 0x30 : 0x70))

',$str);

}



function PrepereStringForXML($value) {

	return str_replace('&','\&',str_replace('"','\'',str_replace('<','',str_replace('>','',$value))));



}



function CP1251toUTF8($str){ 

return $str;

static $table = array("\xA8" => "\xD0\x81", 

"\xB8" => "\xD1\x91", 

// ���������� �������

"\xA1" => "\xD0\x8E", 

"\xA2" => "\xD1\x9E", 

"\xAA" => "\xD0\x84", 

"\xAF" => "\xD0\x87", 

"\xB2" => "\xD0\x86", 

"\xB3" => "\xD1\x96", 

"\xBA" => "\xD1\x94", 

"\xBF" => "\xD1\x97", 

// ��������� �������

"\x8C" => "\xD3\x90", 

"\x8D" => "\xD3\x96", 

"\x8E" => "\xD2\xAA", 

"\x8F" => "\xD3\xB2", 

"\x9C" => "\xD3\x91", 

"\x9D" => "\xD3\x97", 

"\x9E" => "\xD2\xAB",

"\x9F" => "\xD3\xB3", 

);

return preg_replace('#[\x80-\xFF]#se',

' "$0" >= "\xF0" ? "\xD1".chr(ord("$0")-0x70) :

("$0" >= "\xC0" ? "\xD0".chr(ord("$0")-0x30) :

(isset($table["$0"]) ? $table["$0"] : ""))', $str);

}

}

?>