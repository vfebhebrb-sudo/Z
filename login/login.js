// ======================================================
// LOGIN SYSTEM
// Version 1.0
// ======================================================


console.log("Login JS Loaded");


// ======================================================
// ELEMENTS
// ======================================================


const loginForm =
document.getElementById("loginForm");


const loginIdentity =
document.getElementById("loginIdentity");


const loginPassword =
document.getElementById("loginPassword");


const loginBtn =
document.getElementById("loginBtn");


const loginBtnText =
document.getElementById("loginBtnText");


const loginError =
document.getElementById("loginError");


const loginSuccess =
document.getElementById("loginSuccess");


const passwordEye =
document.getElementById("passwordEye");


const passwordEyeIcon =
passwordEye.querySelector("i");



// ======================================================
// PASSWORD SHOW / HIDE
// ======================================================


passwordEye.addEventListener(
"click",
()=>{


    if(loginPassword.type === "password"){


        loginPassword.type="text";


        passwordEyeIcon.classList.remove(
            "fa-eye"
        );


        passwordEyeIcon.classList.add(
            "fa-eye-slash"
        );


    }

    else{


        loginPassword.type="password";


        passwordEyeIcon.classList.remove(
            "fa-eye-slash"
        );


        passwordEyeIcon.classList.add(
            "fa-eye"
        );


    }


});




// ======================================================
// IDENTITY VALIDATION
// EMAIL OR PHONE
// ======================================================


function validateIdentity(value){


    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const phoneRegex =
    /^09\d{9}$/;



    return (
        emailRegex.test(value)
        ||
        phoneRegex.test(value)
    );


}




// ======================================================
// FORM SUBMIT
// ======================================================


loginForm.addEventListener(
"submit",
async(e)=>{


    e.preventDefault();



    const identity =
    loginIdentity.value.trim();



    const password =
    loginPassword.value.trim();



    // پاک کردن پیام‌ها

    loginError.textContent="";

    loginSuccess.textContent="";



    // بررسی خالی بودن


    if(identity === "" || password === ""){


        loginError.textContent =
        "لطفاً تمام فیلدها را پر کنید";


        return;

    }



    // بررسی ایمیل یا شماره


    if(!validateIdentity(identity)){


        loginError.textContent =
        "ایمیل یا شماره تلفن صحیح نیست";


        return;

    }




    // حالت لودینگ


    loginBtn.disabled=true;


    loginBtnText.textContent =
    "در حال ورود...";





    try{



        const response =
await fetch(
    `${API_URL}/auth/login`,
    {


            method:"POST",


            headers:{


                "Content-Type":
                "application/json"


            },


            body:JSON.stringify({


                identity,

                password


            })


        });



        const data =
        await response.json();



        console.log(data);




        if(response.ok){



            loginSuccess.textContent =
            "ورود موفق بود ✓";



            loginBtnText.textContent =
            "ورود موفق ✓";



            localStorage.setItem(
                "authToken",
                data.token
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );


            setTimeout(()=>{


                window.location.href =
                "./index.html";


            },1000);



        }


        else{


            loginError.textContent =
            data.message ||
            "اطلاعات ورود اشتباه است";



            loginBtn.disabled=false;


            loginBtnText.textContent =
            "ورود به حساب";


        }



    }


    catch(error){



        console.log(error);



        loginError.textContent =
        "خطا در اتصال به سرور";



        loginBtn.disabled=false;



        loginBtnText.textContent =
        "ورود به حساب";



    }



});
