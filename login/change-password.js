// ======================================================
// CHANGE PASSWORD OTP SYSTEM
// ======================================================


const phoneNumber =
document.getElementById("phoneNumber");


const phoneGroup =
document.getElementById("phoneGroup");


const sendCodeBtn =
document.getElementById("sendCodeBtn");


const editPhoneBtn =
document.getElementById("editPhoneBtn");


const otpBoxes =
document.querySelectorAll(".otp-box");

const newPassword =
document.getElementById("newPassword");


const repeatPassword =
document.getElementById("repeatPassword");


const changePasswordBtn =
document.getElementById("changePasswordBtn");

let codeSent = false;



// ======================================================
// PHONE VALIDATION
// ======================================================

function validatePhone(phone){

    const regex = /^09\d{9}$/;

    return regex.test(phone);

}


// ======================================================
// SEND RESET OTP
// ======================================================

sendCodeBtn.addEventListener(
"click",
async()=>{


    const phone =
    phoneNumber.value.trim();



    if(!validatePhone(phone)){


        phoneGroup.classList.add(
            "invalid"
        );


        setTimeout(()=>{

            phoneGroup.classList.remove(
                "invalid"
            );

        },700);


        return;

    }



    try{


        sendCodeBtn.disabled = true;


        sendCodeBtn.innerHTML = `

            <span>
                در حال ارسال...
            </span>

        `;



        const response =
        await fetch(

            `${API_URL}/password-reset/send-reset-otp`,

            {

                method:"POST",


                headers:{

                    "Content-Type":
                    "application/json"

                },


                body:JSON.stringify({

                    phone:phone

                })

            }

        );



        const data =
        await response.json();



        console.log(
            "RESET OTP RESPONSE:",
            data
        );



        if(response.ok){


            phoneNumber.disabled = true;



            sendCodeBtn.innerHTML = `

                <span>
                    کد ارسال شد ✓
                </span>

                <i class="fa-solid fa-check"></i>

            `;



            otpBoxes.forEach(box=>{

                box.disabled = false;

            });



            codeSent = true;



        }

        else{


            throw new Error(
                data.message ||
                "ارسال کد ناموفق بود"
            );


        }



    }


    catch(error){


        console.log(
            "RESET OTP ERROR:",
            error
        );



        sendCodeBtn.disabled = false;



        sendCodeBtn.innerHTML = `

            <span>
                ارسال کد تایید
            </span>

            <i class="fa-solid fa-paper-plane"></i>

        `;



        alert(
            error.message ||
            "خطا در اتصال به سرور"
        );


    }



});




// ======================================================
// EDIT PHONE
// ======================================================


editPhoneBtn.addEventListener(
"click",
()=>{


phoneNumber.disabled=false;


phoneNumber.focus();



sendCodeBtn.disabled=false;



sendCodeBtn.innerHTML=`

<span>
ارسال کد تایید
</span>

<i class="fa-solid fa-paper-plane"></i>

`;



otpBoxes.forEach(box=>{


box.value="";

box.disabled=true;


});



codeSent=false;



});





// ======================================================
// OTP INPUT CONTROL
// ======================================================


otpBoxes.forEach(
(box,index)=>{


box.disabled=true;



box.addEventListener(
"input",
()=>{


box.value =
box.value.replace(
/\D/g,
""
);



if(
box.value &&
index < otpBoxes.length-1
){

otpBoxes[index+1].focus();

}



});



box.addEventListener(
"keydown",
(e)=>{


if(
e.key==="Backspace" &&
!box.value &&
index>0
){

otpBoxes[index-1].focus();

}



});


});



function showToast(message){


const toast =
document.getElementById("toast");


toast.querySelector("span")
.innerText = message;



toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2500);


}






// ======================================================
// VERIFY RESET OTP
// ======================================================


document
.getElementById("otpForm")
.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const otpCode =
[...otpBoxes]
.map(box=>box.value)
.join("");



const phone =
phoneNumber.value.trim();



if(otpCode.length !== 4){

    alert(
        "کد تایید را کامل وارد کنید"
    );

    return;

}




try{


const response =
await fetch(

`${API_URL}/password-reset/verify-reset-otp`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

phone:phone,

otp:otpCode

})


}

);





const data =
await response.json();



console.log(
"VERIFY RESET:",
data
);





if(!response.ok){


alert(
data.message || 
"کد تایید اشتباه است"
);


return;


}





showToast(
"کد تایید شد ✓"
);





sessionStorage.setItem(

"resetPhone",

phone

);






setTimeout(()=>{


document
.getElementById("otpForm")
.style.display="none";



document
.getElementById("passwordTab")
.style.display="block";



},1000);





}



catch(error){


console.log(

"VERIFY RESET ERROR:",

error

);



alert(

"خطا در اتصال به سرور"

);


}



});





























































// ======================================================
// CHANGE PASSWORD
// ======================================================


changePasswordBtn.addEventListener(
"click",
async()=>{


const password =
newPassword.value.trim();


const repeat =
repeatPassword.value.trim();



if(!password || !repeat){

    alert(
        "رمز عبور را کامل وارد کنید"
    );

    return;

}



if(password !== repeat){

    alert(
        "تکرار رمز عبور صحیح نیست"
    );

    return;

}



const phone =
sessionStorage.getItem(
    "resetPhone"
);



if(!phone){

    alert(
        "شماره کاربر پیدا نشد، دوباره تلاش کنید"
    );

    return;

}



try{


changePasswordBtn.disabled = true;


changePasswordBtn.innerHTML = `

<span>
در حال تغییر...
</span>

`;





const response =
await fetch(

`${API_URL}/password-reset/change-password`,

{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

phone:phone,

newPassword:password

})


}

);





const data =
await response.json();



console.log(
"CHANGE PASSWORD:",
data
);





if(response.ok){


showToast(
"رمز عبور با موفقیت تغییر کرد ✓"
);



sessionStorage.removeItem(
"resetPhone"
);



setTimeout(()=>{


window.location.href =
"../index1.html";


},1500);



}

else{


throw new Error(
data.message ||
"خطا در تغییر رمز"
);


}



}


catch(error){


console.log(
"CHANGE PASSWORD ERROR:",
error
);


alert(
error.message ||
"خطا در اتصال به سرور"
);



changePasswordBtn.disabled=false;


changePasswordBtn.innerHTML = `

<span>
تغییر رمز عبور
</span>

`;



}


});
