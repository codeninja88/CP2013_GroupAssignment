function expandMenu() {
    var click = document.getElementById("dropDownMenu");
    var menu = document.getElementById("menu");
    var width = screen.width;

    if ( width < 768) {

        if (click.value === "show") {
            click.value = "hide";
            menu.style.display = "none";
            console.log("SUP NIGGA 1");

        } else {
            click.value = "show";
            menu.style.display = "block";
            console.log("SUP NIGGA 2");
        }
    } else {
        click.value = "show";
        menu.style.display = "block"
    }
}