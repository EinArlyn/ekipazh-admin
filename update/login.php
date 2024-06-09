<div class=menu>
<div style='position:relative;width:100%;font-family: MontserratBold;'>
 <form style="width:600px; padding:0; margin:auto; background:none; z-index:3;" action='' method='post' enctype='multipart/form-data' OnSubmit="return ajax_form(this, ge('error'));">
  <progress style='float:left;display:none;' class='pBar' min=0 max=100 value=0>0% complete</progress>
  <input style='font-size: 40px;margin:20px 0;border:1px solid #fff;' name="login" placeholder="enter login">
  <input style='font-size: 40px;margin:20px 0;border:1px solid #fff;' name="password" type="password" placeholder="enter password">
  <input type='hidden' name='ajax' value=1>
  <input style='font-size: 40px;margin:20px 0;border:1px solid #fff;background:#ccc;' type="submit" value="Вход">
  <div style='font-size: 40px;color:red;' id='error'></div>
 </form>
</div>
</div>
