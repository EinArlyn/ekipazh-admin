OnLoad=ge('view').style.transform = 'scale('+document.body.clientWidth/1920+')';
window.onresize = function ()
{
	var width=2*this.innerWidth-this.outerWidth-1;
	ge('view').style.transform = 'scale('+width/1920+')';	
}
