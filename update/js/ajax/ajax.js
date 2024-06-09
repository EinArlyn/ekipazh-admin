function scaleWindow(obj, width, height){
	var scale=1;
	if (self.innerWidth/width > self.innerHeight/height) {scale=self.innerHeight/height;}
	else {scale=self.innerWidth/width;}
	if (scale > 1) {scale=1;}
	var topscale =(scale-1)*height/2;
//	alert(scale+'  '+topscale);
	obj.style.transform = 'scale('+scale+')';
	obj.style.top = topscale+'px'; 
	return;
}
function displaywindowcenter(obj, width, height){
	obj.innerHTML = '';
	obj.style.display = 'block';
	obj.style.width = width+'px';
	obj.style.height = height+'px';
	obj.style.left = window.pageXOffset + self.innerWidth/2 - width/2 + 'px';
	obj.style.top = window.pageYOffset + self.innerHeight/2 - height/2 + 'px';	
}
function fdisplaywindowcenter(obj, width, height){
	obj.innerHTML = '';
	obj.style.display = 'block';
	obj.style.width = width+'px';
	obj.style.height = height+'px';
	obj.style.left =  self.innerWidth/2 - width/2 + 'px';
	obj.style.top =  self.innerHeight/2 - height/2 + 'px';	
}
function fdisplaywindowtop(obj, width, height){
	obj.innerHTML = '';
	obj.style.display = 'block';
	obj.style.width = width+'px';
	obj.style.height = height+'px';
	obj.style.left =  self.innerWidth/2 - width/2 + 'px';
	obj.style.top =  '0px';	
}
function alertObj(obj) {var str = "";for(k in obj) {str += k+": "+ obj[k]+"\r\n";}alert(str);} 
function ge(id) {return document.getElementById(id);}
function geN(name) {return document.getElementsByName(name).item(0);}
function createRequestObject() {
  if (typeof XMLHttpRequest === 'undefined') {
    XMLHttpRequest = function() {
      try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
        catch(e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
        catch(e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP"); }
        catch(e) {}
      try { return new ActiveXObject("Microsoft.XMLHTTP"); }
        catch(e) {}
      throw new Error("This browser does not support XMLHttpRequest.");
    };
  }
  return new XMLHttpRequest();
}

function ajax_post(ajax_in,div_id) {
//
var req = createRequestObject()
req.onreadystatechange = function() {
if (ge(div_id+'_loading')) ge(div_id+'_loading').style.display = 'block';
if (ge('ajax_loading')) ge('ajax_loading').style.display = 'block';
if (req.readyState == 4) {
if (ge(div_id+'_loading')) ge(div_id+'_loading').style.display = 'none';
if (ge('ajax_loading')) ge('ajax_loading').style.display = 'none';
if (req.status == 200) 
{
response=req.responseText;
while (response.charCodeAt(0)==65279 | response.charCodeAt(0)==9) {response=response.substr(1,response.length);}
if (response.substr(0,7)=='refresh') { setTimeout('document.location.reload()', 50); return;}
if (response.substr(0,5)=='alert') { alert(response.substr(5,response.length)); return;}
if (response.substr(0,2)=='E-') { alert(response); return;}
if (response.substr(0,6)=='Ralert') { alert(response.substr(6,response.length));setTimeout('document.location.reload()', 50); return;}
if (response.substr(0,23)=='document.location.href=') { setTimeout(response, 0); return;}
if (response.match("<script[^>]*>[^<]*</script>") != null)
	{
		script	= response.match("<script[^>]*>[^<]*</script>");
		script	= script.toString().replace('<script>', '');
		script	= script.replace('</script>', '');
		eval(script);
		html_start	= response.indexOf("<html>");
		html_end	= response.indexOf("</html>") - html_start;
		if (html_start > 0)
		{
			ge(div_id).innerHTML = response.substr(html_start+6,html_end-6);
		} 
		return;
	}
ge(div_id).innerHTML=response; return;
}
}
}
req.open('POST',document.location, true); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//alert(ajax_in);
req.send(ajax_in+'&ajax=1',div_id);
}

function ajax_form(form, output) {
  var data = new FormData(form),
    /*
     * Использовать кроссбраузерный способ создания
     * не имеет смысла, т.к. браузеры для, для которых
     * XMLHttpRequest (xhr) создаётся по-другому, не поддерживают FormData
     */
  xhr = new XMLHttpRequest()
 
  progressBar = document.querySelector('progress');
  xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
  if (xhr.status == 200) {
     progressBar.value=0;
     response=xhr.responseText;
	 while (response.charCodeAt(0)==65279  | response.charCodeAt(0)==9) {response=response.substr(1,response.length);}
     if (response.substr(0,7)=='refresh') { setTimeout('document.location.reload()', 50); return;}
     if (response.substr(0,5)=='alert') { alert(response.substr(5,response.length)); return;}
     if (response.substr(0,2)=='E-') { alert(response); return;}
     if (response.substr(0,6)=='Ralert') { alert(response.substr(6,response.length));setTimeout('document.location.reload()', 50); return;}
     if (response.substr(0,6)=='script') { response; return;}
     if (response.substr(0,23)=='document.location.href=') { setTimeout(response, 0); return;}
     ge(output).innerHTML=response;
  }
  }
  }
  xhr.open('POST', form.action, true);
  xhr.upload.onprogress = function (e) {progressBar.value = e.loaded / e.total * 100;}
  xhr.send(data);
  return false;
}

