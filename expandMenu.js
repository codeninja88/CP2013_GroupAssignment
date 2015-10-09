function expandMenu() {
    var click = document.getElementById("dropDownMenu");
    var menu = document.getElementById("menu");
    var width = screen.width;
    console.log(click.value);
    console.log(width);
    if ( width < 768) {

        if (click.value === "show") {
            click.value = "hide";
            menu.style.display = "none";
            console.log("SUP");

        } else {
            click.value = "show";
            menu.style.display = "block";
            console.log("SUP 2");
        }
    } else {
        click.value = "show";
        menu.style.display = "block"
    }
}