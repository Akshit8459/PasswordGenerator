const inputSlider = document.querySelector("[data-lengthSlider]");
const length=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckbox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_+=-[]}{;":,.<>/?';

let password="";
let passwordLength=8;
let checkCount=0;
handleSlider();
setIndicator("#ccc")
//set value according to slider
function handleSlider(){
    inputSlider.value=passwordLength;
    length.innerText=passwordLength;
    const min=inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize= ((passwordLength -min )*100/(max-min))+"% 100%";
};

//set indicator
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow='0px 0px 12px 1px'+color;
};
//random generator
function getRandomInteger(min,max){
    return Math.floor(Math.random()* [max-min])+min ;
};
function generateRandomNumber(){
    return getRandomInteger(0,9);
};
function generatelowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
};
function generateupperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
};
function generateSymbol(){
    const randNum= getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
};
function calculateStrength(){
    let hasUpper=false;
    hasLower=false;
    hasNumber=false;
    hasSymbol=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower &&(hasNumber || hasSymbol)&& passwordLength>=8){
        setIndicator("#0f0");
    }else if((hasLower||hasUpper)&&(hasNumber||hasSymbol)&&passwordLength>=6){
        setIndicator("##ff0");
    }else{
        setIndicator("#f00");
    }
};
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText="Copied!";
    }
    catch(e){
        copyMsg.innerText="Failed :(";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active")
    },2000);
};

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});
copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange(){
    checkCount=0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange());
});


function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

};

generateBtn.addEventListener('click',()=>{

    if(checkCount<=0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password="";
    //neccesity    
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateupperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generatelowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    for(let i=0;i<funcArr;i++){
        password+=funcArr[i]();
    }
    //remaining
    for(let i=0;i<(passwordLength);i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    //shuffling pass
    password=shufflePassword(Array.from(password));
    passwordDisplay.value= password;
    calculateStrength();
    console.log(passwordDisplay.textContent)
    console.log("password:",password);
});