function toggleS(id){
	var e = ge(id);
	if (e.style.display == "none"){
		e.style.display = "block";
		return true;
	}
	else{
		e.style.display = "none";
        return true;
    }
    return false;
}
//календарь с запросом после выбора даты
var datePickerDivID = "datepicker";
var iFrameDivID = "datepickeriframe";
//var dayArrayShort = new Array('&#1042;&#1089;', '&#1055;&#1085;', '&#1042;&#1090;', '&#1057;&#1088;', '&#1063;&#1090;', '&#1055;&#1090;', '&#1057;&#1073;');
//var dayArrayShort = new Array('Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб');
var dayArrayShort = new Array('Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс');
var dayArrayMed = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
var dayArrayLong = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var monthArrayShort = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var monthArrayMed = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec');
//var monthArrayLong = new Array('&#1071;&#1085;&#1074;&#1072;&#1088;&#1100;', '&#1060;&#1077;&#1074;&#1088;&#1072;&#1083;&#1100;', '&#1052;&#1072;&#1088;&#1090;', '&#1040;&#1087;&#1088;&#1077;&#1083;&#1100;', '&#1052;&#1072;&#1081;', '&#1080;&#1102;&#1085;&#1100;', '&#1080;&#1102;&#1083;&#1100;', '&#1040;&#1074;&#1075;&#1091;&#1089;&#1090;', '&#1057;&#1077;&#1085;&#1090;&#1103;&#1073;&#1088;&#1100;', '&#1054;&#1082;&#1090;&#1103;&#1073;&#1088;&#1100;', '&#1053;&#1086;&#1103;&#1073;&#1088;&#1100;', '&#1044;&#1077;&#1082;&#1072;&#1073;&#1088;&#1100;');
var monthArrayLong = new Array('Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь');
var defaultDateSeparator = "/";
var defaultDateFormat = "mdy"
var dateSeparator = defaultDateSeparator;
var dateFormat = defaultDateFormat;
var datePreZapros='';
var datePostZapros='';
var dateTargetDiv='';
function displayDatePicker(dateFieldName, displayBelowThisObject, dtFormat, dtSep, dtPre, dtPost, ajaxdtTdiv)
{
  var targetDateField = document.getElementsByName (dateFieldName).item(0);
  if (!displayBelowThisObject)
    displayBelowThisObject = targetDateField;
  if (dtSep)
    dateSeparator = dtSep;
  else
    dateSeparator = defaultDateSeparator;
  if (dtFormat)
    dateFormat = dtFormat;
  else
    dateFormat = defaultDateFormat;
  if (dtPre)
    datePreZapros = dtPre;
  if (dtPost)
    datePostZapros = dtPost;
  if (ajaxdtTdiv)
    dateTargetDiv = ajaxdtTdiv;
  var x = displayBelowThisObject.offsetLeft;
  var y = displayBelowThisObject.offsetTop + displayBelowThisObject.offsetHeight ;
  var parent = displayBelowThisObject;
  while (parent.offsetParent) {
    parent = parent.offsetParent;
    x += parent.offsetLeft;
    y += parent.offsetTop ;
  }
  if (ge(dateFieldName)){
  	datePickerDivID=dateFieldName;
  	drawDatePickerInDiv(targetDateField);
  	}
  else
  	drawDatePicker(targetDateField, x, y);
}
function drawDatePicker(targetDateField, x, y)
{
  var dt = getFieldDate(targetDateField.value );
  if (!document.getElementById(datePickerDivID)) {
    var newNode = document.createElement("div");
    newNode.setAttribute("id", datePickerDivID);
    newNode.setAttribute("class", "dpDiv");
    newNode.setAttribute("style", "visibility: hidden;");
    document.body.appendChild(newNode);
  }
  var pickerDiv = document.getElementById(datePickerDivID);
//  pickerDiv.style.position = "fixed";
  pickerDiv.style.position = "absolute";
  pickerDiv.style.left = x + "px";
  pickerDiv.style.top = y + "px";
  pickerDiv.style.visibility = (pickerDiv.style.visibility == "visible" ? "hidden" : "visible");
  pickerDiv.style.display = (pickerDiv.style.display == "block" ? "none" : "block");
  pickerDiv.style.zIndex = 10000;
  refreshDatePicker(targetDateField.name, dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function drawDatePickerInDiv(targetDateField)
{

  var dt = getFieldDate(targetDateField.value );
  var pickerDiv = document.getElementById(datePickerDivID);
  pickerDiv.style.visibility = (pickerDiv.style.visibility == "visible" ? "hidden" : "visible");
  pickerDiv.style.display = (pickerDiv.style.display == "block" ? "none" : "block");
  pickerDiv.style.zIndex = 10000;
  refreshDatePicker(targetDateField.name, dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function refreshDatePicker(dateFieldName, year, month, day)
{
  var thisDay = new Date();
  if ((month >= 0) && (year > 0)) {
    thisDay = new Date(year, month, 1);
  } else {
    day = thisDay.getDate();
    thisDay.setDate(1);
  }
  var crlf = "\r\n";
  var TABLE = "<table cols=7 class='dpTable'>" + crlf;
  var xTABLE = "</table>" + crlf;
  var TR = "<tr class='dpTR'>";
  var TR_title = "<tr class='dpTitleTR'>";
  var TR_days = "<tr class='dpDayTR'>";
  var TR_todaybutton = "<tr class='dpTodayButtonTR'>";
  var xTR = "</tr>" + crlf;
  var TD = "<td class='dpTD' onMouseOut='this.className=\"dpTD\";' onMouseOver=' this.className=\"dpTDHover\";' ";    // leave this tag open, because we'll be adding an onClick event
  var TD_title = "<td colspan=5 class='dpTitleTD'>";
  var TD_buttons = "<td class='dpButtonTD' align='center'>";
  var TD_todaybutton = "<td colspan=7 class='dpTodayButtonTD'>";
  var TD_days = "<td class='dpDayTD'>";
  var TD_selected = "<td class='dpDayHighlightTD' onMouseOut='this.className=\"dpDayHighlightTD\";' onMouseOver='this.className=\"dpTDHover\";' ";    // leave this tag open, because we'll be adding an onClick event
  var xTD = "</td>" + crlf;
  var DIV_title = "<div class='dpTitleText'>";
  var DIV_selected = "<div class='dpDayHighlight'>";
  var xDIV = "</div>";
  var html = TABLE;
  html += TR_title;
  html += TD_buttons + getButtonCode(dateFieldName, thisDay, -12, "&lt;&lt;","Год назад") + '<br />' + getButtonCode(dateFieldName, thisDay, -1, "&lt;","Месяц назад") + xTD;
  html += TD_title + DIV_title + monthArrayLong[ thisDay.getMonth()] + " " + thisDay.getFullYear() + xDIV + xTD;
  html += TD_buttons + getButtonCode(dateFieldName, thisDay, 12, "&gt;&gt;","Год вперед") + '<br />' + getButtonCode(dateFieldName, thisDay, 1, "&gt;","Месяц вперед") + xTD;
  html += xTR;
  html += TR_days;
//заголовки дней недели  
  for(i = 0; i < dayArrayShort.length; i++)
    html += TD_days + dayArrayShort[i] + xTD;
  html += xTR;
  html += TR;
  if (thisDay.getDay()==0){
  for (i = 0; i < 6; i++)
    html += TD + "&nbsp;" + xTD; 
  }else{
  for (i = 1; i < thisDay.getDay(); i++)
    html += TD + "&nbsp;" + xTD;
    }
  do {
    dayNum = thisDay.getDate();
    TD_onclick = " onclick=\"updateDateField('" + dateFieldName + "', '" + getDateString(thisDay) + "');\">";
    if (dayNum == day)
      html += TD_selected + TD_onclick + DIV_selected + dayNum + xDIV + xTD;
    else
      html += TD + TD_onclick + dayNum + xTD;
    if (thisDay.getDay() == 0)
      html += xTR + TR;
    thisDay.setDate(thisDay.getDate() + 1);
  } while (thisDay.getDate() > 1)
  if (thisDay.getDay() > 0) {
    for (i = 6; i > thisDay.getDay(); i--)
      html += TD + "&nbsp;" + xTD;
  }
  html += xTR;
  var today = new Date();
  var todayString = "Today is " + dayArrayMed[today.getDay()] + ", " + monthArrayMed[ today.getMonth()] + " " + today.getDate();
  html += TR_todaybutton + TD_todaybutton;
  html += "<button class='dpTodayButton' onClick='refreshDatePicker(\"" + dateFieldName + "\");'>&#1058;&#1077;&#1082;&#1091;&#1097;&#1072;&#1103;&nbsp;&#1076;&#1072;&#1090;&#1072;</button> ";
  html += "<button class='dpTodayButton' onClick='updateDateField(\"" + dateFieldName + "\");'>&#1047;&#1072;&#1082;&#1088;&#1099;&#1090;&#1100;</button>";
  html += xTD + xTR;
  html += xTABLE;
  document.getElementById(datePickerDivID).innerHTML = html;
  adjustiFrame();
}
function getButtonCode(dateFieldName, dateVal, adjust, label, title)
{
  var newMonth = (dateVal.getMonth () + adjust) % 12;
  var newYear = dateVal.getFullYear() + parseInt((dateVal.getMonth() + adjust) / 12);
  if (newMonth < 0) {
    newMonth += 12;
    newYear += -1;
  }
  return "<button title='" + title + "' class='dpButton' onClick='refreshDatePicker(\"" + dateFieldName + "\", " + newYear + ", " + newMonth + ");'>" + label + "</button>";
}
function getDateString(dateVal)
{
  var dayString = "00" + dateVal.getDate();
  var monthString = "00" + (dateVal.getMonth()+1);
  dayString = dayString.substring(dayString.length - 2);
  monthString = monthString.substring(monthString.length - 2);
  switch (dateFormat) {
    case "dmy" :
      return dayString + dateSeparator + monthString + dateSeparator + dateVal.getFullYear();
    case "ymd" :
      return dateVal.getFullYear() + dateSeparator + monthString + dateSeparator + dayString;
    case "mdy" :
    default :
      return monthString + dateSeparator + dayString + dateSeparator + dateVal.getFullYear();
  }
}
function getFieldDate(dateString)
{
  var dateVal;
  var dArray;
  var d, m, y;
  try {
    dArray = splitDateString(dateString);
    if (dArray) {
      switch (dateFormat) {
        case "dmy" :
          d = parseInt(dArray[0], 10);
          m = parseInt(dArray[1], 10) - 1;
          y = parseInt(dArray[2], 10);
          break;
        case "ymd" :
          d = parseInt(dArray[2], 10);
          m = parseInt(dArray[1], 10) - 1;
          y = parseInt(dArray[0], 10);
          break;
        case "mdy" :
        default :
          d = parseInt(dArray[1], 10);
          m = parseInt(dArray[0], 10) - 1;
          y = parseInt(dArray[2], 10);
          break;
      }
      dateVal = new Date(y, m, d);
    } else if (dateString) {
      dateVal = new Date(dateString);
    } else {
      dateVal = new Date();
    }
  } catch(e) {
    dateVal = new Date();
  }
  return dateVal;
}
function splitDateString(dateString)
{
  var dArray;
  if (dateString.indexOf("/") >= 0)
    dArray = dateString.split("/");
  else if (dateString.indexOf(".") >= 0)
    dArray = dateString.split(".");
  else if (dateString.indexOf("-") >= 0)
    dArray = dateString.split("-");
  else if (dateString.indexOf("\\") >= 0)
    dArray = dateString.split("\\");
  else
    dArray = false;
  return dArray;
}

function updateDateField(dateFieldName, dateString)
{
  var targetDateField = document.getElementsByName (dateFieldName).item(0);
  if (dateString)
    targetDateField.value = dateString;
  var pickerDiv = document.getElementById(datePickerDivID);
  pickerDiv.style.visibility = "hidden";
  pickerDiv.style.display = "none";
  adjustiFrame();
  ajax_post(datePreZapros+dateString+datePostZapros,dateTargetDiv);
  targetDateField.focus();
  if ((dateString) && (typeof(datePickerClosed) == "function"))
    datePickerClosed(targetDateField);
}
function adjustiFrame(pickerDiv, iFrameDiv)
{
  return;
  var is_opera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
  if (is_opera)
    return;
  try {
    if (!document.getElementById(iFrameDivID)) {
      var newNode = document.createElement("iFrame");
      newNode.setAttribute("id", iFrameDivID);
      newNode.setAttribute("src", "javascript:false;");
      newNode.setAttribute("scrolling", "no");
      newNode.setAttribute ("frameborder", "0");
      document.body.appendChild(newNode);
    }
    if (!pickerDiv)
      pickerDiv = document.getElementById(datePickerDivID);
    if (!iFrameDiv)
      iFrameDiv = document.getElementById(iFrameDivID);
    try {
      iFrameDiv.style.position = "absolute";
      iFrameDiv.style.width = pickerDiv.offsetWidth;
      iFrameDiv.style.height = pickerDiv.offsetHeight ;
      iFrameDiv.style.top = pickerDiv.style.top;
      iFrameDiv.style.left = pickerDiv.style.left;
      iFrameDiv.style.zIndex = pickerDiv.style.zIndex - 1;
      iFrameDiv.style.visibility = pickerDiv.style.visibility ;
      iFrameDiv.style.display = pickerDiv.style.display;
    } catch(e) {
    }
  } catch (ee) {
  }
}
//рисование графиков
function drawVisualizationColumn(data, options, div) {
	var chart = new google.visualization.ColumnChart(document.getElementById(div));
	chart.draw(data, options);
}
function drawVisualizationBar(data, options, div) {
	var chart = new google.visualization.BarChart(document.getElementById(div));
	chart.draw(data, options);
}
function drawVisualizationPie(data, options, div) {
	var chart = new google.visualization.PieChart(document.getElementById(div));
	chart.draw(data, options);
}
function drawVisualizationOrg(data, options, div) {
	var chart = new google.visualization.OrgChart(document.getElementById(div));
	chart.draw(data, options);
}