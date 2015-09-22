function createUserForm(){
    document.getElementById("innerContainerRight").innerHTML =

        " <form method='post'> " +

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

        " <span>User Level:</span> " +
        " <input type='radio' name='userLevel' required='required' value='0' checked/>User" +
        " <input type='radio' name='userLevel' required='required' value='1'/>Admin" +
        " <br/>" +

        " <span>Address:</span>" +
        " <input type='text' name='address' /> " +
        " <br/> " +

        " <span>Phone:</span>" +
        " <input type='text' name='phone' /> " +
        " <br/> " +

        " <span>Email:</span>" +
        " <input type='text' name='email' /> " +
        " <br/> " +

        " <input type='hidden' name='formName' value='createUser'/>" +


        " <input type='submit' />" +

        " </form> ";
}

