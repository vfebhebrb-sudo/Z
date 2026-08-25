/* =================================
        OTP SYSTEM
================================= */


const phoneNumber =
document.getElementById("phoneNumber");


const chatId =
document.getElementById("chatId");


const phoneGroup =
document.getElementById("phoneGroup");


const sendCodeBtn =
document.getElementById("sendCodeBtn");


const editPhoneBtn =
document.getElementById("editPhoneBtn");


const otpBoxes =
document.querySelectorAll(".otp-box");


const verifyBtn =
document.getElementById("verifyBtn");


const otpContainer =
document.querySelector(".otp-container");




/* =================================
        TOAST
================================= */


function showToast(text){

    const toast =
    document.getElementById("toast");


    if(!toast)
        return;


    const span =
    toast.querySelector("span");


    if(span)
        span.innerText = text;


    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}




/* =================================
        VALIDATION
================================= */


function validatePhone(phone){

    return /^09\d{9}$/.test(phone);

}




/* =================================
        TIMER
================================= */


function startOtpTimer(time){


    sendCodeBtn.disabled = true;


    const timer =
    setInterval(()=>{


        let min =
        Math.floor(time / 60);


        let sec =
        time % 60;



        sendCodeBtn.innerHTML = `

        <span>
            ارسال مجدد
            ${min}:${sec.toString().padStart(2,"0")}
        </span>

        `;



        time--;



        if(time < 0){


            clearInterval(timer);


            sendCodeBtn.disabled = false;


            sendCodeBtn.innerHTML = `

            <span>
                ارسال کد تایید
            </span>

            <i class="fa-solid fa-paper-plane"></i>

            `;

        }


    },1000);

}





/* =================================
        SEND OTP
================================= */


sendCodeBtn.addEventListener(
"click",
async()=>{


const phone =
phoneNumber.value.trim();



const rubikaChatId =
chatId.value.trim();




if(!validatePhone(phone)){


    phoneGroup.classList.add("invalid");


    setTimeout(()=>{

        phoneGroup.classList.remove("invalid");

    },700);


    return;

}




if(!rubikaChatId){


    alert(
        "شناسه روبیکا را وارد کنید"
    );


    return;

}





try{


sendCodeBtn.disabled = true;



sendCodeBtn.innerHTML = `

<div class="loading">

<div class="d1"></div>
<div class="d2"></div>

</div>

`;



console.log(
    "REQUEST URL:",
    `${API_URL}/auth/send-otp`
);



const response =
await fetch(

`${API_URL}/auth/send-otp`,

{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

phone:phone,

chatId:rubikaChatId

})

}

);




const data =
await response.json();



console.log(
    "OTP:",
    data
);





if(response.ok){



phoneNumber.disabled = true;



showToast(
    "کد تایید ارسال شد ✓"
);



otpBoxes.forEach(box=>{

    box.disabled=false;

});



startOtpTimer(120);



}

else{


throw new Error(
    data.message
);


}



}



catch(error){



console.log(
    "OTP ERROR:",
    error
);



sendCodeBtn.disabled=false;



sendCodeBtn.innerHTML = `

<span>
ارسال کد تایید
</span>

<i class="fa-solid fa-paper-plane"></i>

`;



showToast(
"ارسال کد انجام نشد ❌"
);



}



});







/* =================================
        EDIT PHONE
================================= */


editPhoneBtn.addEventListener(
"click",
()=>{


phoneNumber.disabled=false;


phoneNumber.focus();



sendCodeBtn.disabled=false;



sendCodeBtn.innerHTML = `

<span>
ارسال کد تایید
</span>

<i class="fa-solid fa-paper-plane"></i>

`;



otpBoxes.forEach(box=>{


box.value="";

box.disabled=true;


});


});






/* =================================
        OTP INPUT
================================= */


otpBoxes.forEach(
(box,index)=>{


box.disabled=true;



box.addEventListener(
"input",
()=>{


box.value =
box.value.replace(/\D/g,"");



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







/* =================================
        VERIFY OTP
================================= */


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



const rubikaChatId =
chatId.value.trim();




const registerData =
JSON.parse(
localStorage.getItem("registerData")
);





if(!registerData){


alert(
"اطلاعات ثبت نام پیدا نشد"
);


return;


}





if(otpCode.length !== 4){


alert(
"کد را کامل وارد کنید"
);


return;


}





try{



const response =
await fetch(

`${API_URL}/auth/verify-otp`,

{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

phone,

chatId:rubikaChatId,

otp:otpCode,

fullname:registerData.fullname,

email:registerData.email,

password:registerData.password

})


}

);




const data =
await response.json();





if(response.ok){



otpContainer.classList.add(
"valid"
);



verifyBtn.innerHTML = `

<span>
حساب ایجاد شد ✓
</span>

<i class="fa-solid fa-check"></i>

`;



localStorage.removeItem(
"registerData"
);




showToast(
"حساب شما با موفقیت ساخته شد ✓"
);




setTimeout(()=>{


window.location.href =
"../index1.html";


},2000);





}
else{


alert(
data.message
);


}





}



catch(error){


console.log(error);


alert(
"خطا در اتصال به سرور"
);


}



});
