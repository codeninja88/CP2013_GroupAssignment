function createUserForm() {

    document.getElementById("innerContainerRight").innerHTML = " <form method='post'> " +
        " <span>First Name:</span> " +
        " <input type='text' name='firstName' required='required' /> " +
        " <br/> " +
        " <span>Last Name:</span> " +
        " <input type='text' name='lastName' required='required' /> " +
        " <br/> " +
        " <span>Username:</span>" +
        " <input type='username' name='username' required='required' /> " +

        " <br/> " +
        " <span>Password:</span> " +
        " <input type='password' name='password' required='required' />" +
        " <br/> " +
        " <input type='submit' />" +
        " </form> ";


}