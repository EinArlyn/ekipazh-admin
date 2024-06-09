<form class='login_form' action='' method='post' enctype='multipart/form-data' OnSubmit="return ajax_form(this, ge('error'));">
 <progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>
 <input type='hidden' name='ajax' value=1> 	
 <img src="./img/logo.png" class="logo-image">
 <input style='width:80%;margin: 0 0 5px 0;' name="login" placeholder="Введите логин">
 <input style='width:80%;margin: 0 0 15px 0;' name="password" type="password" placeholder="Введите пароль">
 <br><input class='login_submit' type="submit" value="Вход">
 <div style='color:red;' id='error'></div> 
</form>